import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { toFile } from "openai/uploads"
import { auth } from "@/auth"
import { prisma } from "@/shared/lib/prisma"
import openai from "@/shared/lib/openai"

export const runtime = "nodejs"

const MAX_FILE_SIZE =
  20 * 1024 * 1024

const PROCESS_TIMEOUT_MS =
  120_000

const POLL_INTERVAL_MS =
  2_000

const MAX_POLL_ATTEMPTS =
  30

type SessionUser = {
  id?: string
  orgId?: string | null
}

type RouteContext = {
  params: Promise<{
    knowledgeId: string
  }>
}

function getSessionContext(
  session: {
    user?: SessionUser | null
  },
) {
  const userId =
    typeof session.user?.id === "string"
      ? session.user.id.trim()
      : ""

  const orgId =
    typeof session.user?.orgId === "string"
      ? session.user.orgId.trim()
      : ""

  return {
    userId,
    orgId,
  }
}

function getSafeFileName(
  value: string | null,
) {
  if (!value) {
    return "knowledge-source"
  }

  const cleaned =
    value
      .replace(
        /[^a-zA-Z0-9._-]/g,
        "_",
      )
      .slice(
        0,
        180,
      )

  return (
    cleaned ||
    "knowledge-source"
  )
}

function getContentType(
  mimeType: string | null,
) {
  if (
    typeof mimeType ===
    "string" &&
    mimeType.trim()
  ) {
    return mimeType.trim()
  }

  return "application/octet-stream"
}

function isPrivateHostname(
  hostname: string,
) {
  const value =
    hostname
      .trim()
      .toLowerCase()

  if (
    value ===
      "localhost" ||
    value.endsWith(
      ".localhost",
    ) ||
    value ===
      "127.0.0.1" ||
    value ===
      "::1" ||
    value ===
      "0.0.0.0"
  ) {
    return true
  }

  /**
   * IPv4 private/reserved ranges.
   */
  const ipv4 =
    value.match(
      /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/,
    )

  if (ipv4) {
    const parts =
      ipv4
        .slice(1)
        .map(Number)

    if (
      parts.some(
        (part) =>
          part < 0 ||
          part > 255,
      )
    ) {
      return true
    }

    const [
      a,
      b,
    ] = parts

    if (
      a === 10 ||
      a === 127 ||
      a === 0
    ) {
      return true
    }

    if (
      a === 172 &&
      b >= 16 &&
      b <= 31
    ) {
      return true
    }

    if (
      a === 192 &&
      b === 168
    ) {
      return true
    }

    if (
      a === 169 &&
      b === 254
    ) {
      return true
    }

    return false
  }

  /**
   * Common internal/reserved IPv6 forms.
   */
  if (
    value.includes(":")
  ) {
    if (
      value ===
        "::1" ||
      value.startsWith(
        "fc",
      ) ||
      value.startsWith(
        "fd",
      ) ||
      value.startsWith(
        "fe80:",
      )
    ) {
      return true
    }
  }

  return false
}

function validateSourceUrl(
  value: string,
) {
  let url: URL

  try {
    url =
      new URL(value)
  } catch {
    return {
      valid: false,
      error:
        "Knowledge source fileUrl is not a valid URL.",
    }
  }

  if (
    url.protocol !==
      "https:" &&
    url.protocol !==
      "http:"
  ) {
    return {
      valid: false,
      error:
        "Knowledge source fileUrl must use HTTP or HTTPS.",
    }
  }

  if (
    url.username ||
    url.password
  ) {
    return {
      valid: false,
      error:
        "Knowledge source fileUrl cannot contain credentials.",
    }
  }

  if (
    isPrivateHostname(
      url.hostname,
    )
  ) {
    return {
      valid: false,
      error:
        "Knowledge source fileUrl points to a private or local address.",
    }
  }

  return {
    valid: true,
    url,
  }
}

async function fetchSourceFile(
  url: URL,
) {
  const controller =
    new AbortController()

  const timeout =
    setTimeout(
      () =>
        controller.abort(),
      PROCESS_TIMEOUT_MS,
    )

  try {
    const response =
      await fetch(
        url.toString(),
        {
          method: "GET",
          redirect: "follow",
          signal:
            controller.signal,
          headers: {
            Accept:
              "*/*",
            "User-Agent":
              "KoniqTech-AI-Knowledge/1.0",
          },
          cache:
            "no-store",
        },
      )

    if (!response.ok) {
      throw new Error(
        `Source file download failed with HTTP ${response.status}.`,
      )
    }

    const contentLength =
      response.headers.get(
        "content-length",
      )

    if (
      contentLength
    ) {
      const size =
        Number(
          contentLength,
        )

      if (
        Number.isFinite(
          size,
        ) &&
        size >
          MAX_FILE_SIZE
      ) {
        throw new Error(
          "Knowledge source file exceeds the 20 MB processing limit.",
        )
      }
    }

    const buffer =
      Buffer.from(
        await response.arrayBuffer(),
      )

    if (
      buffer.length ===
        0
    ) {
      throw new Error(
        "Knowledge source file is empty.",
      )
    }

    if (
      buffer.length >
      MAX_FILE_SIZE
    ) {
      throw new Error(
        "Knowledge source file exceeds the 20 MB processing limit.",
      )
    }

    return {
      buffer,
      contentType:
        response.headers.get(
          "content-type",
        ),
    }
  } finally {
    clearTimeout(
      timeout,
    )
  }
}

async function waitForVectorStoreFile(
  vectorStoreId: string,
  vectorFileId: string,
) {
  for (
    let attempt = 0;
    attempt <
    MAX_POLL_ATTEMPTS;
    attempt++
  ) {
    const vectorFile =
      await openai.vectorStores.files.retrieve(
        vectorFileId,
        {
          vector_store_id:
            vectorStoreId,
        },
      )

    if (
      vectorFile.status ===
      "completed"
    ) {
      return vectorFile
    }

    if (
      vectorFile.status ===
        "failed" ||
      vectorFile.status ===
        "cancelled"
    ) {
      throw new Error(
        `OpenAI vector indexing failed with status "${vectorFile.status}".`,
      )
    }

    await new Promise(
      (resolve) =>
        setTimeout(
          resolve,
          POLL_INTERVAL_MS,
        ),
    )
  }

  throw new Error(
    "OpenAI vector indexing timed out.",
  )
}

/**
 * POST /api/ai/knowledge/[knowledgeId]/process
 *
 * Downloads the configured knowledge file,
 * uploads it to OpenAI, adds it to a vector
 * store, waits for indexing, and marks the
 * knowledge source as ready.
 */
export async function POST(
  _request: Request,
  context: RouteContext,
) {
  let knowledgeId = ""

  try {
    const session =
      await auth()

    if (
      !session?.user?.id
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unauthorized",
        },
        {
          status: 401,
        },
      )
    }

    const {
      userId,
      orgId,
    } = getSessionContext(
      session,
    )

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unauthorized",
        },
        {
          status: 401,
        },
      )
    }

    if (!orgId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Organization context is required.",
        },
        {
          status: 403,
        },
      )
    }

    const params =
      await context.params

    knowledgeId =
      typeof params.knowledgeId ===
      "string"
        ? params.knowledgeId.trim()
        : ""

    if (!knowledgeId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Knowledge source ID is required.",
        },
        {
          status: 400,
        },
      )
    }

    /**
     * Check organization AI settings.
     */
    const settings =
      await prisma.organizationSettings.findFirst(
        {
          where: {
            orgId,
          },

          select: {
            aiEnabled:
              true,
            aiKnowledgeEnabled:
              true,
          },
        },
      )

    if (
      settings &&
      !settings.aiEnabled
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI is disabled for this organization.",
          code:
            "AI_DISABLED",
        },
        {
          status: 403,
        },
      )
    }

    if (
      settings &&
      !settings.aiKnowledgeEnabled
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI knowledge is disabled for this organization.",
          code:
            "AI_KNOWLEDGE_DISABLED",
        },
        {
          status: 403,
        },
      )
    }

    /**
     * Load the source using both the source ID
     * and organization ID.
     */
    const source =
      await prisma.aiKnowledgeSource.findFirst(
        {
          where: {
            id:
              knowledgeId,
            orgId,
          },

          select: {
            id: true,
            orgId: true,
            name: true,
            sourceType:
              true,
            fileName:
              true,
            fileUrl:
              true,
            mimeType:
              true,
            fileSize:
              true,
            vectorStoreId:
              true,
            vectorFileId:
              true,
            status:
              true,
            error:
              true,
            metadata:
              true,
          },
        },
      )

    if (!source) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI knowledge source not found.",
        },
        {
          status: 404,
        },
      )
    }

    /**
     * Do not process archived sources.
     */
    if (
      source.status ===
      "archived"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Archived knowledge sources cannot be processed.",
          code:
            "KNOWLEDGE_SOURCE_ARCHIVED",
        },
        {
          status: 409,
        },
      )
    }

    /**
     * Prevent duplicate processing requests.
     */
    if (
      source.status ===
      "processing"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This knowledge source is already being processed.",
          code:
            "KNOWLEDGE_SOURCE_PROCESSING",
        },
        {
          status: 409,
        },
      )
    }

    if (!source.fileUrl) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Knowledge source does not have a fileUrl.",
          code:
            "KNOWLEDGE_FILE_URL_REQUIRED",
        },
        {
          status: 400,
        },
      )
    }

    const urlValidation =
      validateSourceUrl(
        source.fileUrl,
      )

    if (
      !urlValidation.valid ||
      !urlValidation.url
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            urlValidation.error ??
            "Invalid source URL.",
          code:
            "INVALID_KNOWLEDGE_FILE_URL",
        },
        {
          status: 400,
        },
      )
    }

    /**
     * Atomically claim the source for processing.
     *
     * This protects against two simultaneous
     * requests both starting the same job.
     */
    const claimed =
      await prisma.aiKnowledgeSource.updateMany(
        {
          where: {
            id:
              source.id,
            orgId,

            status: {
              not:
                "processing" as any,
            },
          },

          data: {
            status:
              "processing" as any,
            error:
              null,
          },
        },
      )

    if (
      claimed.count !==
      1
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Knowledge source could not be claimed for processing. It may already be processing.",
          code:
            "KNOWLEDGE_SOURCE_BUSY",
        },
        {
          status: 409,
        },
      )
    }

    try {
      /**
       * Download the source.
       */
      const downloaded =
        await fetchSourceFile(
          urlValidation.url,
        )

      /**
       * Use the database MIME type first,
       * then the remote content type.
       */
      const contentType =
        getContentType(
          source.mimeType ??
            downloaded.contentType,
        )

      /**
       * Use a safe filename.
       */
      const filename =
        getSafeFileName(
          source.fileName,
        )

      /**
       * Upload the document to OpenAI.
       */
      const uploadedFile =
        await openai.files.create(
          {
            file:
              await toFile(
                downloaded.buffer,
                filename,
                {
                  type:
                    contentType,
                },
              ),

            purpose:
              "assistants",
          },
        )

      /**
       * Create a vector store if this knowledge
       * source does not already have one.
       */
      let vectorStoreId =
        source.vectorStoreId

      if (!vectorStoreId) {
        const vectorStore =
          await openai.vectorStores.create(
            {
              name:
                `KoniqTech Knowledge - ${source.name}`.slice(
                  0,
                  250,
                ),
              metadata: {
                orgId,
                knowledgeId:
                  source.id,
              },
            },
          )

        vectorStoreId =
          vectorStore.id
      }

      /**
       * Add the uploaded file to the vector store.
       */
      const vectorFile =
        await openai.vectorStores.files.create(
          vectorStoreId,
          {
            file_id:
              uploadedFile.id,
          },
        )

      /**
       * Persist OpenAI IDs immediately so a later
       * retry can identify what was created.
       */
      await prisma.aiKnowledgeSource.update(
        {
          where: {
            id:
              source.id,
          },

          data: {
            vectorStoreId,
            vectorFileId:
              vectorFile.id,
          },
        },
      )

      /**
       * Wait until OpenAI has completed indexing.
       */
      const completedVectorFile =
        await waitForVectorStoreFile(
          vectorStoreId,
          vectorFile.id,
        )

      /**
       * Mark the knowledge source ready only
       * after OpenAI confirms completion.
       */
      const readySource =
        await prisma.aiKnowledgeSource.update(
          {
            where: {
              id:
                source.id,
            },

            data: {
              status:
                "ready" as any,
              error:
                null,
              vectorStoreId,
              vectorFileId:
                completedVectorFile.id,
              fileSize:
                downloaded.buffer.length,
            },

            select:
              {
                id: true,
                orgId: true,
                name: true,
                sourceType:
                  true,
                fileName:
                  true,
                fileUrl:
                  true,
                mimeType:
                  true,
                fileSize:
                  true,
                vectorStoreId:
                  true,
                vectorFileId:
                  true,
                status:
                  true,
                error:
                  true,
                metadata:
                  true,
                createdAt:
                  true,
                updatedAt:
                  true,
              },
          },
        )

      return NextResponse.json(
        {
          success: true,
          processed: true,
          source:
            readySource,
          openai: {
            fileId:
              uploadedFile.id,
            vectorStoreId,
            vectorFileId:
              completedVectorFile.id,
            status:
              completedVectorFile.status,
          },
        },
      )
    } catch (processingError) {
      const errorMessage =
        processingError instanceof
        Error
          ? processingError.message
          : "Knowledge processing failed."

      console.error(
        "[AI_KNOWLEDGE_PROCESS]",
        {
          knowledgeId:
            source.id,
          orgId,
          error:
            processingError,
        },
      )

      await prisma.aiKnowledgeSource.updateMany(
        {
          where: {
            id:
              source.id,
            orgId,
          },

          data: {
            status:
              "failed" as any,
            error:
              errorMessage.slice(
                0,
                2000,
              ),
          },
        },
      )

      return NextResponse.json(
        {
          success: false,
          processed: false,
          error:
            "Knowledge source processing failed.",
          code:
            "KNOWLEDGE_PROCESSING_FAILED",
        },
        {
          status: 500,
        },
      )
    }
  } catch (error) {
    console.error(
      "[AI_KNOWLEDGE_PROCESS_ROUTE]",
      {
        knowledgeId,
        error,
      },
    )

    if (
      knowledgeId
    ) {
      try {
        await prisma.aiKnowledgeSource.updateMany(
          {
            where: {
              id:
                knowledgeId,
              status:
                "processing" as any,
            },

            data: {
              status:
                "failed" as any,
              error:
                "Knowledge processing failed unexpectedly.",
            },
          },
        )
      } catch (updateError) {
        console.error(
          "[AI_KNOWLEDGE_PROCESS_STATUS_UPDATE]",
          updateError,
        )
      }
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to process AI knowledge source.",
        code:
          "KNOWLEDGE_PROCESSING_FAILED",
      },
      {
        status: 500,
      },
    )
  }
}