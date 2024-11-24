'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const Courses = () => {
  const [isCreated, setIsCreated] = useState(false);
  return (
    <div className='container mx-auto px-4 py-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>
          These Are Your Courses
        </h1>
        <Link
          href='/teacher/create'
          passHref
        >
          <Button className='flex items-center gap-2'>
            <PlusCircle className='w-5 h-5' />
            Create New Course
          </Button>
        </Link>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <p className='text-green-500 text-center col-span-full'>
          No courses created yet. Click "Create New Course" to get started.
        </p>
      </div>
    </div>
  );
};

export default Courses;
