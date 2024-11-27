'use client';

import ConfirmModal from '@/components/modal/confirm-modal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface ActionsProps {
  courseId: string;
  disabled: boolean;
  isPublished: boolean;
}

const Actions = ({ courseId, disabled, isPublished }: ActionsProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      const endpoint = isPublished
        ? `/api/courses/${courseId}/unpublish`
        : `/api/courses/${courseId}/publish`;
      await axios.patch(endpoint);
      toast({
        variant: 'default',
        title: isPublished ? 'Unpublished' : 'Published',
        description: `The course has been ${
          isPublished ? 'unpublished' : 'published'
        }`,
      });
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/courses/${courseId}`);
      toast({
        variant: 'destructive',
        title: 'Course deleted',
        description: 'The course has been deleted',
      });
      router.refresh();
      router.push(`/teacher/courses`);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center gap-x-2'>
      <Button
        onClick={onClick}
        variant='outline'
        size='sm'
        disabled={isLoading}
      >
        {isPublished ? 'Unpublish' : 'Publish'}
      </Button>
      <Button
        size='sm'
        variant='destructive'
      >
        <ConfirmModal
          onConfirm={onDelete}
          disabled={isLoading}
        >
          <Trash className='h-4 w-4' />
        </ConfirmModal>
      </Button>
    </div>
  );
};

export default Actions;
