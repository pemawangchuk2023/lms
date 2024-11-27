'use client';

import { Button } from '@/components/ui/button';
import { Course } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Pencil } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='-ml-3 h-8 hover:bg-transparent text-sm font-bold text-gray-500'
        >
          Title
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className='text-sm font-medium'>{row.getValue('title')}</span>
      );
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='h-8 hover:bg-transparent text-sm font-bold text-gray-500'
        >
          Price
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price') || '0');
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(price || 0);

      return (
        <div className='text-center font-medium tabular-nums'>{formatted}</div>
      );
    },
  },
  {
    accessorKey: 'isPublished',
    header: ({ column }) => {
      return (
        <div className='text-right'>
          <Button
            variant='outline'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className='h-8 border border-gray-300 hover:bg-transparent text-sm font-medium text-gray-500'
          >
            Published
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const isPublished = row.getValue('isPublished');

      return (
        <div className='text-right'>
          <span
            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md ${
              isPublished
                ? 'bg-black text-green-500'
                : 'bg-gray-100 text-red-700'
            }`}
          >
            {isPublished ? 'Published' : 'Draft'}
          </span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: ({ column }) => (
      <div className='text-right pr-4'>
        {' '}
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='h-8 hover:bg-transparent text-sm font-bold text-red-500'
        >
          Actions
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <div className='text-right pr-4'>
          {' '}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='h-8 w-8 p-0'
              >
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <Link href={`/teacher/courses/${id}`}>
                <DropdownMenuItem>
                  <Pencil className='mr-2 h-4 w-4' />
                  <span>Edit</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
