import * as React from 'react';
import { cn } from '../../utils/cn';

export const Typography = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { as?: any }
>(({ className, as: Tag = 'p', ...props }, ref) => {
  return <Tag ref={ref} className={cn('text-foreground', className)} {...props} />;
});
Typography.displayName = 'Typography';
