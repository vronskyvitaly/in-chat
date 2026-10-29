import { S3Client } from '@aws-sdk/client-s3'

// S3-совместимое хранилище (по умолчанию — Timeweb Cloud, подключённое в Coolify)
export const S3_ENDPOINT = process.env.S3_ENDPOINT || 'https://s3.twcstorage.ru'

// Общий префикс ключей: бакет делится с другими проектами, файлы IN CHAT лежат в своей папке
const S3_KEY_PREFIX = (process.env.S3_KEY_PREFIX ?? 'in-chat').replace(/^\/+|\/+$/g, '')

export const S3 = new S3Client({
  region: process.env.S3_REGION || 'ru-1',
  endpoint: S3_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_SECRET_ACCCESS_KEY as string
  }
})

export const buildS3Key = (folderPath: string, fileName: string) =>
  [S3_KEY_PREFIX, folderPath, fileName].filter(Boolean).join('/')

export const buildS3PublicUrl = (bucketName: string, key: string) =>
  `${S3_ENDPOINT.replace(/\/+$/, '')}/${bucketName}/${key}`
