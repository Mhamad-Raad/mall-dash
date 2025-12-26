import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getActionConfig } from './auditUtils';
import type { AuditLog } from '@/interfaces/Audit.interface';

interface AuditDetailsHeaderProps {
  log: AuditLog;
  id: string;
}

const AuditDetailsHeader = ({ log, id }: AuditDetailsHeaderProps) => {
  const navigate = useNavigate();
  const actionConfig = getActionConfig(log.action);
  const ActionIcon = actionConfig.icon;

  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-3'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => navigate('/history')}
          className='shrink-0'
        >
          <ArrowLeft className='h-5 w-5' />
        </Button>
        <div className='flex items-center gap-3'>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${actionConfig.color}`}
          >
            <ActionIcon className='h-5 w-5' />
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <h1 className='text-xl font-semibold'>
                {log.entityName} {actionConfig.label}
              </h1>
              <Badge variant='outline' className='font-mono text-xs'>
                #{log.entityId}
              </Badge>
            </div>
            <p className='text-sm text-muted-foreground'>
              Audit Log #{id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditDetailsHeader;
