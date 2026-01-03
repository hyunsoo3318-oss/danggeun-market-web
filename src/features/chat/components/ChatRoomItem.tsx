import { useNavigate } from 'react-router-dom';
import { Avatar, Badge } from '@/shared/ui';
import { useUserProfile } from '@/features/user/hooks/useUser';
import { ChatRoom } from '@/features/chat/hooks/useChat';
import { useTranslation } from '@/shared/i18n';

interface ChatRoomItemProps {
  room: ChatRoom;
}

function ChatRoomItem({ room }: ChatRoomItemProps) {
  const navigate = useNavigate();
  const { profile } = useUserProfile(room.opponent_id);
  const t = useTranslation();

  const formatTime = (dateString: string | null | undefined): string => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return t.chat.justNow;
    if (diffMins < 60) return `${diffMins}${t.chat.minutesAgo}`;
    if (diffHours < 24) return `${diffHours}${t.chat.hoursAgo}`;
    if (diffDays < 7) return `${diffDays}${t.chat.daysAgo}`;
    return date.toLocaleDateString();
  };

  const displayTime = formatTime(room.last_message_at);
  const displayMessage = room.last_message || '';

  return (
    <div
      className="p-4 border-b border-border-base cursor-pointer flex items-center gap-3 hover:bg-bg-box-light transition-colors"
      onClick={() => navigate(`/chat/${room.room_id}`)}
    >
      <Avatar
        src={profile?.profile_image || undefined}
        alt={profile?.nickname || t.chat.otherParty}
        size="sm"
      />
      <div className="flex-1 min-w-0">
        <div className="font-bold mb-1.5 truncate">{profile?.nickname || t.common.unknown}</div>
        <div className="text-text-secondary text-sm truncate">{displayMessage}</div>
      </div>
      <div className="text-right flex flex-col items-end min-w-15">
        <div className="text-text-secondary text-xs mb-1.5">{displayTime}</div>
        {room.unread_count > 0 && (
          <Badge variant="notification">{room.unread_count > 99 ? '99+' : room.unread_count}</Badge>
        )}
      </div>
    </div>
  );
}

export default ChatRoomItem;
