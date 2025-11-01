import { useTheme } from '@/components/theme-provider'
import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      position='bottom-right'
      expand={true}
      richColors={false}
      closeButton={true}
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-l-4 group-[.toaster]:border-y group-[.toaster]:border-r group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg group-[.toaster]:backdrop-blur-sm group-[.toaster]:pr-8',
          title: 'group-[.toast]:font-semibold group-[.toast]:text-sm',
          description: 'group-[.toast]:text-muted-foreground group-[.toast]:text-xs group-[.toast]:mt-1',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:hover:bg-primary/90 group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:rounded-md group-[.toast]:text-xs group-[.toast]:font-medium group-[.toast]:transition-colors',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:hover:bg-muted/80 group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:rounded-md group-[.toast]:text-xs group-[.toast]:transition-colors',
          closeButton: 'group-[.toast]:bg-card group-[.toast]:text-muted-foreground group-[.toast]:border group-[.toast]:border-border group-[.toast]:hover:bg-muted group-[.toast]:hover:text-foreground group-[.toast]:transition-colors',
          success: 'group-[.toast]:border-l-emerald-500 group-[.toast]:bg-emerald-500/5 [&_[data-icon]]:text-emerald-600 dark:[&_[data-icon]]:text-emerald-400 [&_[data-title]]:text-emerald-900 dark:[&_[data-title]]:text-emerald-100',
          error: 'group-[.toast]:border-l-destructive group-[.toast]:bg-destructive/5 [&_[data-icon]]:text-destructive [&_[data-title]]:text-destructive dark:[&_[data-title]]:text-red-400',
          warning: 'group-[.toast]:border-l-amber-500 group-[.toast]:bg-amber-500/5 [&_[data-icon]]:text-amber-600 dark:[&_[data-icon]]:text-amber-400 [&_[data-title]]:text-amber-900 dark:[&_[data-title]]:text-amber-100',
          info: 'group-[.toast]:border-l-blue-500 group-[.toast]:bg-blue-500/5 [&_[data-icon]]:text-blue-600 dark:[&_[data-icon]]:text-blue-400 [&_[data-title]]:text-blue-900 dark:[&_[data-title]]:text-blue-100',
        },
        duration: 4000,
      }}
      {...props}
    />
  )
}

export { Toaster }
