import { toast } from 'react-toastify'

export const showErrorToastUtil = (message: string, error?: unknown) => {
  toast(message, { theme: 'colored', type: 'error' })

  if (error) {
    console.log(`${message}`, error)
  }
}
