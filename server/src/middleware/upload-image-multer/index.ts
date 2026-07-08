import multer from 'multer'

export const uploadImageMulter = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (_, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const isValidType = allowedTypes.test(file.mimetype)

    if (isValidType) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  }
})
