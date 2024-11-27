import { IconBadge } from '@/components/icon-badge';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { ArrowLeft, Eye, LayoutDashboard, Video } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import { ChapterTitleForm } from './_components/chapter-title-form';
import ChapterDescriptionUpdate from './_components/chapter-description-form';
import ChapterAccessForm from './_components/chapter-access-form';
import ChapterActions from '../../_components/chapter-actions';
import ChapterVideo from './_components/chapter-video-form';

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { courseId, chapterId } = await Promise.resolve(params);

  const { userId } = await auth();
  if (!userId) {
    redirect('/');
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id: chapterId,
      courseId: courseId,
    },
    include: {
      muxData: true,
    },
  });

  if (!chapter) {
    redirect('/');
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = completedFields === totalFields;

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between'>
        <div className='w-full'>
          <Link
            href={`/teacher/courses/${courseId}`}
            className='flex items-center text-sm hover:opacity-75 transition mb-6'
          >
            <ArrowLeft />
            Back to the course set up
          </Link>

          <div className='flex items-center justify-between w-full'>
            <div className='flex flex-col gap-y-2'>
              <h1 className='text-2xl font-bold'>Chapter Creation</h1>
              <span>Complete all fields {completionText}</span>
            </div>
          </div>
        </div>
        <ChapterActions
          disabled={!isComplete}
          courseId={courseId}
          chapterId={chapterId}
          isPublished={chapter.isPublished}
        />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
        {/* Left Section */}
        <div className='space-y-4'>
          <div>
            <div className='flex items-center'>
              <IconBadge icon={LayoutDashboard} />
              <h2 className='text-xl ml-2'>Customize your chapter</h2>
            </div>
            <ChapterTitleForm
              initialData={chapter}
              courseId={courseId}
              chapterId={chapterId}
            />
            <div>
              <ChapterDescriptionUpdate
                initialData={{ description: chapter.description || '' }}
                courseId={courseId}
                chapterId={chapterId}
              />
            </div>
          </div>
          <div className='flex items-center gap-x-2'>
            <IconBadge icon={Eye} />
            <h2 className='text-xl'>Access Settings</h2>
          </div>
          <ChapterAccessForm
            initialData={chapter}
            courseId={courseId}
            chapterId={chapterId}
          />
        </div>
        <div className='space-y-4'>
          <div className='flex items-center gap-x-2'>
            <IconBadge icon={Video} />
            <h2 className='text-xl'>Add a video</h2>
          </div>
          <div className='p-4 border border-gray-300 rounded-md bg-gray-50'>
            <p className='text-sm text-gray-600'>Video settings go here.</p>
            <ChapterVideo
              initialData={chapter}
              courseId={courseId}
              chapterId={chapterId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
