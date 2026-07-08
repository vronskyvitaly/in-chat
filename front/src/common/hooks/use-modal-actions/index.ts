import { useState } from 'react'

type TProps = {
  initialOpen?: boolean
}

export const useModalActions = ({ initialOpen = false }: TProps = {}) => {
  const [isOpen, setIsOpen] = useState(initialOpen)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen(prev => !prev)

  return { isOpen, open, close, toggle }
}
