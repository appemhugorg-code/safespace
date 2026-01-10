import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  Send,
  RefreshCw,
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { DeliveryMetrics } from '@/services/message-delivery-service';
import { useMessageDelivery } from '@/hooks/use-message-delivery';
import { motion } from 'framer-motion';

interface DeliveryMetricsDashboardProps {
  conversationId?: string;
  userId?: string;
  authToken: string;
  className?: string;
}

interface MetricsFilters {
  period: 'day' | 'week' | 'month' | 'year';
  dateFrom?: Date;
  dateTo?: Date;
}

export function DeliveryMetricsDashboard({
  conversationId,
  userId,
  authToken,
  className = '',
}: DeliveryMetricsDashboardProps) {
  const { deliveryMetrics, refreshMetrics, isLoading } = useMessageDelivery({
    authToken,
    conversationId,
  });

  const [filters, setFilters] = useState<MetricsFilters>({
    period: 'week',
  });

  const [previousMetrics, setPreviousMetrics] = useState<DeliveryMetrics | null>(null);

  // Load metrics on mount and filter changes
  useEffect(() => {
    loadMetrics();
  }, [filters, conversationId, userId]);

  const loadMetrics = useCallback(async () => {
    const { dateFrom, dateTo } = getDateRange(filters.period);
    
    // Load current metrics
    await refreshMetrics({
      conversationId,
      userId,
      dateFrom,
      dateTo,
    });

    // Load previous period for comparison
    const previousDateRange = getPreviousDateRange(filters.period, dateFrom, dateTo);
    // Note: You would need to implement a way to get previous metrics
    // This is a placeholder for the comparison functionality
  }, [filters, conversationId, userId, refreshMetrics]);

  const getDateRange = (period: MetricsFilters['period']) => {
    const now = new Date();
    const dateFrom = new Date();

    switch (period) {
      case 'day':
        dateFrom.setDate(now.getDate() - 1);
        break;
      case 'week':
        dateFrom.setDate(now.getDate() - 7);
        break;
      case 'month':
        dateFrom.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        dateFrom.setFullYear(now.getFullYear() - 1);
        break;
    }

    return { dateFrom, dateTo: now };
  };

  const getPreviousDateRange = (period: MetricsFilters['period'], currentFrom: Date, currentTo: Date) => {
    const diff = currentTo.getTime() - currentFrom.getTime();
    const previousTo = new Date(currentFrom.getTime());
    const previousFrom = new Date(currentFrom.getTime() - diff);

    return { dateFrom: previousFrom, dateTo: previousTo };
  };

  const calculatePercentageChange = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const formatDuration = (milliseconds: number): string => {
    if (milliseconds < 1000) return `${Math.round(milliseconds)}ms`;
    if (milliseconds < 60000) return `${Math.round(milliseconds / 1000)}s`;
    if (milliseconds < 3600000) return `${Math.round(milliseconds / 60000)}m`;
    return `${Math.round(milliseconds / 3600000)}h`;
  };

  const formatPercentage = (value: number): string => {
    return `${Math.round(value * 100)}%`;
  };

  if (!deliveryMetrics) {
    return (
      <div className={`p-6 bg-white border border-gray-200 rounded-lg ${className}`}>
        <div className="flex items-center justify-center h-32">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-5 w-5 animate-spin text-gray-400" />
              <span className="text-gray-600">Loading metrics...</span>
            </div>
          ) : (
            <div className="text-center">
              <BarChart3 className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-600">No metrics available</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Message Delivery Metrics</h3>
          <p className="text-sm text-gray-600">
            Track message delivery performance and engagement
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Select
            value={filters.period}
            onValueChange={(value) => setFilters(prev => ({ ...prev, period: value as MetricsFilters['period'] }))}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last Day</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={loadMetrics} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Messages"
          value={deliveryMetrics.totalMessages}
          icon={Send}
          color="blue"
          previousValue={previousMetrics?.totalMessages}
        />

        <MetricCard
          title="Delivery Rate"
          value={formatPercentage(deliveryMetrics.deliveryRate)}
          icon={CheckCircle}
          color="green"
          previousValue={previousMetrics?.deliveryRate}
          isPercentage
        />

        <MetricCard
          title="Read Rate"
          value={formatPercentage(deliveryMetrics.readRate)}
          icon={Eye}
          color="purple"
          previousValue={previousMetrics?.readRate}
          isPercentage
        />

        <MetricCard
          title="Failed Messages"
          value={deliveryMetrics.failedMessages}
          icon={XCircle}
          color="red"
          previousValue={previousMetrics?.failedMessages}
        />
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Performance */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4">Delivery Performance</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">Average Delivery Time</span>
              </div>
              <span className="font-medium text-gray-900">
                {formatDuration(deliveryMetrics.averageDeliveryTime)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">Average Read Time</span>
              </div>
              <span className="font-medium text-gray-900">
                {formatDuration(deliveryMetrics.averageReadTime)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700">Delivered Messages</span>
              </div>
              <span className="font-medium text-gray-900">
                {deliveryMetrics.deliveredMessages}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-700">Read Messages</span>
              </div>
              <span className="font-medium text-gray-900">
                {deliveryMetrics.readMessages}
              </span>
            </div>
          </div>
        </div>

        {/* Success Rates */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4">Success Rates</h4>
          
          <div className="space-y-4">
            {/* Delivery Rate Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Delivery Rate</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatPercentage(deliveryMetrics.deliveryRate)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-green-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${deliveryMetrics.deliveryRate * 100}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Read Rate Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Read Rate</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatPercentage(deliveryMetrics.readRate)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-blue-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${deliveryMetrics.readRate * 100}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                />
              </div>
            </div>

            {/* Failure Rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Failure Rate</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatPercentage(deliveryMetrics.failedMessages / deliveryMetrics.totalMessages)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-red-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(deliveryMetrics.failedMessages / deliveryMetrics.totalMessages) * 100}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      {deliveryMetrics.deliveryRate < 0.9 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <TrendingDown className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h5 className="font-medium text-yellow-900">Delivery Rate Below Optimal</h5>
              <p className="text-sm text-yellow-700 mt-1">
                Your delivery rate is {formatPercentage(deliveryMetrics.deliveryRate)}. 
                Consider checking network connectivity or enabling fallback delivery methods.
              </p>
            </div>
          </div>
        </div>
      )}

      {deliveryMetrics.readRate < 0.5 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Eye className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h5 className="font-medium text-blue-900">Low Read Rate</h5>
              <p className="text-sm text-blue-700 mt-1">
                Your read rate is {formatPercentage(deliveryMetrics.readRate)}. 
                Consider improving message timing or content to increase engagement.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
  previousValue?: number;
  isPercentage?: boolean;
}

function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  previousValue,
  isPercentage = false 
}: MetricCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-200' };
      case 'green':
        return { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-200' };
      case 'purple':
        return { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-200' };
      case 'red':
        return { bg: 'bg-red-50', icon: 'text-red-600', border: 'border-red-200' };
      case 'yellow':
        return { bg: 'bg-yellow-50', icon: 'text-yellow-600', border: 'border-yellow-200' };
      default:
        return { bg: 'bg-gray-50', icon: 'text-gray-600', border: 'border-gray-200' };
    }
  };

  const colorClasses = getColorClasses(color);
  
  const currentValue = typeof value === 'string' ? parseFloat(value.replace('%', '')) : value;
  const change = previousValue !== undefined ? 
    ((currentValue - previousValue) / previousValue) * 100 : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white border ${colorClasses.border} rounded-lg p-4`}
    >
      <div className="flex items-center justify-between">
        <div className={`p-2 ${colorClasses.bg} rounded-lg`}>
          <Icon className={`h-5 w-5 ${colorClasses.icon}`} />
        </div>
        
        {change !== null && (
          <div className={`flex items-center space-x-1 text-xs ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {change >= 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>{Math.abs(change).toFixed(1)}%</span>
          </div>
        )}
      </div>
      
      <div className="mt-3">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-600">{title}</div>
      </div>
    </motion.div>
  );
}