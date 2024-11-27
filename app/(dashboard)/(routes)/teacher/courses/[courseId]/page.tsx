import { IconBadge } from '@/components/icon-badge';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { Book, CircleDollarSign, File, ListChecks } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react';
import { TitleForm } from './_components/title-form';
import DescriptionForm from './_components/description-form';
import ImageForm from './_components/image-form';
import CategoryForm from './_components/category-form';
import PriceForm from './_components/price-form';
import AttachmentForm from './_components/attachment-form';
import ChaptersForm from './_components/chapters-form';
import Banner from '@/components/banner';
import Actions from './_components/actions';

type CourseParams = {
  params: { courseId: string };
};

const CourseId = async ({ params }: CourseParams) => {
  const { courseId } = await Promise.resolve(params);

  const { userId } = await auth();
  if (!userId) {
    redirect('/');
  }

  const course = await db.course.findUnique({
    where: {
      id: courseId,
      userId,
    },
    include: {
      chapters: {
        orderBy: {
          position: 'asc',
        },
      },
      attachments: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  if (!course || !categories) {
    redirect('/');
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `${completedFields}/${totalFields}`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!course.isPublished && (
        <Banner
          label='This course is not published yet. It will not be visible to the students.'
          title='Draft Course'
        />
      )}
      <div className='p-6'>
        <div className='bg-gray-100 p-4 rounded-lg shadow'>
          <div className='flex flex-col gap-y-1'>
            <h1 className='text-3xl font-semibold text-gray-900 text-center justify-center items-center'>
              Course Setup
            </h1>
            <span className='text-[16px] text-gray-600 text-center justify-center items-center'>
              Complete all fields:{' '}
              <span className='font-bold text-blue-600'>{completionText}</span>
            </span>
          </div>
          <Actions
            disabled={!isComplete}
            courseId={params.courseId}
            isPublished={course.isPublished}
          />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
          <div>
            <div className='flex items-center gap-x-2'>
              <IconBadge
                icon={Book}
                backgroundVariant='destructive'
                size='default'
              />
              <h2 className='text-xl'>Customize Your Course</h2>
            </div>
            <TitleForm
              initialData={course}
              courseId={course.id}
            />
            <DescriptionForm
              initialData={course}
              courseId={course.id}
            />
            <ImageForm
              initialData={course}
              courseId={course.id}
            />
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
          <div className='space-y-6'>
            <div>
              <div className='flex items-center gap-x-2'>
                <IconBadge icon={ListChecks} />
                <h2 className='text-xl'>Course Chapter</h2>
              </div>
              <ChaptersForm
                initialData={course}
                courseId={course.id}
              />
            </div>
            <div className='flex items-center gap-x-2'>
              <IconBadge icon={CircleDollarSign} />
              <h2 className='text-xl'>Sell your course</h2>
            </div>
            <PriceForm
              initialData={course}
              courseId={course.id}
            />
            <div>
              <div className='flex items-center gap-x-2'>
                <IconBadge icon={File} />
                <h2 className='text-xl'>Resources & Attachments</h2>
              </div>
              <AttachmentForm
                initialData={course}
                courseId={course.id}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseId;
