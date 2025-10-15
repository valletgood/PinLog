import clsx from 'clsx';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export default function Layout({ children, className }: LayoutProps) {
  return <div className={clsx('w-full h-full', className)}>{children}</div>;
}
