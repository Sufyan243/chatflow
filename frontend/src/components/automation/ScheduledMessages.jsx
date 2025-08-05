import React, { useState, useEffect } from 'react';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const ScheduledMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
  });

  useEffect(() => {
    fetchMessages();
  }, [filters]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);

      const response = await api.get(`/automation/scheduled?${params}`);
      setMessages(response.data.data);
    } catch (error) {
      console.error('Error fetching scheduled messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (messageId) => {
 // eslint-disable-next-line no-restricted-globals
if (!confirm('Are you sure you want to delete this automation rule?')) {
  return;
}

    try {
      await api.delete(`/automation/scheduled/${messageId}`);
      fetchMessages();
    } catch (error) {
      console.error('Error cancelling scheduled message:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      sent: 'text-green-600 bg-green-100',
      failed: 'text-red-600 bg-red-100',
      cancelled: 'text-gray-600 bg-gray-100',
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-4 w-4" />;
      case 'sent':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'failed':
        return <XCircleIcon className="h-4 w-4" />;
      case 'cancelled':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const formatScheduledTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
      relative: getRelativeTime(date),
    };
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (diff < 0) {
      return 'Overdue';
    } else if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} from now`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} from now`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} from now`;
    } else {
      return 'Due now';
    }
  };

  const truncateContent = (content, maxLength = 50) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scheduled Messages</h1>
          <p className="text-gray-600">Manage your scheduled message delivery</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white shadow rounded-lg">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No scheduled messages</h3>
            <p className="mt-1 text-sm text-gray-500">
              Scheduled messages will appear here once you create automation rules with scheduled actions.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scheduled For
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {messages.map((message) => {
                  const scheduledTime = formatScheduledTime(message.scheduledAt);
                  return (
                    <tr key={message.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {message.messageType.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {message.messageType.charAt(0).toUpperCase() + message.messageType.slice(1)} Message
                            </div>
                            <div className="text-sm text-gray-500">
                              {truncateContent(message.content)}
                            </div>
                            {message.mediaUrl && (
                              <div className="text-xs text-gray-400">
                                Includes media
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {scheduledTime.date}
                        </div>
                        <div className="text-sm text-gray-500">
                          {scheduledTime.time}
                        </div>
                        <div className="text-xs text-gray-400">
                          {scheduledTime.relative}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                            <span className="mr-1">
                              {getStatusIcon(message.status)}
                            </span>
                            {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                          </span>
                        </div>
                        {message.sentAt && (
                          <div className="text-xs text-gray-500 mt-1">
                            Sent: {new Date(message.sentAt).toLocaleString()}
                          </div>
                        )}
                        {message.errorMessage && (
                          <div className="text-xs text-red-500 mt-1">
                            Error: {message.errorMessage}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {message.status === 'pending' && (
                            <button
                              onClick={() => handleCancel(message.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Cancel"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => window.open(`/contacts/${message.contactId}`, '_blank')}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Contact"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Statistics */}
      {messages.length > 0 && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-md font-medium text-gray-900 mb-4">Message Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { status: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
              { status: 'sent', label: 'Sent', color: 'bg-green-100 text-green-800' },
              { status: 'failed', label: 'Failed', color: 'bg-red-100 text-red-800' },
              { status: 'cancelled', label: 'Cancelled', color: 'bg-gray-100 text-gray-800' },
            ].map((stat) => {
              const count = messages.filter(m => m.status === stat.status).length;
              return (
                <div key={stat.status} className="text-center">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${stat.color}`}>
                    {count}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduledMessages; 