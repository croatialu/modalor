import type { PropsWithChildren } from 'react'
import {
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@chakra-ui/react'

interface ModalProps {
  open?: boolean
  isOkLoading?: boolean
  isOkDisabled?: boolean
  title: string
  description: string

  onCancel?: () => void
  onOk?: () => void
}

export function Modal({
  open,
  title,
  description,
  children,
  isOkLoading,
  isOkDisabled,
  onCancel,
  onOk,
}: PropsWithChildren<ModalProps>) {
  return (
    <DialogRoot open={open} modal placement="center" motionPreset="slide-in-bottom">
      <DialogBackdrop />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p>
            {description}
          </p>

          {children}
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>

          <Button
            loading={isOkLoading}
            disabled={isOkDisabled}
            onClick={onOk}
          >
            Save
          </Button>

        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  )
}
