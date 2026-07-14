import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Spinner = ({
  className,
  size = 24,
  ...props
}: React.ComponentProps<typeof Loader2>) => {
  return (
    <Loader2
      className={cn('text-muted-foreground animate-spin', className)}
      size={size}
      {...props}
    />
  );
};
