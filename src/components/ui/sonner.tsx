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
      richColors
      closeButton ={true}
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-2 group-[.toaster]:border-border group-[.toaster]:shadow-2xl group-[.toaster]:p-4 group-[.toaster]:min-w-[300px]',
          description: 'group-[.toast]:text-muted-foreground group-[.toast]:text-sm',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:px-3 group-[.toast]:py-2',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          success: 'group-[.toaster]:bg-green-50 group-[.toaster]:border-green-500 group-[.toaster]:text-green-900 dark:group-[.toaster]:bg-green-950 dark:group-[.toaster]:text-green-100',
          error: 'group-[.toaster]:bg-red-50 group-[.toaster]:border-red-500 group-[.toaster]:text-red-900 dark:group-[.toaster]:bg-red-950 dark:group-[.toaster]:text-red-100',
          warning: 'group-[.toaster]:bg-yellow-50 group-[.toaster]:border-yellow-500 group-[.toaster]:text-yellow-900 dark:group-[.toaster]:bg-yellow-950 dark:group-[.toaster]:text-yellow-100',
          info: 'group-[.toaster]:bg-blue-50 group-[.toaster]:border-blue-500 group-[.toaster]:text-blue-900 dark:group-[.toaster]:bg-blue-950 dark:group-[.toaster]:text-blue-100',
        },
        duration: 4000,
      }}
      {...props}
    />
  )
}

export { Toaster }
