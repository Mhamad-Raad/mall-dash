import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Check,
  X,
  Archive,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import type { Notification, NotificationType } from '@/interfaces/Notification.interface';

// Mock notifications data - replace with real data from your API
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'New Tenant Registered',
    message: 'Philip George successfully registered for Apartment 301 in Tower A. Payment confirmed.',
    timestamp: new Date(Date.now() - 3 * 60000),
    read: false,
    actionUrl: '/users',
    actionLabel: 'View Details',
  },
  {
    id: '2',
    type: 'warning',
    title: 'Vendor Approval Pending',
    message: 'Mini-Markety submitted their vendor registration. Review and approve to activate their account.',
    timestamp: new Date(Date.now() - 25 * 60000),
    read: false,
    actionUrl: '/vendors',
    actionLabel: 'Review Now',
  },
  {
    id: '3',
    type: 'info',
    title: 'New Order Received',
    message: 'Tiana Curtis placed an order at Aland StakeHouse. Order #ORD-1247 - Total: $45.99',
    timestamp: new Date(Date.now() - 45 * 60000),
    read: false,
    actionUrl: '/orders',
    actionLabel: 'View Order',
  },
  {
    id: '4',
    type: 'success',
    title: 'Monthly Revenue Update',
    message: 'November revenue increased by 23% compared to last month. Great progress!',
    timestamp: new Date(Date.now() - 2 * 60 * 60000),
    read: false,
  },
  {
    id: '5',
    type: 'error',
    title: 'Building Access Denied',
    message: 'Failed to grant access to Tower B due to incomplete tenant verification documents.',
    timestamp: new Date(Date.now() - 4 * 60 * 60000),
    read: true,
    actionUrl: '/buildings',
    actionLabel: 'Fix Issue',
  },
  {
    id: '6',
    type: 'system',
    title: 'System Maintenance Scheduled',
    message: 'Planned maintenance tonight at 2:00 AM. Expected downtime: 30 minutes.',
    timestamp: new Date(Date.now() - 6 * 60 * 60000),
    read: true,
  },
];

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return 'text-green-600 dark:text-green-400';
    case 'error':
      return 'text-red-600 dark:text-red-400';
    case 'warning':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'info':
      return 'text-blue-600 dark:text-blue-400';
    case 'system':
      return 'text-purple-600 dark:text-purple-400';
    default:
      return 'text-foreground';
  }
};

const formatTimestamp = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

type NotificationTab = 'all' | 'unread' | 'mentions' | 'system';

export default function NotificationPopover() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<NotificationTab>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;
  const allCount = notifications.length;
  const mentionsCount = notifications.filter((n) => n.type === 'warning' || n.type === 'error').length;
  const systemCount = notifications.filter((n) => n.type === 'system').length;

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'unread':
        return notifications.filter((n) => !n.read);
      case 'mentions':
        return notifications.filter((n) => n.type === 'warning' || n.type === 'error');
      case 'system':
        return notifications.filter((n) => n.type === 'system');
      default:
        return notifications;
    }
  };

  const filteredNotifications = getFilteredNotifications();

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (notification: Notification) => {
    handleMarkAsRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='relative hover:bg-accent transition-colors'
          aria-label='Notifications'
        >
          <Bell className='size-4' />
          {unreadCount > 0 && (
            <span className='absolute top-1 right-1 size-2 bg-blue-500 rounded-full' />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-[380px] p-0 border shadow-lg'
        align='end'
        sideOffset={8}
      >
        {/* Header */}
        <div className='px-4 pt-3 pb-0 border-b'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='font-semibold text-sm'>{t('Notifications')}</h3>
            {notifications.length > 0 && unreadCount > 0 && (
              <Button
                variant='ghost'
                size='sm'
                onClick={handleMarkAllRead}
                className='h-7 px-2 text-xs hover:bg-accent'
              >
                <Check className='size-3 mr-1' />
                Mark all as read
              </Button>
            )}
          </div>

          {/* Tabs */}
          <div className='flex gap-1 -mb-px'>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'all'
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              All
              {allCount > 0 && (
                <span className='ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-muted'>
                  {allCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'unread'
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <span className='ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500 text-white'>
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('mentions')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'mentions'
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Important
              {mentionsCount > 0 && (
                <span className='ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-muted'>
                  {mentionsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'system'
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              System
              {systemCount > 0 && (
                <span className='ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-muted'>
                  {systemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-12 px-4'>
            <Bell className='size-8 text-muted-foreground/40 mb-3' />
            <p className='text-sm text-muted-foreground'>
              {activeTab === 'unread' ? 'No unread notifications' : 
               activeTab === 'mentions' ? 'No important notifications' :
               activeTab === 'system' ? 'No system notifications' : 
               'No notifications'}
            </p>
          </div>
        ) : (
          <>
            <ScrollArea className='h-[420px]'>
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`group relative px-4 py-3 border-b last:border-b-0 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-accent/30 hover:bg-accent/50' : 'hover:bg-accent/30'
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className='flex gap-3'>
                        {/* Unread Indicator */}
                        <div className='flex-shrink-0 pt-1.5'>
                          {!notification.read ? (
                            <div className='size-2 bg-blue-500 rounded-full' />
                          ) : (
                            <div className='size-2' />
                          )}
                        </div>

                        {/* Content */}
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-start justify-between gap-2 mb-1'>
                            <p className={`text-sm leading-tight ${
                              !notification.read ? 'font-medium' : 'font-normal'
                            } ${getNotificationColor(notification.type)}`}>
                              {notification.title}
                            </p>
                            <span className='text-xs text-muted-foreground whitespace-nowrap flex-shrink-0'>
                              {formatTimestamp(notification.timestamp)}
                            </span>
                          </div>
                          <p className='text-xs text-muted-foreground leading-relaxed mb-2'>
                            {notification.message}
                          </p>
                          {notification.actionLabel && (
                            <button className='text-xs text-foreground hover:underline font-medium'>
                              {notification.actionLabel} →
                            </button>
                          )}
                        </div>

                        {/* Actions */}
                        <div className='flex-shrink-0 flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-6 w-6 hover:bg-accent'
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notification.id);
                            }}
                          >
                            <X className='size-3' />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
            </ScrollArea>

            {/* Footer */}
            <div className='border-t p-2'>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleClearAll}
                className='w-full justify-center text-xs text-muted-foreground hover:bg-accent hover:text-foreground'
              >
                <Archive className='size-3 mr-1.5' />
                Archive all
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
