"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void | Promise<void>
  loading?: boolean
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Confirm delete",
  description = "Are you sure you want to delete this? This cannot be recovered.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant="destructive"
            onClick={() => onConfirm()}
            disabled={loading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
