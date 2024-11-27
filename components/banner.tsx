import React from 'react';
import { Info, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

type BannerProps = {
  label: string;
  title?: string;
  variant?: 'info' | 'warning' | 'success' | 'error';
};

const Banner: React.FC<BannerProps> = ({ label, title, variant = 'info' }) => {
  const variantStyles = {
    info: {
      bg: 'bg-sky-200/80',
      text: 'text-sky-700',
      border: 'border-sky-500/50',
      icon: <Info className='w-5 h-5 mr-2 text-sky-700' />,
    },
    warning: {
      bg: 'bg-yellow-200/80',
      text: 'text-yellow-800',
      border: 'border-yellow-500/50',
      icon: <AlertTriangle className='w-5 h-5 mr-2 text-yellow-800' />,
    },
    success: {
      bg: 'bg-emerald-200/80',
      text: 'text-emerald-700',
      border: 'border-emerald-500/50',
      icon: <CheckCircle2 className='w-5 h-5 mr-2 text-emerald-700' />,
    },
    error: {
      bg: 'bg-rose-200/80',
      text: 'text-rose-700',
      border: 'border-rose-500/50',
      icon: <XCircle className='w-5 h-5 mr-2 text-rose-700' />,
    },
  };

  const { bg, text, border, icon } = variantStyles[variant];

  return (
    <div
      className={`
        ${bg} 
        ${text} 
        ${border} 
        p-4 
        border 
        rounded-md 
        flex 
        items-center 
        w-full 
        mb-4 
        shadow-sm 
        transition-all 
        duration-300 
        ease-in-out
      `}
    >
      <div className='flex items-center'>
        {icon}
        <div>
          {title && <p className={`font-bold text-sm ${text} mb-1`}>{title}</p>}
          <p className='text-sm'>{label}</p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
