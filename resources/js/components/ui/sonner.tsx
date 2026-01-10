import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            theme="light"
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
                    description: "group-[.toast]:text-muted-foreground",
                    actionButton:
                        "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                    cancelButton:
                        "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
                    // Success toasts - Green
                    success: "group-[.toast]:bg-green-50 group-[.toast]:text-green-800 group-[.toast]:border-green-200 dark:group-[.toast]:bg-green-900/20 dark:group-[.toast]:text-green-400 dark:group-[.toast]:border-green-800",
                    // Error toasts - Red  
                    error: "group-[.toast]:bg-red-50 group-[.toast]:text-red-800 group-[.toast]:border-red-200 dark:group-[.toast]:bg-red-900/20 dark:group-[.toast]:text-red-400 dark:group-[.toast]:border-red-800",
                    // Warning toasts - Orange/Yellow
                    warning: "group-[.toast]:bg-orange-50 group-[.toast]:text-orange-800 group-[.toast]:border-orange-200 dark:group-[.toast]:bg-orange-900/20 dark:group-[.toast]:text-orange-400 dark:group-[.toast]:border-orange-800",
                    // Info toasts - Default/Blue
                    info: "group-[.toast]:bg-blue-50 group-[.toast]:text-blue-800 group-[.toast]:border-blue-200 dark:group-[.toast]:bg-blue-900/20 dark:group-[.toast]:text-blue-400 dark:group-[.toast]:border-blue-800",
                },
            }}
            {...props}
        />
    )
}

export { Toaster }