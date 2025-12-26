import { ArrowRight } from 'lucide-react';
import { formatFieldName } from './auditUtils';

interface ChangeRowProps {
  field: string;
  oldValue: string;
  newValue: string;
  isNew: boolean;
}

const ChangeRow = ({ field, oldValue, newValue, isNew }: ChangeRowProps) => {
  const hasChange = oldValue !== newValue;

  return (
    <div className='group grid grid-cols-[140px_1fr_24px_1fr] gap-2 items-start py-3 px-4 hover:bg-muted/30 transition-colors overflow-hidden'>
      <div className='flex items-center gap-2 min-w-0'>
        <span className='text-sm font-medium text-foreground truncate'>
          {formatFieldName(field)}
        </span>
      </div>
      <div className='min-w-0'>
        {isNew ? (
          <span className='text-xs text-muted-foreground italic'>—</span>
        ) : (
          <code className='text-xs bg-muted/50 px-2 py-1 rounded block break-all text-muted-foreground'>
            {oldValue || <span className='italic'>empty</span>}
          </code>
        )}
      </div>
      <div className='flex justify-center pt-1'>
        {hasChange && (
          <div className='rounded-full bg-primary/10 p-1'>
            <ArrowRight className='h-3 w-3 text-primary' />
          </div>
        )}
      </div>
      <div className='min-w-0'>
        <code className='text-xs bg-primary/5 border border-primary/20 px-2 py-1 rounded block break-all text-foreground'>
          {newValue || <span className='italic text-muted-foreground'>empty</span>}
        </code>
      </div>
    </div>
  );
};

export default ChangeRow;
