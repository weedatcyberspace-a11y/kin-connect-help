import { Contact } from '@/hooks/useLocalNetwork';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ContactListProps {
  contacts: Contact[];
  selectedContact?: string;
  onContactSelect: (contactId: string) => void;
}

export const ContactList = ({ contacts, selectedContact, onContactSelect }: ContactListProps) => {
  return (
    <div className="w-80 bg-card border-r border-border">
      <div className="p-4 border-b border-border bg-whatsapp-green">
        <h2 className="text-lg font-semibold text-white">Local Network Chat</h2>
        <p className="text-sm text-white/80">Connected users on your network</p>
      </div>
      
      <div className="divide-y divide-border">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className={cn(
              'p-4 flex items-center space-x-3 hover:bg-accent cursor-pointer transition-colors',
              selectedContact === contact.id && 'bg-accent'
            )}
            onClick={() => onContactSelect(contact.id)}
          >
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-whatsapp-green text-white">
                  {contact.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background',
                  contact.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                )}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {contact.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {contact.status === 'online' 
                  ? 'Online' 
                  : contact.lastSeen 
                    ? `Last seen ${contact.lastSeen.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    : 'Offline'
                }
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-muted-foreground">
            Local network active
          </span>
        </div>
      </div>
    </div>
  );
};