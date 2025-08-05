import React, { useState, useEffect } from 'react';
import { 
  CogIcon, 
  ChartBarIcon, 
  ClockIcon, 
  PhotoIcon,
  PlayIcon,
  PauseIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import AutomationRules from '../components/automation/AutomationRules';
import AutomationStats from '../components/automation/AutomationStats';
import MediaLibrary from '../components/automation/MediaLibrary';
import ScheduledMessages from '../components/automation/ScheduledMessages';
import api from '../services/api';

const Automation = () => {
  const [activeTab, setActiveTab] = useState('rules');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/automation/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching automation stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      id: 'rules',
      name: 'Automation Rules',
      icon: CogIcon,
      description: 'Manage your automated responses and workflows',
    },
    {
      id: 'stats',
      name: 'Analytics',
      icon: ChartBarIcon,
      description: 'View automation performance and insights',
    },
    {
      id: 'media',
      name: 'Media Library',
      icon: PhotoIcon,
      description: 'Manage media files for automation',
    },
    {
      id: 'scheduled',
      name: 'Scheduled Messages',
      icon: ClockIcon,
      description: 'View and manage scheduled messages',
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'rules':
        return <AutomationRules />;
      case 'stats':
        return <AutomationStats stats={stats} loading={loading} />;
      case 'media':
        return <MediaLibrary />;
      case 'scheduled':
        return <ScheduledMessages />;
      default:
        return <AutomationRules />;
    }
  };

  const getQuickStats = () => {
    if (!stats) return null;

    const totalRules = stats.rules?.reduce((sum, rule) => sum + parseInt(rule.count), 0) || 0;
    const activeRules = stats.rules?.find(rule => rule.isActive)?.count || 0;
    const totalExecutions = stats.logs?.reduce((sum, log) => sum + parseInt(log.count), 0) || 0;
    const pendingScheduled = stats.scheduled?.find(s => s.status === 'pending')?.count || 0;

    return [
      {
        name: 'Total Rules',
        value: totalRules,
        icon: CogIcon,
        color: 'bg-blue-500',
      },
      {
        name: 'Active Rules',
        value: activeRules,
        icon: PlayIcon,
        color: 'bg-green-500',
      },
      {
        name: 'Total Executions',
        value: totalExecutions,
        icon: ChartBarIcon,
        color: 'bg-purple-500',
      },
      {
        name: 'Pending Scheduled',
        value: pendingScheduled,
        icon: ClockIcon,
        color: 'bg-orange-500',
      },
    ];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Automation</h1>
              <p className="mt-2 text-gray-600">
                Automate your WhatsApp responses and workflows to save time and improve customer experience
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center text-sm text-gray-500">
                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                <span>Beta Feature</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {stats && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {getQuickStats().map((stat) => (
                <div key={stat.name} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 ${stat.color} rounded-md p-3`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                      <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm flex items-center
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-6 w-6 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Getting Started with Automation
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p className="mb-2">
                  Create automation rules to automatically respond to customer messages based on:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Keywords:</strong> Trigger responses when customers mention specific words</li>
                  <li><strong>Welcome Messages:</strong> Send automatic greetings to new contacts</li>
                  <li><strong>Scheduled Messages:</strong> Send messages at specific times</li>
                  <li><strong>Event-based:</strong> Respond to specific events or conditions</li>
                </ul>
                <p className="mt-3">
                  <strong>Pro Tip:</strong> Start with simple keyword-based rules and gradually build more complex workflows.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Automation; 