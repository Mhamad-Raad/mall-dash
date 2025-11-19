import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  FileText,
  Calendar,
  TrendingUp,
  Users,
  Building2,
  Store,
  ShoppingCart,
  DollarSign,
  Clock,
  Filter,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const reportCategories = [
    { id: 'all', label: 'All Reports', icon: FileText },
    { id: 'financial', label: 'Financial', icon: DollarSign },
    { id: 'operations', label: 'Operations', icon: TrendingUp },
    { id: 'users', label: 'Users & Vendors', icon: Users },
    { id: 'buildings', label: 'Buildings', icon: Building2 },
  ];

  const availableReports = [
    {
      id: 1,
      title: 'Monthly Revenue Report',
      description: 'Comprehensive breakdown of revenue by vendor, category, and building',
      category: 'financial',
      icon: DollarSign,
      lastGenerated: '2 hours ago',
      frequency: 'Monthly',
      status: 'ready',
      size: '2.4 MB',
    },
    {
      id: 2,
      title: 'Vendor Performance Report',
      description: 'Sales performance, ratings, and compliance metrics for all vendors',
      category: 'operations',
      icon: Store,
      lastGenerated: '5 hours ago',
      frequency: 'Weekly',
      status: 'ready',
      size: '1.8 MB',
    },
    {
      id: 3,
      title: 'Building Occupancy Report',
      description: 'Occupancy rates, vacant units, and rental income by building',
      category: 'buildings',
      icon: Building2,
      lastGenerated: '1 day ago',
      frequency: 'Weekly',
      status: 'ready',
      size: '956 KB',
    },
    {
      id: 4,
      title: 'User Activity Report',
      description: 'User registrations, active users, and engagement metrics',
      category: 'users',
      icon: Users,
      lastGenerated: '3 hours ago',
      frequency: 'Daily',
      status: 'ready',
      size: '1.2 MB',
    },
    {
      id: 5,
      title: 'Order Analytics Report',
      description: 'Order volumes, average order value, and fulfillment metrics',
      category: 'financial',
      icon: ShoppingCart,
      lastGenerated: '6 hours ago',
      frequency: 'Daily',
      status: 'ready',
      size: '3.1 MB',
    },
    {
      id: 6,
      title: 'Maintenance & Operations Report',
      description: 'Maintenance requests, response times, and facility status',
      category: 'buildings',
      icon: TrendingUp,
      lastGenerated: '12 hours ago',
      frequency: 'Weekly',
      status: 'generating',
      size: '-',
    },
    {
      id: 7,
      title: 'Financial Summary Report',
      description: 'Income statements, expense tracking, and profit margins',
      category: 'financial',
      icon: DollarSign,
      lastGenerated: '1 day ago',
      frequency: 'Monthly',
      status: 'ready',
      size: '2.8 MB',
    },
    {
      id: 8,
      title: 'Vendor Compliance Report',
      description: 'License renewals, health inspections, and regulatory compliance',
      category: 'operations',
      icon: FileText,
      lastGenerated: '2 days ago',
      frequency: 'Monthly',
      status: 'ready',
      size: '1.5 MB',
    },
  ];

  const quickStats = [
    {
      label: 'Total Reports',
      value: '48',
      trend: '+12%',
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      label: 'Generated Today',
      value: '8',
      trend: '+25%',
      icon: Clock,
      color: 'text-green-600',
    },
    {
      label: 'Scheduled',
      value: '12',
      trend: '—',
      icon: Calendar,
      color: 'text-purple-600',
    },
    {
      label: 'Total Size',
      value: '124 MB',
      trend: '+8%',
      icon: Download,
      color: 'text-orange-600',
    },
  ];

  const filteredReports = availableReports.filter(
    (report) => selectedCategory === 'all' || report.category === selectedCategory
  );

  const handleGenerateReport = (reportId: number) => {
    console.log(`Generating report ${reportId}`);
    // Add your report generation logic here
  };

  const handleDownloadReport = (reportId: number) => {
    console.log(`Downloading report ${reportId}`);
    // Add your download logic here
  };

  return (
    <div className='w-full h-full flex flex-col gap-6 p-6 overflow-y-auto'>
      {/* Header */}
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold tracking-tight'>Reports</h1>
        <p className='text-muted-foreground'>
          Generate and download comprehensive reports for your mall operations
        </p>
      </div>

      {/* Quick Stats */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div className='space-y-1'>
                    <p className='text-sm text-muted-foreground'>{stat.label}</p>
                    <p className='text-2xl font-bold'>{stat.value}</p>
                    <p className='text-xs text-muted-foreground'>{stat.trend} from last month</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className='p-6'>
          <div className='flex flex-col md:flex-row gap-4 items-start md:items-center justify-between'>
            <div className='flex flex-wrap gap-2'>
              {reportCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => setSelectedCategory(category.id)}
                    className='gap-2'
                  >
                    <Icon className='h-4 w-4' />
                    {category.label}
                  </Button>
                );
              })}
            </div>
            <div className='flex gap-2 items-center'>
              <Filter className='h-4 w-4 text-muted-foreground' />
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Select period' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='today'>Today</SelectItem>
                  <SelectItem value='week'>This Week</SelectItem>
                  <SelectItem value='month'>This Month</SelectItem>
                  <SelectItem value='quarter'>This Quarter</SelectItem>
                  <SelectItem value='year'>This Year</SelectItem>
                  <SelectItem value='custom'>Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {filteredReports.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.id} className='hover:shadow-lg transition-shadow'>
              <CardHeader>
                <div className='flex items-start justify-between'>
                  <div className='flex items-start gap-3'>
                    <div className='p-2 bg-primary/10 rounded-lg'>
                      <Icon className='h-5 w-5 text-primary' />
                    </div>
                    <div className='space-y-1'>
                      <CardTitle className='text-lg'>{report.title}</CardTitle>
                      <CardDescription className='text-sm'>
                        {report.description}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex flex-wrap gap-2'>
                  <Badge variant='secondary' className='gap-1'>
                    <Clock className='h-3 w-3' />
                    {report.frequency}
                  </Badge>
                  <Badge
                    variant={report.status === 'ready' ? 'default' : 'outline'}
                    className={
                      report.status === 'ready'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                        : ''
                    }
                  >
                    {report.status === 'ready' ? 'Ready' : 'Generating...'}
                  </Badge>
                  {report.size !== '-' && (
                    <Badge variant='outline' className='gap-1'>
                      {report.size}
                    </Badge>
                  )}
                </div>

                <div className='flex items-center justify-between pt-2 border-t'>
                  <p className='text-xs text-muted-foreground'>
                    Last generated: {report.lastGenerated}
                  </p>
                  <div className='flex gap-2'>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => handleGenerateReport(report.id)}
                      disabled={report.status === 'generating'}
                    >
                      <TrendingUp className='h-4 w-4 mr-2' />
                      Generate
                    </Button>
                    {report.status === 'ready' && (
                      <Button
                        size='sm'
                        onClick={() => handleDownloadReport(report.id)}
                      >
                        <Download className='h-4 w-4 mr-2' />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Scheduled Reports */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Calendar className='h-5 w-5' />
            Scheduled Reports
          </CardTitle>
          <CardDescription>
            Automatically generated reports sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {[
              { name: 'Weekly Operations Summary', schedule: 'Every Monday at 9:00 AM', active: true },
              { name: 'Monthly Financial Report', schedule: '1st of every month at 8:00 AM', active: true },
              { name: 'Daily Sales Report', schedule: 'Every day at 6:00 PM', active: false },
            ].map((scheduled, index) => (
              <div
                key={index}
                className='flex items-center justify-between p-4 border rounded-lg'
              >
                <div className='space-y-1'>
                  <p className='font-medium'>{scheduled.name}</p>
                  <p className='text-sm text-muted-foreground'>{scheduled.schedule}</p>
                </div>
                <Badge variant={scheduled.active ? 'default' : 'secondary'}>
                  {scheduled.active ? 'Active' : 'Paused'}
                </Badge>
              </div>
            ))}
          </div>
          <Button className='w-full mt-4' variant='outline'>
            <Calendar className='h-4 w-4 mr-2' />
            Manage Schedule
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
