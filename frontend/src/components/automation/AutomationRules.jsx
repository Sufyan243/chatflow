import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Switch } from '@headlessui/react';
import api from '../../services/api';
import AutomationRuleForm from './AutomationRuleForm';
import AutomationRuleModal from './AutomationRuleModal';

const AutomationRules = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    triggerType: '',
    isActive: '',
  });

  useEffect(() => {
    fetchRules();
  }, [filters]);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.triggerType) params.append('triggerType', filters.triggerType);
      if (filters.isActive !== '') params.append('isActive', filters.isActive);

      const response = await api.get(`/automation/rules?${params}`);
      setRules(response.data.data);
    } catch (error) {
      console.error('Error fetching rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRule = () => {
    setSelectedRule(null);
    setShowForm(true);
  };

  const handleEditRule = (rule) => {
    setSelectedRule(rule);
    setShowForm(true);
  };

  const handleViewRule = (rule) => {
    setSelectedRule(rule);
    setShowModal(true);
  };

  const handleToggleRule = async (rule) => {
    try {
      await api.patch(`/automation/rules/${rule.id}/toggle`);
      fetchRules();
    } catch (error) {
      console.error('Error toggling rule:', error);
    }
  };

  const handleDeleteRule = async (rule) => {
// eslint-disable-next-line no-restricted-globals
if (!confirm('Are you sure you want to delete this automation rule?')) {
  return;
}

    try {
      await api.delete(`/automation/rules/${rule.id}`);
      fetchRules();
    } catch (error) {
      console.error('Error deleting rule:', error);
    }
  };

  const getTriggerTypeLabel = (type) => {
    const labels = {
      keyword: 'Keyword',
      welcome: 'Welcome',
      schedule: 'Schedule',
      event: 'Event',
    };
    return labels[type] || type;
  };

  const getTriggerTypeColor = (type) => {
    const colors = {
      keyword: 'bg-blue-100 text-blue-800',
      welcome: 'bg-green-100 text-green-800',
      schedule: 'bg-purple-100 text-purple-800',
      event: 'bg-orange-100 text-orange-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
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
          <h1 className="text-2xl font-bold text-gray-900">Automation Rules</h1>
          <p className="text-gray-600">Manage your automated responses and workflows</p>
        </div>
        <button
          onClick={handleCreateRule}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Rule
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trigger Type
            </label>
            <select
              value={filters.triggerType}
              onChange={(e) => setFilters({ ...filters, triggerType: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="keyword">Keyword</option>
              <option value="welcome">Welcome</option>
              <option value="schedule">Schedule</option>
              <option value="event">Event</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.isActive}
              onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rules List */}
      <div className="bg-white shadow rounded-lg">
        {rules.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No automation rules</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first automation rule.</p>
            <div className="mt-6">
              <button
                onClick={handleCreateRule}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Rule
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trigger
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
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
                {rules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{rule.name}</div>
                        {rule.description && (
                          <div className="text-sm text-gray-500">{rule.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTriggerTypeColor(rule.triggerType)}`}>
                        {getTriggerTypeLabel(rule.triggerType)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rule.priority}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Switch
                        checked={rule.isActive}
                        onChange={() => handleToggleRule(rule)}
                        className={`${
                          rule.isActive ? 'bg-blue-600' : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                      >
                        <span
                          className={`${
                            rule.isActive ? 'translate-x-6' : 'translate-x-1'
                          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                        />
                      </Switch>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewRule(rule)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditRule(rule)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRule(rule)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Forms and Modals */}
      {showForm && (
        <AutomationRuleForm
          rule={selectedRule}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchRules();
          }}
        />
      )}

      {showModal && selectedRule && (
        <AutomationRuleModal
          rule={selectedRule}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default AutomationRules; 