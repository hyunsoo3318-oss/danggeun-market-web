import { useNavigate } from 'react-router-dom';
import { Avatar } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';
import { useHierarchicalBack } from '@/shared/hooks/useHierarchicalBack';

interface ChatHeaderProps {
  opponentId?: string;
  opponentNickname?: string | null;
  opponentProfileImage?: string | null;
  userCoin: number;
  onToggleTransferMenu: () => void;
}

function ChatHeader({
  opponentId,
  opponentNickname,
  opponentProfileImage,
  userCoin,
  onToggleTransferMenu,
}: ChatHeaderProps) {
  const navigate = useNavigate();
  const t = useTranslation();
  const goBack = useHierarchicalBack();

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-bg-page border-b border-border-medium">
      <button
        onClick={goBack}
        className="p-1 -ml-1 text-text-secondary hover:text-text-heading transition-colors md:hidden"
      >
        ←
      </button>
      <div
        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity flex-1"
        onClick={() => opponentId && navigate(`/user/${opponentId}`)}
      >
        <Avatar
          src={opponentProfileImage || undefined}
          alt={opponentNickname || t.chat.otherParty}
          size="sm"
        />
        <span className="font-semibold text-text-heading">
          {opponentNickname || t.common.unknown}
        </span>
      </div>
      <button
        onClick={onToggleTransferMenu}
        className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
      >
        {userCoin.toLocaleString()} C
      </button>
    </div>
  );
}

export default ChatHeader;
