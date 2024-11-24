import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function Logo({ size = 'medium', className }: LogoProps) {
  const dimensions = {
    small: 40,
    medium: 60,
    large: 80,
  };

  const width = dimensions[size];
  const height = width;

  return (
    <div className={cn('inline-flex items-center space-x-2', className)}>
      <Image
        src='/assets/logo.svg'
        width={width}
        height={height}
        alt='EduFlow Logo'
        className='text-primary'
      />
      <span className='text-2xl font-bold text-primary'>EduFlow</span>
    </div>
  );
}
