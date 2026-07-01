'use client';

import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

type OpenConciergeButtonProps = {
  children: ReactNode;
  className: string;
};

export default function OpenConciergeButton({ children, className }: OpenConciergeButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent('stopover:open-concierge'))}
      className={className}
    >
      {children}
      <ArrowRight size={18} />
    </button>
  );
}
