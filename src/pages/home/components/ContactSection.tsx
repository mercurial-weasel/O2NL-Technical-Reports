import React from 'react';
import { Section } from '@common';
import { CONTACT_LINKS } from '@constants/default';

export function ContactSection() {
  return (
    <Section className="py-16 bg-background-darker">
      <div className="bg-gradient-to-br from-background-card-from to-background-card-to border border-border-primary rounded-xl p-8">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Contact & Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {CONTACT_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-3 text-text-secondary hover:text-brand-primary transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-brand-primary/5 group-hover:bg-brand-primary/10 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm">
                    {link.label}
                    {link.external && (
                      <svg
                        className="w-4 h-4 inline-block ml-1 opacity-50 group-hover:opacity-100 transition-opacity"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
                          clipRule="evenodd"
                        />
                        <path
                          fillRule="evenodd"
                          d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </span>
                </a>
              );
            })}
          </div>
          <div className="text-sm text-text-secondary">
            For technical support or access to additional resources, please contact our support team or visit the O2NL Alliance Hub.
          </div>
        </div>
      </div>
    </Section>
  );
}