'use client';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

const SidebarItem = ({ icon: Icon, label, href }: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive =
    (pathname === '/' && href === '/') ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);

  const onClick = () => {
    router.push(href);
  };

  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        'group w-full flex items-center justify-start gap-x-3 px-4 py-2 my-1 rounded-md',
        'text-slate-500 text-base font-medium transition-all duration-200',
        'hover:bg-slate-100 hover:text-slate-700',
        'focus:outline-none focus:ring-2 focus:ring-orange-300',
        isActive
          ? 'bg-orange-100 text-orange-700 hover:bg-orange-200 hover:text-orange-800'
          : 'hover:bg-slate-100 hover:text-slate-700'
      )}
    >
      <Icon
        size={20}
        className={cn(
          'text-slate-500 group-hover:text-slate-700',
          isActive
            ? 'text-orange-700 group-hover:text-orange-800'
            : 'text-slate-500 group-hover:text-slate-700'
        )}
      />
      <span className='flex-grow'>{label}</span>

      {isActive && (
        <div
          className='w-1 h-6 bg-orange-500 rounded-full ml-auto 
          transition-all duration-300 ease-in-out'
        />
      )}
    </button>
  );
};

export default SidebarItem;
