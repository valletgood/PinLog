import clsx from 'clsx';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function Layout({ children, className }: LayoutProps) {
  return <div className={clsx('w-full h-full', className)}>{children}</div>;
}
