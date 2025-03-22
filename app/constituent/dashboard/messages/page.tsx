'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import ConstituentDashboardLayout from '../../../../components/constituent/ConstituentDashboardLayout';
import { 
  PaperAirplaneIcon, 
  FolderIcon,
  ArchiveBoxIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function MessagesPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  
  // Mock data - in a real app, this would come from Convex
  const messages: Message[] = [
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
    return null;
  }

  return (
    <ConstituentDashboardLayout>
      <div className="h-full flex flex-col">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Messages
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Communicate directly with your representative and their office.
          </p>
        </div>
        
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
                <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                  {messages.filter(m => m.folder === 'inbox' && m.status === 'unread').length}
                </span>
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
            
            {/* Compose button */}
            <div className="mt-6">
              <button
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                <PaperAirplaneIcon className="-rotate-45 mr-2 h-5 w-5" />
                Compose New
              </button>
            </div>
          </div>
          
          {/* Message list and detail view */}
          <div className="flex-1 flex flex-col md:flex-row">
            {/* Message list */}
            <div className={`w-full ${selectedMessage ? 'hidden md:block md:w-1/3' : 'md:w-full'} border-r border-gray-200 dark:border-gray-700 overflow-y-auto max-h-[70vh] md:max-h-[calc(100vh-12rem)]`}>
              {filteredMessages.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredMessages.map((message) => (
                    <li key={message.id} className="cursor-pointer" onClick={() => handleSelectMessage(message)}>
                      <div className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 ${message.status === 'unread' ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center">
                              <p className={`text-sm font-medium ${message.status === 'unread' ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                                {message.sender}
                              </p>
                              {message.priority === 'high' && (
                                <ExclamationCircleIcon className="ml-2 h-4 w-4 text-red-500" aria-hidden="true" />
                              )}
                            </div>
                            <p className={`mt-1 text-sm ${message.status === 'unread' ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                              {message.subject}
                            </p>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                              {message.content.substring(0, 80)}...
                            </p>
                          </div>
                          <div className="ml-4 flex-shrink-0 flex flex-col items-end">
                            <p className="text-xs text-gray-500 dark:text-gray-400">{message.date}</p>
                            {message.attachments.length > 0 && (
                              <span className="mt-1 inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                                {message.attachments.length}
                              </span>
                            )}
                            {message.status === 'unread' && (
                              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-600"></span>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No messages found</p>
                </div>
              )}
            </div>
            
            {/* Message detail */}
            {selectedMessage ? (
              <div className="w-full md:w-2/3 flex flex-col overflow-hidden">
                {/* Message header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{selectedMessage.subject}</h3>
                      <div className="mt-1 flex items-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          From: {selectedMessage.sender}
                        </p>
                        {selectedMessage.priority === 'high' && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            High Priority
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(selectedMessage.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <ArchiveBoxIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Attachments */}
                  {selectedMessage.attachments.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Attachments</h4>
                      <ul className="mt-2 space-y-2">
                        {selectedMessage.attachments.map((attachment, index) => (
                          <li key={index} className="flex items-center p-2 rounded-md bg-gray-50 dark:bg-gray-800">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{attachment.name}</span>
                            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{attachment.size}</span>
                            <button className="ml-auto text-blue-600 hover:text-blue-500 dark:text-blue-400 text-sm">
                              Download
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {/* Message thread */}
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-6">
                    {selectedMessage.thread.map((message, index) => (
                      <div key={message.id} className={`flex ${message.senderRole === 'constituent' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-lg rounded-lg px-4 py-3 ${message.senderRole === 'constituent' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-800'}`}>
                          <div className="flex items-center">
                            <p className={`text-sm font-medium ${message.senderRole === 'constituent' ? 'text-blue-800 dark:text-blue-200' : 'text-gray-900 dark:text-white'}`}>
                              {message.sender}
                            </p>
                            <p className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                              {new Date(message.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <div className="mt-1">
                            <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                              {message.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Reply box */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-start space-x-4">
                    <div className="min-w-0 flex-1">
                      <div className="relative">
                        <textarea
                          rows={3}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:placeholder:text-gray-500 sm:text-sm sm:leading-6"
                          placeholder="Reply to this message..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                      </div>
                      <div className="mt-2 flex justify-between">
                        <div className="flex items-center space-x-2">
                          <button type="button" className="-m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400">
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z" clipRule="evenodd" />
                            </svg>
                            <span className="sr-only">Attach a file</span>
                          </button>
                        </div>
                        <button
                          type="button"
                          className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-70 disabled:cursor-not-allowed dark:bg-blue-700 dark:hover:bg-blue-600"
                          disabled={!replyText.trim()}
                          onClick={handleSendReply}
                        >
                          <PaperAirplaneIcon className="-rotate-45 -ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full flex-1 flex items-center justify-center p-4">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Select a message</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Choose a message from the list to view its contents.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ConstituentDashboardLayout>
  );
}

// Types
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
