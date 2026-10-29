import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { S3, buildS3Key } from '../../instanse'

export const deleteImageFromBucket = async ({
  urlOldPhotoPath = '',
  bucketName,
  folderPath
}: {
  urlOldPhotoPath: string
  bucketName: string
  folderPath: string
}) => {
  try {
    if (urlOldPhotoPath === '') {
      new Error('You must specify a valid URL')
    }
    const patchKey = urlOldPhotoPath.substring(urlOldPhotoPath.lastIndexOf('/') + 1)
    const newKey = buildS3Key(folderPath, patchKey)
    const res = await S3.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: newKey
      })
    )

    console.log(`Successfully deleted ${res.$metadata.httpStatusCode}`)
  } catch (error) {
    console.log(
      'Ошибка при удалении изображения из S3 [src/lib/s3-bucket/utils/delete-img/index.ts] function deleteImageFromBucket:',
      error
    )
  }
}
