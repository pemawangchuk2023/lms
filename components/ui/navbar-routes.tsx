'use client';
import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import React from 'react';
import { Button } from './button';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import SearchInput from '../search-input';

const NavbarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith('/teacher');
  const isPlayerPage = pathname?.startsWith('/player');
  const isSearchPage = pathname === '/search';

  return (
    <div className='flex items-center justify-between w-full p-4'>
      {isSearchPage && (
        <div className='hidden sm:block'>
          <SearchInput />
        </div>
      )}
      <div className='flex gap-x-2 ml-auto'>
        {isTeacherPage || isPlayerPage ? (
          <Link href='/'>
            <Button>
              <LogOut className='h-4 w-4 mr-2' />
              Exit
            </Button>
          </Link>
        ) : (
          <Link href='/teacher/courses'>
            <Button>Teacher Mode</Button>
          </Link>
        )}
        <UserButton />
      </div>
    </div>
  );
};

export default NavbarRoutes;
