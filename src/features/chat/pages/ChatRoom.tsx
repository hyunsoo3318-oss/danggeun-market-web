import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMessages, useSendMessage, useMarkAsRead, useChatRoom } from '@/features/chat/hooks/useChat';
import { useUser, useUserProfile } from '@/features/user/hooks/useUser';
import { Loading, ErrorMessage, DetailHeader } from '@/shared/ui';
import { TransferMenu } from '@/features/pay/components/transfer';
import { useTransactions } from '@/features/pay/hooks/useTransactions';
import ChatHeader from '@/features/chat/components/ChatHeader';
import MessageList from '@/features/chat/components/MessageList';
import ChatInput from '@/features/chat/components/ChatInput';
import { POLLING_CONFIG, getPollingInterval } from '@/shared/config/polling';
import { useTranslation } from '@/shared/i18n';

function ChatRoom() {
  const t = useTranslation();
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [showTransferMenu, setShowTransferMenu] = useState(false);
  const { user, isLoggedIn, isLoading: userLoading } = useUser({
    refetchInterval: getPollingInterval(POLLING_CONFIG.USER_BALANCE),
  });

  const { room: roomInfo } = useChatRoom(chatId);
  const { messages, isLoading: loading, error } = useMessages(chatId, { refetchInterval: POLLING_CONFIG.CHAT_MESSAGES });
  const sendMessageMutation = useSendMessage(chatId || '');
  const markAsReadMutation = useMarkAsRead(chatId || '');

  const { profile: opponentProfile } = useUserProfile(roomInfo?.opponent_id);
  const { transactions } = useTransactions({
    partnerId: roomInfo?.opponent_id,
    refetchInterval: POLLING_CONFIG.TRANSACTIONS,
  });

  useEffect(() => {
    if (!userLoading && !isLoggedIn) {
      navigate('/auth/login');
    }
  }, [userLoading, isLoggedIn, navigate]);

  useEffect(() => {
    if (chatId && isLoggedIn && messages.length > 0) {
      markAsReadMutation.mutate();
    }
  }, [chatId, isLoggedIn, messages.length]);

  const handleSend = (content: string) => {
    if (!chatId || sendMessageMutation.isPending) return;

    sendMessageMutation.mutate(content, {
      onError: () => alert(t.chat.sendFailed),
    });
  };

  if (userLoading || loading) return <Loading />;
  if (error) return <ErrorMessage message={t.chat.messageFailed} />;

  return (
    <div className="w-full md:max-w-250 md:mx-auto md:px-4 md:py-6 md:min-h-[calc(100vh-60px)]">
      <div className="hidden md:block">
        <DetailHeader />
      </div>

      <div className="flex flex-col h-[calc(100dvh-64px)] md:h-[70vh] bg-bg-base md:bg-bg-page md:rounded-lg md:border md:border-border-medium md:overflow-hidden">
        <ChatHeader
          opponentId={roomInfo?.opponent_id}
          opponentNickname={opponentProfile?.nickname}
          opponentProfileImage={opponentProfile?.profile_image}
          userCoin={user?.coin || 0}
          onToggleTransferMenu={() => setShowTransferMenu(!showTransferMenu)}
        />

        {showTransferMenu && (
          <TransferMenu
            currentCoin={user?.coin || 0}
            recipientId={roomInfo?.opponent_id}
            recipientName={opponentProfile?.nickname || t.chat.otherParty}
          />
        )}

        <MessageList messages={messages} transactions={transactions} currentUserId={user?.id} />

        <ChatInput onSend={handleSend} isPending={sendMessageMutation.isPending} />
      </div>
    </div>
  );
}

export default ChatRoom;
