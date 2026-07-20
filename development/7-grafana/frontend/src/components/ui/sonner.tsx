import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => (
  <Sonner
    className="toaster group"
    toastOptions={{
      classNames: {
        toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-ink group-[.toaster]:border-border group-[.toaster]:shadow-soft",
        description: "group-[.toast]:text-muted-foreground",
        actionButton: "group-[.toast]:bg-brand group-[.toast]:text-white",
        cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
      },
    }}
    {...props}
  />
);

export { Toaster };
