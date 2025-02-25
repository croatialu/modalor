import {
  DialogRoot,
  Button,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger
} from "@chakra-ui/react"
import { PropsWithChildren } from "react"

interface ModalProps {
  open?: boolean
  isOkLoading?: boolean
  isOkDisabled?: boolean
  title: string
  description: string


  onCancel?: () => void
  onOk?: () => void
}

export const Modal = ({
  open,
  title,
  description,
  children,
  isOkLoading,
  isOkDisabled,
  onCancel,
  onOk
}: PropsWithChildren<ModalProps>) => {
  return (
    <DialogRoot open={open}>
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
          >Save</Button>

        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}