import { Mountain, Leaf, Boxes, Mail, Globe, DollarSign } from 'lucide-react';
import { CardProps, ContactLinkProps } from '../types/default';

export const CARDS: CardProps[] = [
  {
    id: 'project-controls',
    title: 'Project Controls',
    description: 'Monitor project performance through cost, risk, programme, quality, and scope metrics.',
    icon: DollarSign,
    color: '#6CC24A',
    enabled: true
  },
  {
    id: 'geotechnical',
    title: 'Geotechnical',
    description: 'Access comprehensive geotechnical data including soil properties, test results, and site investigations.',
    icon: Mountain,
    color: '#6CC24A',
    enabled: true
  },
  {
    id: 'environmental',
    title: 'Environmental',
    description: 'Review environmental impact assessments, monitoring data, and compliance reports.',
    icon: Leaf,
    color: '#6CC24A',
    enabled: true
  }
];

export const CONTACT_LINKS: ContactLinkProps[] = [
  {
    icon: Mail,
    href: 'mailto:support@o2nl.nz',
    label: 'support@o2nl.nz'
  },
  {
    icon: Globe,
    href: 'https://nztransportagency.sharepoint.com/sites/O2NLAllianceHub',
    label: 'O2NL Alliance Hub',
    external: true
  }
];