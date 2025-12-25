import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  AlertCircle,
  Building2,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  fetchRequestDetails,
  clearSelectedRequest,
} from '@/store/slices/requestsSlice';
import type { RootState, AppDispatch } from '@/store/store';

const RequestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedRequest, loading, error } = useSelector(
    (state: RootState) => state.requests
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchRequestDetails(id));
    }
    return () => {
      dispatch(clearSelectedRequest());
    };
  }, [id, dispatch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20';
      case 'In Progress':
        return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20';
      case 'Resolved':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20';
      case 'Rejected':
        return 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 border-gray-500/20';
    }
  };

  if (error) {
    return (
      <div className='container mx-auto py-6 px-4 md:px-6 max-w-5xl'>
        <Button
          variant='ghost'
          onClick={() => navigate('/requests')}
          className='mb-6'
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Requests
        </Button>
        <Card className='border-destructive/50'>
          <CardContent className='pt-6 text-center text-destructive'>
            <p>Error loading request details: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='container mx-auto py-6 px-4 md:px-6 max-w-5xl animate-in fade-in duration-500'>
      <div className='flex items-center gap-4 mb-6'>
        <Button
          variant='ghost'
          onClick={() => navigate('/requests')}
          className='h-9 px-2'
        >
          <ArrowLeft className='h-5 w-5' />
          <span className='sr-only'>Back</span>
        </Button>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Request Details</h1>
          <p className='text-muted-foreground'>Viewing request #{id}</p>
        </div>
      </div>

      {loading ? (
        <div className='grid gap-6 md:grid-cols-3'>
          <div className='md:col-span-2 space-y-6'>
            <Skeleton className='h-[200px] w-full rounded-xl' />
            <Skeleton className='h-[150px] w-full rounded-xl' />
          </div>
          <div className='space-y-6'>
            <Skeleton className='h-[300px] w-full rounded-xl' />
          </div>
        </div>
      ) : selectedRequest ? (
        <div className='grid gap-6 lg:grid-cols-3'>
          {/* Main Content Column */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Request Info Card */}
            <Card>
              <CardHeader>
                <div className='flex items-start justify-between'>
                  <div className='space-y-1'>
                    <CardTitle className='text-xl'>
                      {selectedRequest.title}
                    </CardTitle>
                    <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                      <Clock className='h-4 w-4' />
                      Sent on{' '}
                      {new Date(selectedRequest.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-2'>
                  <h3 className='font-semibold flex items-center gap-2'>
                    <AlertCircle className='h-4 w-4' />
                    Description
                  </h3>
                  <p className='text-muted-foreground leading-relaxed'>
                    {selectedRequest.description}
                  </p>
                </div>

                {selectedRequest.images &&
                  selectedRequest.images.length > 0 && (
                    <div className='space-y-3'>
                      <h3 className='font-semibold flex items-center gap-2'>
                        <ImageIcon className='h-4 w-4' />
                        Attachments
                      </h3>
                      <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
                        {selectedRequest.images.map((img, index) => (
                          <div
                            key={index}
                            className='relative aspect-square rounded-lg overflow-hidden border bg-muted'
                          >
                            <img
                              src={img}
                              alt={`Attachment ${index + 1}`}
                              className='object-cover w-full h-full hover:scale-105 transition-transform duration-300'
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Column */}
          <div className='space-y-6'>
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex flex-col gap-4'>
                  <Badge
                    variant='outline'
                    className={`w-fit px-4 py-1 text-sm font-medium ${getStatusColor(
                      selectedRequest.status
                    )}`}
                  >
                    {selectedRequest.status}
                  </Badge>

                  <div className='text-sm text-muted-foreground'>
                    Last updated:{' '}
                    {new Date(selectedRequest.updatedAt).toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tenant Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg flex items-center gap-2'>
                  <Building2 className='h-5 w-5' />
                  Tenant Information
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold'>
                    {selectedRequest.tenantName.charAt(0).toUpperCase()}
                  </div>
                  <div className='overflow-hidden'>
                    <div className='font-medium truncate'>
                      {selectedRequest.tenantName}
                    </div>
                    <div className='text-xs text-muted-foreground truncate'>
                      ID: {selectedRequest.tenantId}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className='flex items-center justify-center py-12'>
          <p className='text-muted-foreground'>Request not found.</p>
        </div>
      )}
    </div>
  );
};

export default RequestDetailPage;

