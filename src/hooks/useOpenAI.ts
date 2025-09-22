import { useState } from 'react';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const useOpenAI = () => {
  const [apiKey, setApiKey] = useState<string>(() => 
    localStorage.getItem('openai_api_key') || ''
  );
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<AIMessage[]>([]);

  const saveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('openai_api_key', key);
  };

  const sendToAI = async (message: string): Promise<string> => {
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }

    setIsLoading(true);

    try {
      const userMessage: AIMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: message,
        timestamp: new Date()
      };

      setConversation(prev => [...prev, userMessage]);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful AI assistant in a local network messaging app. Be concise, friendly, and helpful. You can help with questions, provide information, and assist with various tasks.'
            },
            ...conversation.map(msg => ({ role: msg.role, content: msg.content })),
            { role: 'user', content: message }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setConversation(prev => [...prev, assistantMessage]);
      return aiResponse;

    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    setConversation([]);
  };

  return {
    apiKey,
    saveApiKey,
    sendToAI,
    isLoading,
    conversation,
    clearConversation,
    hasApiKey: !!apiKey
  };
};