import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackNavigationProps {
  to: string;
  text?: string;
}

export function BackNavigation({ to, text = 'Back' }: BackNavigationProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors mb-4"
    >
      <ArrowLeft className="w-5 h-5" />
      <span>{text}</span>
    </button>
  );
}