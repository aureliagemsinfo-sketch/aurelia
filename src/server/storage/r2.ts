import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

type UploadUrlInput = {
  key: string;
  contentType: string;
  expiresIn?: number;
};

function getR2Client() {
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("Cloudflare R2 credentials are not configured.");
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

function getR2Bucket() {
  const bucket = process.env.CLOUDFLARE_R2_BUCKET;

  if (!bucket) {
    throw new Error("CLOUDFLARE_R2_BUCKET is not configured.");
  }

  return bucket;
}

export function isR2Configured() {
  return Boolean(
    process.env.CLOUDFLARE_R2_ACCOUNT_ID &&
      process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
      process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY &&
      process.env.CLOUDFLARE_R2_BUCKET &&
      process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL,
  );
}

export function buildStorageKey(...parts: Array<string | undefined | null>) {
  return parts
    .filter(Boolean)
    .map((part) =>
      String(part)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9._/-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^\/+|\/+$/g, ""),
    )
    .filter(Boolean)
    .join("/");
}

export function getPublicR2Url(key: string) {
  const publicBaseUrl = process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL;

  if (!publicBaseUrl) {
    throw new Error("CLOUDFLARE_R2_PUBLIC_BASE_URL is not configured.");
  }

  return `${publicBaseUrl.replace(/\/$/, "")}/${key.replace(/^\//, "")}`;
}

export async function createUploadPresignedUrl({
  key,
  contentType,
  expiresIn = 60 * 5,
}: UploadUrlInput) {
  const command = new PutObjectCommand({
    Bucket: getR2Bucket(),
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(getR2Client(), command, { expiresIn });

  return {
    key,
    uploadUrl,
    publicUrl: getPublicR2Url(key),
  };
}
