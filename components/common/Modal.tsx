import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export default function Modal({ isOpen, onClose, title, children }: Props) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(o)=>!o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 data-[state=open]:animate-in data-[state=closed]:animate-out" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-4 shadow-xl">
          <div className="flex items-center justify-between border-b pb-2">
            <Dialog.Title className="text-lg font-semibold text-gray-900">{title ?? "Modal"}</Dialog.Title>
            <Dialog.Close asChild>
              <button aria-label="Cerrar" className="p-1 rounded hover:bg-black/5 text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>
          <div className="pt-3">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
