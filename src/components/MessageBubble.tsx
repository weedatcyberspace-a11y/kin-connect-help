import { Message } from '@/hooks/useLocalNetwork';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isSent = message.type === 'sent';

  return (
    <div className={cn('flex mb-2', isSent ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[70%] px-3 py-2 rounded-lg shadow-sm',
          isSent 
            ? 'bg-message-sent text-white rounded-br-sm' 
            : 'bg-message-received text-foreground rounded-bl-sm'
        )}
      >
        {!isSent && (
          <p className="text-xs text-whatsapp-green font-medium mb-1">
            {message.sender}
          </p>
        )}
        <p className="text-sm break-words">{message.text}</p>
        <p className={cn(
          'text-xs mt-1 opacity-70',
          isSent ? 'text-right text-white/80' : 'text-muted-foreground'
        )}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </div>
  );
};