import React from 'react';
import { XMarkIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const AutomationRuleModal = ({ rule, onClose }) => {
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

  const getActionTypeLabel = (type) => {
    const labels = {
      send_message: 'Send Message',
      send_media: 'Send Media',
      schedule_message: 'Schedule Message',
      update_contact: 'Update Contact',
      add_tag: 'Add Tag',
    };
    return labels[type] || type;
  };

  const formatTriggerConditions = () => {
    const { triggerType, triggerConditions } = rule;
    
    switch (triggerType) {
      case 'keyword':
        return (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Keywords:</h4>
            <div className="flex flex-wrap gap-2">
              {triggerConditions.keywords?.map((keyword, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        );
      
      case 'schedule':
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Schedule:</h4>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Days: </span>
                <span className="text-sm font-medium">
                  {triggerConditions.schedule?.days?.map(day => days[day]).join(', ')}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Time: </span>
                <span className="text-sm font-medium">
                  {triggerConditions.schedule?.time?.start} - {triggerConditions.schedule?.time?.end}
                </span>
              </div>
            </div>
          </div>
        );
      
      case 'event':
        return (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Events:</h4>
            <div className="flex flex-wrap gap-2">
              {triggerConditions.events?.map((event, index) => (
                <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm">
                  {event}
                </span>
              ))}
            </div>
          </div>
        );
      
      default:
        return <p className="text-gray-500">No specific conditions</p>;
    }
  };

  const formatActions = () => {
    return rule.actions?.map((action, index) => (
      <div key={index} className="border rounded-lg p-4 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-gray-900">
            {getActionTypeLabel(action.type)}
          </span>
          <span className="text-sm text-gray-500">Action {index + 1}</span>
        </div>
        
        {action.type === 'send_message' && (
          <div>
            <p className="text-sm text-gray-600 mb-1">Message:</p>
            <p className="text-sm bg-white p-2 rounded border">{action.data.content}</p>
          </div>
        )}
        
        {action.type === 'send_media' && (
          <div>
            <p className="text-sm text-gray-600 mb-1">Media ID: {action.data.mediaId}</p>
            {action.data.caption && (
              <p className="text-sm text-gray-600">Caption: {action.data.caption}</p>
            )}
          </div>
        )}
        
        {action.type === 'schedule_message' && (
          <div>
            <p className="text-sm text-gray-600 mb-1">Message:</p>
            <p className="text-sm bg-white p-2 rounded border mb-2">{action.data.content}</p>
            <p className="text-sm text-gray-600">Scheduled for: {action.data.scheduledAt}</p>
          </div>
        )}
        
        {action.type === 'update_contact' && (
          <div>
            <p className="text-sm text-gray-600">Update contact with: {JSON.stringify(action.data)}</p>
          </div>
        )}
        
        {action.type === 'add_tag' && (
          <div>
            <p className="text-sm text-gray-600">Add tag: {action.data.tag}</p>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Automation Rule Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="text-sm text-gray-900">{rule.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Trigger Type</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTriggerTypeColor(rule.triggerType)}`}>
                  {getTriggerTypeLabel(rule.triggerType)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <p className="text-sm text-gray-900">{rule.priority}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <div className="flex items-center">
                  {rule.isActive ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1" />
                  ) : (
                    <XCircleIcon className="h-5 w-5 text-red-500 mr-1" />
                  )}
                  <span className="text-sm text-gray-900">
                    {rule.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
            {rule.description && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="text-sm text-gray-900">{rule.description}</p>
              </div>
            )}
          </div>

          {/* Trigger Conditions */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Trigger Conditions</h4>
            {formatTriggerConditions()}
          </div>

          {/* Actions */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Actions ({rule.actions?.length || 0})</h4>
            {rule.actions && rule.actions.length > 0 ? (
              <div className="space-y-3">
                {formatActions()}
              </div>
            ) : (
              <p className="text-gray-500">No actions configured</p>
            )}
          </div>

          {/* Metadata */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Metadata</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block font-medium text-gray-700">Created</label>
                <p className="text-gray-900">
                  {new Date(rule.createdAt).toLocaleDateString()} at {new Date(rule.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div>
                <label className="block font-medium text-gray-700">Last Updated</label>
                <p className="text-gray-900">
                  {new Date(rule.updatedAt).toLocaleDateString()} at {new Date(rule.updatedAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end mt-6 pt-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutomationRuleModal; 