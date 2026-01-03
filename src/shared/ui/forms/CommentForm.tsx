import React from 'react';
import { Input } from './Input';
import { Button } from '../display/Button';

interface CommentFormProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
  submitText?: string;
  isSubmitting?: boolean;
  className?: string;
}

export function CommentForm({
  value,
  onChange,
  onSubmit,
  placeholder = '메시지를 입력하세요',
  submitText = '전송',
  isSubmitting = false,
  className = ''
}: CommentFormProps) {
  return (
    <form onSubmit={onSubmit} className={`flex gap-2.5 ${className}`}>
      <Input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="flex-1 bg-bg-page"
      />
      <Button
        type="submit"
        variant="primary"
        className="h-auto px-5 whitespace-nowrap"
        disabled={isSubmitting || !value.trim()}
      >
        {submitText}
      </Button>
    </form>
  );
}
