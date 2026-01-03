import { useRef, useEffect } from 'react';
import type { Message } from '@/features/chat/api/chatApi';
import type { PayTransaction } from '@/features/pay/api/payApi';
import { useTranslation } from '@/shared/i18n';
import { useLanguage } from '@/shared/store/languageStore';

export type ChatItem =
  | { type: 'message'; data: Message; timestamp: number }
  | { type: 'transaction'; data: PayTransaction; timestamp: number };

interface MessageListProps {
  messages: Message[];
  transactions?: PayTransaction[];
  currentUserId?: string;
}

function MessageList({ messages, transactions = [], currentUserId }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = useTranslation();
  const { language } = useLanguage();

  // Merge messages and transactions, sorted by time
  const chatItems: ChatItem[] = [
    ...messages.map((msg) => ({
      type: 'message' as const,
      data: msg,
      timestamp: new Date(msg.created_at).getTime(),
    })),
    ...transactions.map((tx) => ({
      type: 'transaction' as const,
      data: tx,
      timestamp: new Date(tx.details.time).getTime(),
    })),
  ].sort((a, b) => a.timestamp - b.timestamp);

  const formatMessageTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(language === 'ko' ? 'ko-KR' : 'en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [chatItems.length]);

  const getItemSenderId = (item: ChatItem): string | null => {
    if (item.type === 'message') {
      return item.data.sender_id;
    }
    return null; // Transactions are centered, no sender concept for grouping
  };

  const shouldShowTime = (index: number) => {
    if (index === chatItems.length - 1) return true;
    const current = chatItems[index];
    const next = chatItems[index + 1];
    // Always show time if next item is different type or different sender
    if (current.type !== next.type) return true;
    if (current.type === 'transaction') return true;
    return getItemSenderId(current) !== getItemSenderId(next);
  };

  if (chatItems.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-3 bg-bg-base flex items-center justify-center">
        <span className="text-text-secondary text-sm">{t.chat.startConversation}</span>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1 bg-bg-base">
      {chatItems.map((item, index) => {
        const showTime = shouldShowTime(index);

        if (item.type === 'transaction') {
          const tx = item.data;
          const isSender = tx.type === 'TRANSFER' && tx.details.user.id === currentUserId;
          const amount = tx.details.amount;

          return (
            <div key={`tx-${tx.id}`} className="flex justify-center my-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-box rounded-full border border-border-medium">
                <span className={`text-sm font-medium ${isSender ? 'text-purple-500' : 'text-blue-500'}`}>
                  {isSender ? '↑' : '↓'} {amount.toLocaleString()}C
                </span>
                <span className="text-xs text-text-tertiary">
                  {isSender ? t.pay.transfer : t.pay.received}
                </span>
                {showTime && (
                  <span className="text-[11px] text-text-tertiary">
                    {formatMessageTime(tx.details.time)}
                  </span>
                )}
              </div>
            </div>
          );
        }

        // Regular message
        const msg = item.data;
        const isMe = msg.sender_id === currentUserId;

        return (
          <div
            key={msg.id}
            className={`flex items-end gap-1.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`max-w-[75%] px-3 py-2 text-[15px] leading-relaxed wrap-break-word ${
                isMe
                  ? 'bg-primary text-white rounded-lg'
                  : 'bg-bg-page text-text-heading rounded-lg border border-border-medium'
              }`}
            >
              {msg.content}
            </div>
            {showTime && (
              <span className="text-[11px] text-text-tertiary pb-0.5 shrink-0">
                {formatMessageTime(msg.created_at)}
              </span>
            )}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;
