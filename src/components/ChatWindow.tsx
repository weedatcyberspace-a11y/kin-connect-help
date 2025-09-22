import { useState, useRef, useEffect } from 'react';
import { Message, Contact } from '@/hooks/useLocalNetwork';
import { MessageBubble } from '@/components/MessageBubble';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Radio } from 'lucide-react';

interface ChatWindowProps {
  selectedContact?: Contact;
  messages: Message[];
  onSendMessage: (text: string, recipientId: string) => void;
  onBroadcastMessage: (text: string) => void;
}

export const ChatWindow = ({ 
  selectedContact, 
  messages, 
  onSendMessage, 
  onBroadcastMessage 
}: ChatWindowProps) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputMessage.trim()) return;
    
    if (selectedContact) {
      onSendMessage(inputMessage, selectedContact.id);
    } else {
      onBroadcastMessage(inputMessage);
    }
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const filteredMessages = selectedContact 
    ? messages.filter(msg => 
        msg.sender === selectedContact.name || 
        (msg.type === 'sent' && msg.sender === 'currentUser')
      )
    : messages.filter(msg => msg.text.startsWith('[Broadcast]'));

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Chat Header */}
      <div className="p-4 border-b border-border bg-card shadow-sm">
        {selectedContact ? (
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-whatsapp-green text-white">
                {selectedContact.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">{selectedContact.name}</h3>
              <p className="text-sm text-muted-foreground">
                {selectedContact.status === 'online' ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-whatsapp-green rounded-full flex items-center justify-center">
              <Radio className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Broadcast Channel</h3>
              <p className="text-sm text-muted-foreground">Send to all connected users</p>
            </div>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <p className="mb-2">No messages yet</p>
              <p className="text-sm">
                {selectedContact 
                  ? `Start a conversation with ${selectedContact.name}` 
                  : 'Send a broadcast message to all users'
                }
              </p>
            </div>
          </div>
        ) : (
          filteredMessages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              selectedContact 
                ? `Message ${selectedContact.name}...` 
                : 'Broadcast message...'
            }
            className="flex-1"
          />
          <Button 
            onClick={handleSend} 
            disabled={!inputMessage.trim()}
            className="bg-whatsapp-green hover:bg-whatsapp-green/90 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};