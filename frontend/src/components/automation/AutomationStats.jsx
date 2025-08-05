import React from 'react';
import { 
  ChartBarIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const AutomationStats = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No data available</h3>
        <p className="mt-1 text-sm text-gray-500">Automation statistics will appear here once you create rules.</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      executed: 'text-green-600 bg-green-100',
      failed: 'text-red-600 bg-red-100',
      skipped: 'text-yellow-600 bg-yellow-100',
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'executed':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'failed':
        return <XCircleIcon className="h-4 w-4" />;
      case 'skipped':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Automation Analytics</h2>
        <p className="text-sm text-gray-600">
          Track the performance of your automation rules and identify areas for improvement.
        </p>
      </div>

      {/* Rule Statistics */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-md font-medium text-gray-900 mb-4">Rule Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.rules?.map((rule) => (
            <div key={`${rule.triggerType}-${rule.isActive}`} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {rule.triggerType.charAt(0).toUpperCase() + rule.triggerType.slice(1)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {rule.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {rule.count}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Execution Logs */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-md font-medium text-gray-900 mb-4">Execution Logs (Last 30 Days)</h3>
        <div className="space-y-4">
          {stats.logs?.map((log) => (
            <div key={log.status} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className={`p-2 rounded-full ${getStatusColor(log.status)}`}>
                  {getStatusIcon(log.status)}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {log.status === 'executed' ? 'Successfully executed' : 
                     log.status === 'failed' ? 'Failed to execute' : 'Skipped execution'}
                  </p>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {log.count}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scheduled Messages */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-md font-medium text-gray-900 mb-4">Scheduled Messages</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.scheduled?.map((scheduled) => (
            <div key={scheduled.status} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {scheduled.status.charAt(0).toUpperCase() + scheduled.status.slice(1)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {scheduled.status === 'pending' ? 'Waiting to be sent' :
                     scheduled.status === 'sent' ? 'Successfully sent' :
                     scheduled.status === 'failed' ? 'Failed to send' : 'Cancelled'}
                  </p>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {scheduled.count}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-md font-medium text-gray-900 mb-4">Performance Insights</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <ChartBarIcon className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Total Executions</p>
                <p className="text-xs text-gray-500">All automation rule executions</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {stats.logs?.reduce((sum, log) => sum + parseInt(log.count), 0) || 0}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Success Rate</p>
                <p className="text-xs text-gray-500">Successfully executed rules</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {(() => {
                const total = stats.logs?.reduce((sum, log) => sum + parseInt(log.count), 0) || 0;
                const executed = stats.logs?.find(log => log.status === 'executed')?.count || 0;
                return total > 0 ? Math.round((executed / total) * 100) : 0;
              })()}%
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 text-orange-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Pending Scheduled</p>
                <p className="text-xs text-gray-500">Messages waiting to be sent</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {stats.scheduled?.find(s => s.status === 'pending')?.count || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-md font-medium text-blue-900 mb-4">Recommendations</h3>
        <div className="space-y-3 text-sm text-blue-800">
          {stats.logs?.find(log => log.status === 'failed')?.count > 0 && (
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
              <p>
                You have {stats.logs.find(log => log.status === 'failed').count} failed executions. 
                Review your automation rules to ensure they're configured correctly.
              </p>
            </div>
          )}
          
          {stats.scheduled?.find(s => s.status === 'pending')?.count > 10 && (
            <div className="flex items-start">
              <ClockIcon className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
              <p>
                You have many pending scheduled messages. Consider reviewing your scheduling strategy 
                to avoid overwhelming your contacts.
              </p>
            </div>
          )}

          {stats.rules?.find(rule => rule.isActive)?.count === 0 && (
            <div className="flex items-start">
              <CheckCircleIcon className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
              <p>
                No active automation rules found. Create your first rule to start automating 
                your WhatsApp responses.
              </p>
            </div>
          )}

          {stats.rules?.find(rule => rule.isActive)?.count > 0 && stats.logs?.reduce((sum, log) => sum + parseInt(log.count), 0) === 0 && (
            <div className="flex items-start">
              <ChartBarIcon className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
              <p>
                Your automation rules are active but haven't been triggered yet. 
                This is normal if you haven't received messages that match your trigger conditions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutomationStats; 