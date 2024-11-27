'use client';
import { Category } from '@prisma/client';
import React from 'react';
import { IconType } from 'react-icons';
import {
  FcMusic,
  FcOldTimeCamera,
  FcBusinessman,
  FcSportsMode,
  FcSalesPerformance,
  FcMultipleDevices,
  FcFilmReel,
  FcEngineering,
} from 'react-icons/fc';
import CategoryItem from './CategoryItem';

interface CategoriesProps {
  items: Category[];
}

const iconMap: Record<string, IconType> = {
  'Computer Science': FcMultipleDevices,
  'Music': FcMusic,
  'Fitness': FcSportsMode,
  'Photography': FcOldTimeCamera,
  'Accounting': FcSalesPerformance,
  'Business': FcBusinessman,
  'Filming': FcFilmReel,
  'Engineering': FcEngineering,
};

const Categories = ({ items }: CategoriesProps) => {
  return (
    <div className='flex items-center gap-x-2 overflow-x-auto pb-2'>
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
      {}
    </div>
  );
};

export default Categories;
