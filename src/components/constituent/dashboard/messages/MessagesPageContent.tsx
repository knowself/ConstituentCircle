'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext'; // Use alias
import ConstituentDashboardLayout from '@/components/constituent/ConstituentDashboardLayout'; // Use alias
import { 
  PaperAirplaneIcon, 
  FolderIcon,
  ArchiveBoxIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

// Moved from page.tsx
interface Message {
  id: string;
  subject: string;
  sender: string;
  senderRole: 'constituent' | 'representative';
  recipientId: string;
  date: string;
  timestamp: number;
  content: string;
  status: 'read' | 'unread' | 'sent';
  folder: 'inbox' | 'sent' | 'archived';
  priority: 'normal' | 'high' | 'low';
  attachments: Array<{ name: string; size: string; type: string }>;
  thread: Array<{
    id: string;
    sender: string;
    senderRole: 'constituent' | 'representative';
    content: string;
    timestamp: number;
  }>;
}

export default function MessagesPageContent() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  
  // Mock data - moved from page.tsx
  const messages: Message[] = [
    // ... (Mock data remains the same as in the original file)
    { 
      id: '1', 
      subject: 'Response to your infrastructure question',
      sender: 'Rep. Jane Smith',
      senderRole: 'representative',
      recipientId: 'user123',
      date: 'Mar 15, 2025',
      timestamp: new Date('2025-03-15').getTime(),
      content: 'Thank you for your question about the infrastructure bill. We are currently reviewing the proposal and will be holding a town hall meeting next week to discuss it with constituents. I would love to hear your thoughts in person if you can attend.',
      status: 'unread',
      folder: 'inbox',
      priority: 'normal',
      attachments: [],
      thread: [
        {
          id: '1a',
          sender: 'You',
          senderRole: 'constituent',
          content: 'I have concerns about the proposed infrastructure bill and how it might affect our local roads. Can you provide more information?',
          timestamp: new Date('2025-03-14').getTime(),
        },
        {
          id: '1b',
          sender: 'Rep. Jane Smith',
          senderRole: 'representative',
          content: 'Thank you for your question about the infrastructure bill. We are currently reviewing the proposal and will be holding a town hall meeting next week to discuss it with constituents. I would love to hear your thoughts in person if you can attend.',
          timestamp: new Date('2025-03-15').getTime(),
        }
      ]
    },
    { 
      id: '2', 
      subject: 'Town Hall Meeting Announcement',
      sender: 'Office of Rep. Jane Smith',
      senderRole: 'representative',
      recipientId: 'user123',
      date: 'Mar 12, 2025',
      timestamp: new Date('2025-03-12').getTime(),
      content: 'We are pleased to announce a town hall meeting on March 20, 2025, at 6:00 PM at City Hall. We will be discussing the upcoming infrastructure bill and other important issues affecting our district. We hope to see you there!',
      status: 'read',
      folder: 'inbox',
      priority: 'high',
      attachments: [
        { name: 'town_hall_agenda.pdf', size: '245 KB', type: 'pdf' }
      ],
      thread: [
        {
          id: '2a',
          sender: 'Office of Rep. Jane Smith',
          senderRole: 'representative',
          content: 'We are pleased to announce a town hall meeting on March 20, 2025, at 6:00 PM at City Hall. We will be discussing the upcoming infrastructure bill and other important issues affecting our district. We hope to see you there!',
          timestamp: new Date('2025-03-12').getTime(),
        }
      ]
    },
    { 
      id: '3', 
      subject: 'Your feedback on the education bill',
      sender: 'Rep. Jane Smith',
      senderRole: 'representative',
      recipientId: 'user123',
      date: 'Mar 10, 2025',
      timestamp: new Date('2025-03-10').getTime(),
      content: 'Thank you for sharing your thoughts on the education bill. Your insights about improving school funding are valuable, and I have shared them with the education committee. We are working on amendments that address many of the concerns you raised.',
      status: 'read',
      folder: 'inbox',
      priority: 'normal',
      attachments: [],
      thread: [
        {
          id: '3a',
          sender: 'You',
          senderRole: 'constituent',
          content: 'I believe the education bill needs stronger provisions for school funding in underserved areas. The current formula doesn\'t adequately address the needs of schools in our district.',
          timestamp: new Date('2025-03-08').getTime(),
        },
        {
          id: '3b',
          sender: 'Rep. Jane Smith',
          senderRole: 'representative',
          content: 'Thank you for sharing your thoughts on the education bill. Your insights about improving school funding are valuable, and I have shared them with the education committee. We are working on amendments that address many of the concerns you raised.',
          timestamp: new Date('2025-03-10').getTime(),
        }
      ]
    },
    { 
      id: '4', 
      subject: 'Question about local zoning changes',
      sender: 'You',
      senderRole: 'constituent',
      recipientId: 'rep42',
      date: 'Mar 5, 2025',
      timestamp: new Date('2025-03-05').getTime(),
      content: 'I\'ve heard about proposed zoning changes that might affect my neighborhood. Can you provide information about the timeline and how residents can provide input on these changes?',
      status: 'sent',
      folder: 'sent',
      priority: 'normal',
      attachments: [],
      thread: [
        {
          id: '4a',
          sender: 'You',
          senderRole: 'constituent',
          content: 'I\'ve heard about proposed zoning changes that might affect my neighborhood. Can you provide information about the timeline and how residents can provide input on these changes?',
          timestamp: new Date('2025-03-05').getTime(),
        }
      ]
    },
  ];
  
  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredMessages = messages.filter(message => {
    if (activeTab === 'inbox') return message.folder === 'inbox';
    if (activeTab === 'sent') return message.folder === 'sent';
    if (activeTab === 'archived') return message.folder === 'archived';
    return true;
  });

  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message);
    // Mark as read if it was unread
    if (message.status === 'unread') {
      // In a real app, you would update this in your database
      message.status = 'read';
    }
  };

  const handleSendReply = () => {
    if (!selectedMessage || !replyText.trim()) return;
    
    // In a real app, you would send this to your backend
    console.log('Sending reply to message:', selectedMessage.id);
    console.log('Reply text:', replyText);
    
    // Add the reply to the thread (mock implementation)
    selectedMessage.thread.push({
      id: `${selectedMessage.id}-reply-${Date.now()}`,
      sender: 'You',
      senderRole: 'constituent',
      content: replyText,
      timestamp: Date.now(),
    });
    
    // Clear the reply text
    setReplyText('');
  };

  if (!mounted) {
    return null; // Avoid hydration mismatch during initial render
  }

  // JSX moved from page.tsx
  return (
    <ConstituentDashboardLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Messages
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Communicate directly with your representative and their office.
          </p>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:flex-row bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-gray-50 dark:bg-gray-900 p-4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
            {/* Tabs */}
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('inbox')}
                className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'inbox' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'}`}
              >
                <FolderIcon className="mr-2 h-5 w-5" />
                Inbox
              </button>
              <button
                onClick={() => setActiveTab('sent')}
                className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'sent' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'}`}
              >
                <PaperAirplaneIcon className="mr-2 h-5 w-5" />
                Sent
              </button>
              <button
                onClick={() => setActiveTab('archived')}
                className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'archived' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'}`}
              >
                <ArchiveBoxIcon className="mr-2 h-5 w-5" />
                Archived
              </button>
            </div>
          </div>

          {/* Message List Pane */}
          <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white capitalize">{activeTab}</h3>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto flex-1">
              {filteredMessages.length === 0 ? (
                <li className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No messages in {activeTab}.
                </li>
              ) : (
                filteredMessages.sort((a, b) => b.timestamp - a.timestamp).map((message) => (
                  <li
                    key={message.id}
                    onClick={() => handleSelectMessage(message)}
                    className={`p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedMessage?.id === message.id ? 'bg-blue-50 dark:bg-blue-950' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <p className={`text-sm font-semibold ${message.status === 'unread' ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>{message.sender}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <p className={`text-sm truncate ${message.status === 'unread' ? 'font-medium text-gray-800 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>{message.subject}</p>
                    {message.status === 'unread' && (
                      <div className="mt-1 flex justify-end">
                        <span className="inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                      </div>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Message Detail Pane */}
          <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
            {selectedMessage ? (
              <div className="flex-1 flex flex-col">
                {/* Message Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {selectedMessage.subject}
                  </h3>
                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <span>From: {selectedMessage.sender}</span>
                    <span>{new Date(selectedMessage.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                {/* Message Thread/Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedMessage.thread.map((item, index) => (
                    <div key={item.id} className={`p-3 rounded-lg ${item.senderRole === 'representative' ? 'bg-gray-100 dark:bg-gray-700' : 'bg-blue-50 dark:bg-blue-950 ml-auto max-w-md'}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{item.sender}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(item.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-200">
                        {item.content}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Reply Area */}
                {selectedMessage.folder === 'inbox' && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <textarea
                      rows={3}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply here..."
                      className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={handleSendReply}
                        disabled={!replyText.trim()}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <PaperAirplaneIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Send Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No message selected</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Select a message from the list to view its content.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ConstituentDashboardLayout>
  );
}
