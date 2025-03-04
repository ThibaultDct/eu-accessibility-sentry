import React from 'react';
import { cn } from "@/lib/utils";
import { Shield } from 'lucide-react';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn(
      "w-full py-6 px-8 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-10",
      className
    )}>
      <div className="flex items-center space-x-2">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-xl font-medium tracking-tight">EU Accessibility Sentry</h1>
          <p className="text-sm text-muted-foreground">WCAG 2.1 & EN 301 549 Compliance Checker</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
