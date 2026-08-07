import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

if (!process.env.AWS_REGION) {
  throw new Error("AWS_REGION is missing.");
}

if (!process.env.AWS_BUCKET_NAME) {
  throw new Error("AWS_BUCKET_NAME is missing.");
}

if (!process.env.AWS_ACCESS_KEY_ID) {
  throw new Error("AWS_ACCESS_KEY_ID is missing.");
}

if (!process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error(
    "AWS_SECRET_ACCESS_KEY is missing."
  );
}

export const STORAGE_BUCKET =
  process.env.AWS_BUCKET_NAME;

export const s3 = new S3Client({
  region: process.env.AWS_REGION,

  credentials: {
    accessKeyId:
      process.env.AWS_ACCESS_KEY_ID,

    secretAccessKey:
      process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function testBucket() {
  await s3.send(
    new HeadBucketCommand({
      Bucket: STORAGE_BUCKET,
    })
  );

  return true;
}

export async function uploadObject(
  key: string,
  body: Buffer | Uint8Array | string,
  contentType: string
) {
  await s3.send(
    new PutObjectCommand({
      Bucket: STORAGE_BUCKET,

      Key: key,

      Body: body,

      ContentType: contentType,
    })
  );

  return key;
}

export async function deleteObject(
  key: string
) {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: STORAGE_BUCKET,

      Key: key,
    })
  );

  return true;
}

export async function getObjectUrl(
  key: string,
  expiresIn = 3600
) {
  return getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: STORAGE_BUCKET,

      Key: key,
    }),
    {
      expiresIn,
    }
  );
}