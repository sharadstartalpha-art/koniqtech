import { z } from "zod";

export const uploadFileSchema =
  z.object({
    key: z
      .string()
      .trim()
      .min(
        1,
        "File key is required."
      )
      .max(
        500,
        "File key is too long."
      ),

    contentType: z
      .string()
      .trim()
      .min(
        1,
        "Content type is required."
      )
      .max(
        100,
        "Content type is too long."
      ),

    fileName: z
      .string()
      .trim()
      .min(
        1,
        "File name is required."
      )
      .max(
        255,
        "File name is too long."
      )
      .optional(),
  });

export type UploadFileInput =
  z.infer<
    typeof uploadFileSchema
  >;

export const deleteFileSchema =
  z.object({
    key: z
      .string()
      .trim()
      .min(
        1,
        "File key is required."
      )
      .max(
        500,
        "File key is too long."
      ),
  });

export type DeleteFileInput =
  z.infer<
    typeof deleteFileSchema
  >;

export const signedUrlSchema =
  z.object({
    key: z
      .string()
      .trim()
      .min(
        1,
        "File key is required."
      )
      .max(
        500,
        "File key is too long."
      ),

    expiresIn: z
      .coerce
      .number()
      .int()
      .min(
        60,
        "Minimum expiry is 60 seconds."
      )
      .max(
        86400,
        "Maximum expiry is 86400 seconds."
      )
      .default(3600),
  });

export type SignedUrlInput =
  z.infer<
    typeof signedUrlSchema
  >;