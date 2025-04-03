'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import ConstituentDashboardLayout from 'src/components/constituent/ConstituentDashboardLayout';
import { 
  PaperAirplaneIcon, 
  FolderIcon,
  ArchiveBoxIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

import MessagesPageLoader from '@/components/constituent/dashboard/messages/MessagesPageLoader';

// This page is now a Server Component.
export default function MessagesPage() {
  return <MessagesPageLoader />;
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
