import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { IconBadge } from './icon-badge';
import { BookOpen } from 'lucide-react';
import { formatPrice } from '@/lib/format';

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  progress: number | null;
  price: number;
  category: string;
}
const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  progress,
  price,
  category,
}: CourseCardProps) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className='group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full'>
        <div className='relative w-full aspect-ratio rounded-md overflow-hidden'>
          <Image
            alt={title}
            src={imageUrl}
            width={150}
            height={150}
            className='object-cover'
          />
        </div>
        <div className='flex flex-col pt-2'>
          <div className='tetx-lg md:text-base font-medium group-hover: text-sky-700 transition line-clamp-2'>
            {title}
          </div>
          <p className='text-xs text-muted-foreground'>{category}</p>
          <div className='my-3 flex items-center gap-x-1 text-slate-500'>
            <IconBadge
              size='sm'
              icon={BookOpen}
            />
            <span>
              {chaptersLength} {chaptersLength === 1 ? 'Chapter' : 'Chapters'}
            </span>
          </div>
        </div>
        {progress !== null ? (
          <div>ToDo: Progress Component</div>
        ) : (
          <p className='text-md md:text-sm font-medium text-slate-700'>
            {formatPrice(price)}
          </p>
        )}
      </div>
    </Link>
  );
};

export default CourseCard;
