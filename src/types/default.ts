import { LucideIcon } from 'lucide-react';

export interface CardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
  comingSoon?: boolean;
  enabled: boolean; // Added enabled prop
}

export interface ContactLinkProps {
  icon: LucideIcon;
  href: string;
  label: string;
  external?: boolean;
}