import { PayTransaction } from '@/features/pay/api/payApi';
import { Avatar } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';
import { useLanguage } from '@/shared/store/languageStore';

interface TransactionItemProps {
  tx: PayTransaction;
  currentUserId?: string;
}

export function TransactionItem({ tx, currentUserId }: TransactionItemProps) {
  const t = useTranslation();
  const { language } = useLanguage();

  const isTransfer = tx.type === 'TRANSFER';
  const isSender = isTransfer && tx.details.user.id === currentUserId;

  const getTransactionInfo = () => {
    if (tx.type === 'DEPOSIT') {
      return { label: t.pay.charge, icon: '↓', isPositive: true };
    }
    if (tx.type === 'WITHDRAW') {
      return { label: t.pay.withdraw, icon: '↑', isPositive: false };
    }
    // TRANSFER
    if (isSender) {
      return { label: t.pay.transfer, icon: '→', isPositive: false };
    }
    return { label: t.pay.received, icon: '←', isPositive: true };
  };

  const { label, icon, isPositive } = getTransactionInfo();
  const formattedDate = new Date(tx.details.time).toLocaleString(
    language === 'ko' ? 'ko-KR' : 'en-US'
  );

  // For transfer, show the other party's info
  const otherParty =
    isTransfer && 'receive_user' in tx.details
      ? isSender
        ? tx.details.receive_user
        : tx.details.user
      : null;

  if (isTransfer) {
    return (
      <div
        className={`flex items-center gap-3 p-4 rounded-lg border-l-4 ${
          isPositive
            ? 'bg-blue-500/10 border-l-blue-500'
            : 'bg-purple-500/10 border-l-purple-500'
        }`}
      >
        <Avatar
          src={otherParty?.profile_image ?? undefined}
          alt={otherParty?.nickname || t.common.unknown}
          size="sm"
        />
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-text-primary">
            {label} · {otherParty?.nickname || t.common.unknown}
          </p>
          <p className="text-xs text-text-tertiary">{formattedDate}</p>
        </div>
        <span
          className={`font-bold text-lg ${
            isPositive ? 'text-blue-500' : 'text-purple-500'
          }`}
        >
          {isPositive ? '+' : '-'}
          {tx.details.amount.toLocaleString()}C
        </span>
      </div>
    );
  }

  // Deposit / Withdraw
  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg border-l-4 ${
        isPositive
          ? 'bg-primary/5 border-l-primary'
          : 'bg-status-error/5 border-l-status-error'
      }`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold ${
          isPositive ? 'bg-primary' : 'bg-status-error'
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p className="text-sm font-medium text-text-primary">{label}</p>
        <p className="text-xs text-text-tertiary">{formattedDate}</p>
      </div>
      <span
        className={`font-bold text-lg ${
          isPositive ? 'text-primary' : 'text-status-error'
        }`}
      >
        {isPositive ? '+' : '-'}
        {tx.details.amount.toLocaleString()}C
      </span>
    </div>
  );
}
