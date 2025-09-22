import { useState } from 'react';
import { useLocalNetwork } from '@/hooks/useLocalNetwork';
import { ContactList } from '@/components/ContactList';
import { ChatWindow } from '@/components/ChatWindow';
import { AIAssistant } from '@/components/AIAssistant';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff, Users } from 'lucide-react';

const Index = () => {
  const { 
    messages, 
    contacts, 
    currentUser, 
    isConnected, 
    sendMessage, 
    broadcastMessage 
  } = useLocalNetwork();
  
  const [selectedContactId, setSelectedContactId] = useState<string>('');
  const selectedContact = contacts.find(c => c.id === selectedContactId);

  const handleContactSelect = (contactId: string) => {
    setSelectedContactId(contactId === selectedContactId ? '' : contactId);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Status Bar */}
      <div className="flex items-center justify-between p-4 bg-whatsapp-green text-white shadow-sm">
        <div className="flex items-center space-x-3">
          {isConnected ? (
            <Wifi className="w-5 h-5" />
          ) : (
            <WifiOff className="w-5 h-5" />
          )}
          <div>
            <h1 className="font-semibold">LocalNet Messenger</h1>
            <p className="text-sm opacity-90">
              Connected as {currentUser} • No Internet Required
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <Users className="w-4 h-4" />
            <span>{contacts.filter(c => c.status === 'online').length} online</span>
          </div>
          <AIAssistant />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Contacts Sidebar */}
        <ContactList
          contacts={contacts}
          selectedContact={selectedContactId}
          onContactSelect={handleContactSelect}
        />

        {/* Chat Area */}
        <ChatWindow
          selectedContact={selectedContact}
          messages={messages}
          onSendMessage={sendMessage}
          onBroadcastMessage={broadcastMessage}
        />
      </div>

      {/* Network Status Footer */}
      {!isConnected && (
        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 border-t border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
              <WifiOff className="w-4 h-4" />
              <span className="text-sm">Network disconnected</span>
            </div>
            <Button variant="outline" size="sm" className="text-yellow-800 border-yellow-300">
              Retry Connection
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;