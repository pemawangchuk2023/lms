'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Pencil, PlusCircle, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import VideoUpload from '@/components/video-upload';

interface ChapterVideoProps {
  initialData: {
    videoUrl: string | null;
  };
  courseId: string;
  chapterId: string;
}

export default function ChapterVideo({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (videoUrl: string) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, {
        videoUrl,
      });
      toast({ title: 'Video updated' });
      toggleEdit();
      router.refresh();
    } catch {
      toast({ title: 'Something went wrong', variant: 'destructive' });
    }
  };

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Chapter video
        <Button
          onClick={toggleEdit}
          variant='ghost'
        >
          {isEditing && 'Cancel'}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className='h-4 w-4 mr-2' />
              Add a video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className='h-4 w-4 mr-2' />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
            <Video className='h-10 w-10 text-slate-500' />
          </div>
        ) : (
          <div className='relative aspect-video mt-2'>
            <video
              src={initialData.videoUrl}
              controls
              className='w-full h-full'
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <VideoUpload onChange={onSubmit} />
          <div className='text-xs text-muted-foreground mt-4'>
            Upload this chapter&apos;s video
          </div>
        </div>
      )}
    </div>
  );
}
