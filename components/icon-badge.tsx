import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const backgroundVariants = cva(
  'inline-flex items-center justify-center rounded-full p-2 text-white',
  {
    variants: {
      backgroundVariant: {
        default: 'bg-primary',
        secondary: 'bg-secondary',
        destructive: 'bg-destructive',
        success: 'bg-success',
        outline: 'bg-transparent border border-primary text-primary',
      },
      size: {
        default: 'w-10 h-10',
        sm: 'w-8 h-8',
        lg: 'w-12 h-12',
      },
    },
    defaultVariants: {
      backgroundVariant: 'default',
      size: 'default',
    },
  }
);

interface IconBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof backgroundVariants> {
  icon: LucideIcon;
}

export const IconBadge: React.FC<IconBadgeProps> = ({
  icon: Icon,
  className,
  backgroundVariant,
  size,
  ...props
}) => {
  return (
    <div
      className={cn(backgroundVariants({ backgroundVariant, size, className }))}
      {...props}
    >
      <Icon />
    </div>
  );
};
