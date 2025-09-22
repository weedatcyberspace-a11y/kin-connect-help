import { useState } from 'react';
import { useOpenAI } from '@/hooks/useOpenAI';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { MessageBubble } from '@/components/MessageBubble';
import { Message } from '@/hooks/useLocalNetwork';
import { Bot, Settings, Trash2, Send } from 'lucide-react';
import { toast } from 'sonner';

export const AIAssistant = () => {
  const { apiKey, saveApiKey, sendToAI, isLoading, conversation, clearConversation, hasApiKey } = useOpenAI();
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [inputMessage, setInputMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSaveApiKey = () => {
    if (!tempApiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }
    saveApiKey(tempApiKey);
    toast.success('API key saved successfully');
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    if (!hasApiKey) {
      toast.error('Please configure your OpenAI API key first');
      return;
    }

    const message = inputMessage;
    setInputMessage('');

    try {
      await sendToAI(message);
    } catch (error) {
      console.error('AI chat error:', error);
      toast.error('Failed to send message to AI. Please check your API key.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Convert AI messages to Message format for MessageBubble
  const formatMessages: Message[] = conversation.map(msg => ({
    id: msg.id,
    text: msg.content,
    sender: msg.role === 'user' ? 'You' : 'AI Assistant',
    timestamp: msg.timestamp,
    type: msg.role === 'user' ? 'sent' : 'received'
  }));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <Bot className="w-4 h-4" />
          <span>AI Assistant</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-whatsapp-green" />
              <span>AI Assistant</span>
            </div>
            <div className="flex items-center space-x-2">
              {hasApiKey && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearConversation}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>AI Assistant Settings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="apiKey">OpenAI API Key</Label>
                      <Input
                        id="apiKey"
                        type="password"
                        value={tempApiKey}
                        onChange={(e) => setTempApiKey(e.target.value)}
                        placeholder="sk-..."
                        className="mt-1"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Get your API key from{' '}
                        <a 
                          href="https://platform.openai.com/api-keys" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          OpenAI Platform
                        </a>
                      </p>
                    </div>
                    <Button onClick={handleSaveApiKey} className="w-full">
                      Save API Key
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </DialogTitle>
        </DialogHeader>

        {!hasApiKey ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Setup Required</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                To use the AI assistant, you need to provide your OpenAI API key.
              </p>
              <div className="space-y-2">
                <Label htmlFor="setup-apikey">OpenAI API Key</Label>
                <Input
                  id="setup-apikey"
                  type="password"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="sk-..."
                />
              </div>
              <Button onClick={handleSaveApiKey} className="w-full">
                Save & Continue
              </Button>
              <p className="text-xs text-muted-foreground">
                Your API key is stored locally and never shared.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-muted/20 rounded-md">
              {formatMessages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Bot className="w-12 h-12 mx-auto mb-4 text-whatsapp-green" />
                  <p className="mb-2">AI Assistant is ready to help!</p>
                  <p className="text-sm">Ask me anything - questions, help with tasks, or just chat.</p>
                </div>
              ) : (
                formatMessages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))
              )}
              {isLoading && (
                <div className="flex justify-start mb-2">
                  <div className="bg-message-received text-foreground px-3 py-2 rounded-lg rounded-bl-sm max-w-[70%]">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-whatsapp-green rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-whatsapp-green rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-whatsapp-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="flex-shrink-0 p-4 border-t border-border">
              <div className="flex items-center space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask the AI assistant anything..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-whatsapp-green hover:bg-whatsapp-green/90 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};