
import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTrigger } from "./ui/dialog";

export function DialogFormWithTrigger({ children, formAction, trigger }: { children: React.ReactNode, formAction: (payload: FormData) => void, trigger: React.ReactNode }) {
  return (
    <Dialog>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent className="sm:max-w-[425px]">
            <form className="grid gap-4" action={formAction}>
              {children}
            </form>
          </DialogContent>
        </DialogPortal>
      </Dialog>
  )
}