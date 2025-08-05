import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Clock, 
  ShoppingBag, 
  HelpCircle, 
  Zap, 
  Users, 
  Settings,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  Download,
  Upload,
  Menu,
  X,
  Bot,
  Activity,
  TrendingUp,
  MessageCircle,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [botEnabled, setBotEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // State for different features
  const [autoReplies, setAutoReplies] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [products, setProducts] = useState([]);
  const [quickButtons, setQuickButtons] = useState([]);
  const [workingHours, setWorkingHours] = useState({
    working_start: '09:00',
    working_end: '18:00',
    timezone: 'Asia/Karachi',
    is_24_7: false
  });
  const [analytics, setAnalytics] = useState({});
  const [recentChats, setRecentChats] = useState([]);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'auto-replies', label: 'Auto Replies', icon: MessageSquare },
    { id: 'working-hours', label: 'Working Hours', icon: Clock },
    { id: 'catalog', label: 'Product Catalog', icon: ShoppingBag },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'quick-buttons', label: 'Quick Buttons', icon: Zap },
    { id: 'group-settings', label: 'Group Settings', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: Activity }
  ];

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'overview':
          await loadOverviewData();
          break;
        case 'auto-replies':
          await loadAutoReplies();
          break;
        case 'catalog':
          await loadProducts();
          break;
        case 'faqs':
          await loadFAQs();
          break;
        case 'quick-buttons':
          await loadQuickButtons();
          break;
        case 'working-hours':
          await loadWorkingHours();
          break;
        case 'analytics':
          await loadAnalytics();
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const loadOverviewData = async () => {
    setAnalytics({
      unique_contacts: 245,
      total_interactions: 1287,
      auto_replies: 456,
      faq_responses: 234,
      catalog_requests: 123,
      unhandled_messages: 12,
      active_bots: 3,
      response_rate: 94.2
    });

    setRecentChats([
      { id: 1, name: 'Ahmed Khan', message: 'What is the price of iPhone 15?', time: '2 min ago', status: 'replied' },
      { id: 2, name: 'Sarah Ali', message: 'Do you have Samsung Galaxy S24?', time: '5 min ago', status: 'pending' },
      { id: 3, name: 'Hassan Sheikh', message: 'Thanks for the quick response!', time: '8 min ago', status: 'completed' },
      { id: 4, name: 'Fatima Malik', message: 'What are your delivery charges?', time: '12 min ago', status: 'replied' },
      { id: 5, name: 'Ali Raza', message: 'Is this product available?', time: '15 min ago', status: 'pending' }
    ]);
  };

  const loadAutoReplies = async () => {
    setAutoReplies([
      { id: 1, trigger_text: 'price of product a', response_text: 'Product A costs Rs. 500 and is available in black and red.', is_exact_match: false, priority: 1, is_active: true },
      { id: 2, trigger_text: 'hello', response_text: 'Hello! Welcome to our store. How can I help you today?', is_exact_match: false, priority: 2, is_active: true },
      { id: 3, trigger_text: 'delivery', response_text: 'We offer free delivery within the city for orders above Rs. 1000. Charges apply for outside city.', is_exact_match: false, priority: 3, is_active: true }
    ]);
  };

  const loadProducts = async () => {
    setProducts([
      { id: 1, name: 'iPhone 15', description: 'Latest iPhone with advanced features', price: 280000, category: 'Smartphones', is_active: true },
      { id: 2, name: 'Samsung Galaxy S24', description: 'Premium Android smartphone', price: 250000, category: 'Smartphones', is_active: true },
      { id: 3, name: 'MacBook Air M2', description: 'Lightweight laptop with M2 chip', price: 450000, category: 'Laptops', is_active: true }
    ]);
  };

  const loadFAQs = async () => {
    setFaqs([
      { id: 1, question: 'What are your opening hours?', answer: 'We are open Monday to Saturday from 9 AM to 6 PM.', keywords: 'hours,timing,open,close', is_active: true },
      { id: 2, question: 'Do you provide delivery?', answer: 'Yes, we provide free delivery within the city for orders above Rs. 1000.', keywords: 'delivery,shipping', is_active: true },
      { id: 3, question: 'What payment methods do you accept?', answer: 'We accept cash on delivery, bank transfer, and JazzCash/EasyPaisa.', keywords: 'payment,cash,transfer', is_active: true }
    ]);
  };

  const loadQuickButtons = async () => {
    setQuickButtons([
      { id: 1, button_text: 'Show latest stock', response_text: 'Here are our latest products...', description: 'View current inventory', is_active: true },
      { id: 2, button_text: 'Discounts', response_text: '🎉 Current Offers: 10% off on orders above Rs. 5,000', description: 'Check promotions', is_active: true },
      { id: 3, button_text: 'Contact Info', response_text: '📞 Call us: 0300-1234567\n📧 Email: info@store.com', description: 'Business contact details', is_active: true }
    ]);
  };

  const loadWorkingHours = async () => {
    // Already initialized in state
  };

  const loadAnalytics = async () => {
    setAnalytics({
      unique_contacts: 245,
      total_interactions: 1287,
      auto_replies: 456,
      faq_responses: 234,
      catalog_requests: 123,
      unhandled_messages: 12,
      active_bots: 3,
      response_rate: 94.2
    });
  };

  const toggleBot = async () => {
    setBotEnabled(!botEnabled);
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setEditingItem(null);
  };

  const Header = () => (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">WhatsApp Automation Dashboard</h1>
              <p className="text-sm text-gray-600">Manage your WhatsApp business automation</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Bot Status:</span>
              <button
                onClick={toggleBot}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  botEnabled ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    botEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${botEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                {botEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Settings size={18} />
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const Sidebar = () => (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Bot className="h-8 w-8 text-blue-600" />
            <span className="text-lg font-semibold text-gray-900">ChatFlow</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );

  const OverviewCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <Users size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Unique Contacts</p>
            <p className="text-2xl font-semibold text-gray-900">{analytics.unique_contacts}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <MessageSquare size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Messages</p>
            <p className="text-2xl font-semibold text-gray-900">{analytics.total_interactions}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <Zap size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Auto Replies</p>
            <p className="text-2xl font-semibold text-gray-900">{analytics.auto_replies}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-red-100 text-red-600">
            <AlertTriangle size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Unhandled</p>
            <p className="text-2xl font-semibold text-gray-900">{analytics.unhandled_messages}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const RecentChatsWidget = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Conversations</h3>
      <div className="space-y-4">
        {recentChats.map((chat) => (
          <div key={chat.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium">{chat.name.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{chat.name}</p>
              <p className="text-sm text-gray-500 truncate">{chat.message}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">{chat.time}</p>
              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                chat.status === 'replied' ? 'bg-green-100 text-green-800' :
                chat.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {chat.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome back! Here's what's happening with your chatbots.</p>
      </div>
      
      <OverviewCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickButtons.slice(0, 4).map((button) => (
                <div key={button.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-semibold text-gray-900">{button.button_text}</h4>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openModal('quick-button', button)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit size={14} />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{button.description}</p>
                  <p className="text-xs text-gray-700 bg-white rounded p-2">
                    {button.response_text.substring(0, 100)}...
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <RecentChatsWidget />
        </div>
      </div>
    </div>
  );

  const renderAutoReplies = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Auto Replies</h2>
        <button
          onClick={() => openModal('auto-reply')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Add Auto Reply
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trigger</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {autoReplies.map((reply) => (
              <tr key={reply.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {reply.trigger_text}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {reply.response_text.substring(0, 100)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {reply.is_exact_match ? 'Exact' : 'Contains'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    reply.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {reply.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => openModal('auto-reply', reply)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit size={16} />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderWorkingHours = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Working Hours Settings</h2>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Working Start Time
            </label>
            <input
              type="time"
              value={workingHours.working_start}
              onChange={(e) => setWorkingHours({...workingHours, working_start: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Working End Time
            </label>
            <input
              type="time"
              value={workingHours.working_end}
              onChange={(e) => setWorkingHours({...workingHours, working_end: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select
              value={workingHours.timezone}
              onChange={(e) => setWorkingHours({...workingHours, timezone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Asia/Karachi">Asia/Karachi</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Europe/London">Europe/London</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_24_7"
              checked={workingHours.is_24_7}
              onChange={(e) => setWorkingHours({...workingHours, is_24_7: e.target.checked})}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_24_7" className="ml-2 block text-sm text-gray-900">
              24/7 Operation
            </label>
          </div>
        </div>
        
        <div className="mt-6">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Save Working Hours
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Off-Hours Message</h3>
        <textarea
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter message to send during off-hours..."
          defaultValue="Thank you for your message! 🌙\n\nWe're currently offline but will get back to you during our working hours.\n\nFor urgent matters, please call us directly."
        />
        <div className="mt-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Save Off-Hours Message
          </button>
        </div>
      </div>
    </div>
  );

  const renderCatalog = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Product Catalog</h2>
        <div className="flex gap-2">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Upload size={20} />
            Import CSV
          </button>
          <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Download size={20} />
            Export
          </button>
          <button
            onClick={() => openModal('product')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
              <div className="flex gap-1">
                <button
                  onClick={() => openModal('product', product)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <Edit size={16} />
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-green-600">Rs. {product.price?.toLocaleString()}</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {product.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFAQs = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
        <button
          onClick={() => openModal('faq')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Add FAQ
        </button>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
              <div className="flex gap-1">
                <button
                  onClick={() => openModal('faq', faq)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <Edit size={16} />
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-3">{faq.answer}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Keywords:</span>
              {faq.keywords.split(',').map((keyword, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {keyword.trim()}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderQuickButtons = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Quick Buttons</h2>
        <button
          onClick={() => openModal('quick-button')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Add Quick Button
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quickButtons.map((button) => (
          <div key={button.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{button.button_text}</h3>
                <p className="text-sm text-gray-500">{button.description}</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => openModal('quick-button', button)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <Edit size={16} />
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-700">{button.response_text.substring(0, 150)}...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGroupSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Group Settings</h2>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Private DM Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Enable Private DMs</h4>
              <p className="text-sm text-gray-500">Send private messages to users who interact in groups</p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Private DM Message
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Message to send when DMing users from groups..."
              defaultValue="Hi! I saw your message in the group. I'd be happy to help you privately! What can I assist you with?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Keywords (triggers for DM)
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="price,cost,buy,purchase,order,delivery"
              defaultValue="price,cost,buy,purchase,order,delivery,available,stock"
            />
            <p className="text-xs text-gray-500 mt-1">Comma-separated keywords that trigger private DMs</p>
          </div>
        </div>

        <div className="mt-6">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Save Group Settings
          </button>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Users size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unique Contacts</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.unique_contacts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <MessageSquare size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Interactions</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.total_interactions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Zap size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Auto Replies</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.auto_replies}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <HelpCircle size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unhandled Messages</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.unhandled_messages}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Feature Usage</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Auto Replies</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
                <span className="text-sm font-medium">456</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">FAQ Responses</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '50%'}}></div>
                </div>
                <span className="text-sm font-medium">234</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Catalog Requests</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{width: '25%'}}></div>
                </div>
                <span className="text-sm font-medium">123</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Auto reply sent for "price inquiry"</span>
              <span className="text-xs text-gray-400 ml-auto">2 min ago</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">FAQ response for "delivery options"</span>
              <span className="text-xs text-gray-400 ml-auto">5 min ago</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Catalog request processed</span>
              <span className="text-xs text-gray-400 ml-auto">8 min ago</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Unhandled message logged</span>
              <span className="text-xs text-gray-400 ml-auto">12 min ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderModal = () => {
    if (!showModal) return null;

    const getModalContent = () => {
      switch (modalType) {
        case 'auto-reply':
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingItem ? 'Edit Auto Reply' : 'Add Auto Reply'}
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trigger Text</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., price of product a"
                  defaultValue={editingItem?.trigger_text || ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Response Text</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the response message..."
                  defaultValue={editingItem?.response_text || ''}
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    defaultChecked={editingItem?.is_exact_match || false}
                  />
                  <span className="ml-2 text-sm text-gray-700">Exact match only</span>
                </label>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700">Priority:</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={editingItem?.priority || 1}
                  />
                </div>
              </div>
            </div>
          );

        case 'product':
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingItem ? 'Edit Product' : 'Add Product'}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., iPhone 15"
                    defaultValue={editingItem?.name || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="280000"
                    defaultValue={editingItem?.price || ''}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Product description..."
                  defaultValue={editingItem?.description || ''}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Smartphones"
                    defaultValue={editingItem?.category || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                    defaultValue={editingItem?.image_url || ''}
                  />
                </div>
              </div>
            </div>
          );

        case 'faq':
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingItem ? 'Edit FAQ' : 'Add FAQ'}
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What are your opening hours?"
                  defaultValue={editingItem?.question || ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="We are open Monday to Saturday from 9 AM to 6 PM..."
                  defaultValue={editingItem?.answer || ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="hours,timing,open,close,time"
                  defaultValue={editingItem?.keywords || ''}
                />
                <p className="text-xs text-gray-500 mt-1">Comma-separated keywords to trigger this FAQ</p>
              </div>
            </div>
          );

        case 'quick-button':
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingItem ? 'Edit Quick Button' : 'Add Quick Button'}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Show latest stock"
                    defaultValue={editingItem?.button_text || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="View current inventory"
                    defaultValue={editingItem?.description || ''}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Response Text</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Here are our latest products..."
                  defaultValue={editingItem?.response_text || ''}
                />
              </div>
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {getModalContent()}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle save logic here
                  closeModal();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                {editingItem ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'auto-replies':
        return renderAutoReplies();
      case 'working-hours':
        return renderWorkingHours();
      case 'catalog':
        return renderCatalog();
      case 'faqs':
        return renderFAQs();
      case 'quick-buttons':
        return renderQuickButtons();
      case 'group-settings':
        return renderGroupSettings();
      case 'analytics':
        return renderAnalytics();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <main className="flex-1 relative z-0 overflow-y-auto py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                renderTabContent()
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Modal */}
      {renderModal()}
    </div>
  );
};

export default Dashboard;