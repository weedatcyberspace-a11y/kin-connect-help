import { useState, useEffect, useRef } from 'react';

export interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  type: 'sent' | 'received';
}

export interface Contact {
  id: string;
  name: string;
  status: 'online' | 'offline';
  lastSeen?: Date;
}

export const useLocalNetwork = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const webSocketRef = useRef<WebSocket | null>(null);
  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());

  // Initialize user
  useEffect(() => {
    const username = localStorage.getItem('localnet_username') || 
                    `User_${Math.random().toString(36).substr(2, 5)}`;
    setCurrentUser(username);
    localStorage.setItem('localnet_username', username);
  }, []);

  // Simulate local network discovery
  useEffect(() => {
    const simulateLocalUsers = () => {
      const mockContacts: Contact[] = [
        { id: '1', name: 'Alice', status: 'online' },
        { id: '2', name: 'Bob', status: 'online' },
        { id: '3', name: 'Charlie', status: 'offline', lastSeen: new Date(Date.now() - 300000) },
      ];
      setContacts(mockContacts);
    };

    simulateLocalUsers();
    setIsConnected(true);

    // Simulate periodic contact updates
    const interval = setInterval(() => {
      setContacts(prev => prev.map(contact => ({
        ...contact,
        status: Math.random() > 0.3 ? 'online' : 'offline' as 'online' | 'offline'
      })));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const sendMessage = (text: string, recipientId: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: currentUser,
      timestamp: new Date(),
      type: 'sent'
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate receiving response after delay
    setTimeout(() => {
      const recipient = contacts.find(c => c.id === recipientId);
      if (recipient && recipient.status === 'online') {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          text: `Echo: ${text}`,
          sender: recipient.name,
          timestamp: new Date(),
          type: 'received'
        };
        setMessages(prev => [...prev, response]);
      }
    }, 1000 + Math.random() * 2000);
  };

  const broadcastMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: `[Broadcast] ${text}`,
      sender: currentUser,
      timestamp: new Date(),
      type: 'sent'
    };

    setMessages(prev => [...prev, newMessage]);
  };

  return {
    messages,
    contacts,
    currentUser,
    isConnected,
    sendMessage,
    broadcastMessage,
  };
};