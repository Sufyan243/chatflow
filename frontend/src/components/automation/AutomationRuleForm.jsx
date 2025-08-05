import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';

const AutomationRuleForm = ({ rule, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    triggerType: 'keyword',
    triggerConditions: {
      keywords: [],
      schedule: {
        days: [],
        time: { start: '09:00', end: '17:00' },
      },
      events: [],
    },
    actions: [],
    priority: 0,
    isActive: true,
    chatbotId: '',
  });

  const [chatbots, setChatbots] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (rule) {
      setFormData({
        name: rule.name,
        description: rule.description || '',
        triggerType: rule.triggerType,
        triggerConditions: rule.triggerConditions,
        actions: rule.actions,
        priority: rule.priority,
        isActive: rule.isActive,
        chatbotId: rule.chatbotId || '',
      });
    }
    fetchChatbots();
    fetchMedia();
  }, [rule]);

  const fetchChatbots = async () => {
    try {
      const response = await api.get('/chatbots');
      setChatbots(response.data.data);
    } catch (error) {
      console.error('Error fetching chatbots:', error);
    }
  };

  const fetchMedia = async () => {
    try {
      const response = await api.get('/automation/media');
      setMedia(response.data.data);
    } catch (error) {
      console.error('Error fetching media:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTriggerConditionChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      triggerConditions: {
        ...prev.triggerConditions,
        [field]: value,
      },
    }));
  };

  const addKeyword = () => {
    const keyword = prompt('Enter keyword:');
    if (keyword && keyword.trim()) {
      const keywords = [...formData.triggerConditions.keywords, keyword.trim()];
      handleTriggerConditionChange('keywords', keywords);
    }
  };

  const removeKeyword = (index) => {
    const keywords = formData.triggerConditions.keywords.filter((_, i) => i !== index);
    handleTriggerConditionChange('keywords', keywords);
  };

  const addAction = () => {
    const newAction = {
      type: 'send_message',
      data: {
        content: '',
        messageType: 'text',
      },
    };
    setFormData(prev => ({
      ...prev,
      actions: [...prev.actions, newAction],
    }));
  };

  const updateAction = (index, field, value) => {
    const actions = [...formData.actions];
    if (field === 'data') {
      actions[index].data = { ...actions[index].data, ...value };
    } else {
      actions[index][field] = value;
    }
    setFormData(prev => ({ ...prev, actions }));
  };

  const removeAction = (index) => {
    const actions = formData.actions.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, actions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      if (rule) {
        await api.put(`/automation/rules/${rule.id}`, formData);
      } else {
        await api.post('/automation/rules', formData);
      }
      onSuccess();
    } catch (error) {
      if (error.response?.data?.errors) {
        const validationErrors = {};
        error.response.data.errors.forEach(err => {
          validationErrors[err.path] = err.msg;
        });
        setErrors(validationErrors);
      }
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            {rule ? 'Edit Automation Rule' : 'Create Automation Rule'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rule Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter rule name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trigger Type *
              </label>
              <select
                value={formData.triggerType}
                onChange={(e) => handleInputChange('triggerType', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="keyword">Keyword</option>
                <option value="welcome">Welcome</option>
                <option value="schedule">Schedule</option>
                <option value="event">Event</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter description"
            />
          </div>

          {/* Trigger Conditions */}
          <div className="border-t pt-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Trigger Conditions</h4>
            
            {formData.triggerType === 'keyword' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords
                </label>
                <div className="space-y-2">
                  {formData.triggerConditions.keywords.map((keyword, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {keyword}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeKeyword(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addKeyword}
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Keyword
                  </button>
                </div>
              </div>
            )}

            {formData.triggerType === 'schedule' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Days of Week
                  </label>
                  <div className="space-y-2">
                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
                      <label key={day} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.triggerConditions.schedule.days.includes(index)}
                          onChange={(e) => {
                            const days = e.target.checked
                              ? [...formData.triggerConditions.schedule.days, index]
                              : formData.triggerConditions.schedule.days.filter(d => d !== index);
                            handleTriggerConditionChange('schedule', {
                              ...formData.triggerConditions.schedule,
                              days,
                            });
                          }}
                          className="mr-2"
                        />
                        {day}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600">Start Time</label>
                      <input
                        type="time"
                        value={formData.triggerConditions.schedule.time.start}
                        onChange={(e) => handleTriggerConditionChange('schedule', {
                          ...formData.triggerConditions.schedule,
                          time: { ...formData.triggerConditions.schedule.time, start: e.target.value },
                        })}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600">End Time</label>
                      <input
                        type="time"
                        value={formData.triggerConditions.schedule.time.end}
                        onChange={(e) => handleTriggerConditionChange('schedule', {
                          ...formData.triggerConditions.schedule,
                          time: { ...formData.triggerConditions.schedule.time, end: e.target.value },
                        })}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-medium text-gray-900">Actions</h4>
              <button
                type="button"
                onClick={addAction}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Action
              </button>
            </div>

            <div className="space-y-4">
              {formData.actions.map((action, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <select
                      value={action.type}
                      onChange={(e) => updateAction(index, 'type', e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value="send_message">Send Message</option>
                      <option value="send_media">Send Media</option>
                      <option value="schedule_message">Schedule Message</option>
                      <option value="update_contact">Update Contact</option>
                      <option value="add_tag">Add Tag</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeAction(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>

                  {action.type === 'send_message' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message Content
                      </label>
                      <textarea
                        value={action.data.content}
                        onChange={(e) => updateAction(index, 'data', { content: e.target.value })}
                        rows={3}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        placeholder="Enter message content"
                      />
                    </div>
                  )}

                  {action.type === 'send_media' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select Media
                        </label>
                        <select
                          value={action.data.mediaId || ''}
                          onChange={(e) => updateAction(index, 'data', { mediaId: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        >
                          <option value="">Select media</option>
                          {media.map(item => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Caption (optional)
                        </label>
                        <input
                          type="text"
                          value={action.data.caption || ''}
                          onChange={(e) => updateAction(index, 'data', { caption: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                          placeholder="Enter caption"
                        />
                      </div>
                    </div>
                  )}

                  {action.type === 'schedule_message' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Message Content
                        </label>
                        <textarea
                          value={action.data.content}
                          onChange={(e) => updateAction(index, 'data', { content: e.target.value })}
                          rows={3}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                          placeholder="Enter message content"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Schedule Time
                        </label>
                        <input
                          type="datetime-local"
                          value={action.data.scheduledAt || ''}
                          onChange={(e) => updateAction(index, 'data', { scheduledAt: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Additional Settings */}
          <div className="border-t pt-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Additional Settings</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <input
                  type="number"
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', parseInt(e.target.value))}
                  min="0"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chatbot (optional)
                </label>
                <select
                  value={formData.chatbotId}
                  onChange={(e) => handleInputChange('chatbotId', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Chatbots</option>
                  {chatbots.map(chatbot => (
                    <option key={chatbot.id} value={chatbot.id}>{chatbot.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (rule ? 'Update Rule' : 'Create Rule')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AutomationRuleForm; 