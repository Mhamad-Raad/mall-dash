import * as React from 'react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const Spinner = () => (
  <svg className='animate-spin h-5 w-5 mr-2 text-white' viewBox='0 0 24 24'>
    <circle
      className='opacity-25'
      cx='12'
      cy='12'
      r='10'
      stroke='currentColor'
      strokeWidth='4'
      fill='none'
    />
    <path
      className='opacity-75'
      fill='currentColor'
      d='M4 12A8 8 0 0112 4v4a4 4 0 00-4 4H4z'
    />
  </svg>
);

interface ConfirmModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<any> | void;
  title: string;
  description: string;
  confirmType?: 'danger' | 'warning' | 'success';
  confirmLabel?: string;
  cancelLabel?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  onCancel,
  onConfirm,
  title,
  description,
  confirmType = 'success',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
}) => {
  const [loading, setLoading] = useState(false);

  let confirmClass = 'bg-green-600 hover:bg-green-700 text-white';
  if (confirmType === 'danger')
    confirmClass = 'bg-red-600 hover:bg-red-700 text-white';
  if (confirmType === 'warning')
    confirmClass = 'bg-yellow-500 hover:bg-yellow-600 text-white';

  // handle confirm with internal loading state
  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm?.();
    } finally {
      setLoading(false);
    }
  };

  // For safety: reset loading if modal is closed unexpectedly
  React.useEffect(() => {
    if (!open) setLoading(false);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={open ? onCancel : undefined}>
      <DialogContent className='max-w-md transition-all duration-300 animate-in slide-in-from-top-8 fade-in scale-95'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          <button
            className='absolute top-3 right-3 rounded-full p-1 hover:bg-muted/50 transition'
            onClick={onCancel}
            aria-label='Close'
            type='button'
            disabled={loading}
          >
            <X className='h-5 w-5' />
          </button>
        </DialogHeader>
        <div className='flex gap-3 mt-6 justify-end'>
          <Button
            variant='outline'
            onClick={onCancel}
            disabled={loading}
            className='min-w-[90px]'
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className={`${confirmClass} min-w-[90px] flex items-center justify-center`}
          >
            {loading && <Spinner />}
            {loading ? 'Please wait...' : confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmModal;
