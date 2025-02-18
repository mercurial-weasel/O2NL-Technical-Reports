import { DivideIcon as LucideIcon } from 'lucide-react';

export interface CardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
  comingSoon?: boolean;
  enabled: boolean;
  requiresAuth?: boolean; // Add new property for auth requirement
}

export interface ContactLinkProps {
  icon: LucideIcon;
  href: string;
  label: string;
  external?: boolean;
}