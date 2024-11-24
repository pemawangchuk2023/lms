'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Chapter, Course } from '@prisma/client';
import ChaptersList from '@/app/(dashboard)/_components/chapters-list';
import ConfirmationDialog from './confirmation-dialog';

interface ChaptersFormProps {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, 'Chapter title is required'),
});

type FormValues = z.infer<typeof formSchema>;

const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>(initialData.chapters);
  const [chapterToDelete, setChapterToDelete] = useState<Chapter | null>(null);

  const toggleCreating = () => {
    setIsCreating((current) => !current);
    if (isCreating) {
      setEditingChapter(null);
      form.reset();
    }
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: FormValues) => {
    try {
      if (editingChapter) {
        // Update existing chapter
        await axios.put(
          `/api/courses/${courseId}/chapters/${editingChapter.id}`,
          values
        );
        // Update the chapters state
        setChapters((prevChapters) =>
          prevChapters.map((chapter) =>
            chapter.id === editingChapter.id
              ? { ...chapter, ...values }
              : chapter
          )
        );
        toast({
          variant: 'default',
          title: 'Chapter updated!',
          description: 'The chapter has been successfully updated.',
        });
      } else {
        // Create new chapter
        const response = await axios.post(
          `/api/courses/${courseId}/chapters`,
          values
        );
        const newChapter = response.data;
        // Add new chapter to chapters state
        setChapters((prevChapters) => [...prevChapters, newChapter]);
        toast({
          variant: 'default',
          title: 'Chapter created!',
          description: 'A new chapter has been successfully added.',
        });
      }
      toggleCreating();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an error saving the chapter.',
      });
    }
  };

  const handleEdit = (chapterId: string) => {
    const chapter = chapters.find((c) => c.id === chapterId);
    if (chapter) {
      setEditingChapter(chapter);
      form.reset({ title: chapter.title });
      if (!isCreating) {
        setIsCreating(true);
      }
    }
  };

  const handleDelete = (chapterId: string) => {
    const chapter = chapters.find((c) => c.id === chapterId);
    if (chapter) {
      setChapterToDelete(chapter);
    }
  };

  const confirmDelete = async () => {
    if (chapterToDelete) {
      try {
        await axios.delete(
          `/api/courses/${courseId}/chapters/${chapterToDelete.id}`
        );
        // Remove the chapter from state
        setChapters((prevChapters) =>
          prevChapters.filter((chapter) => chapter.id !== chapterToDelete.id)
        );
        toast({
          variant: 'default',
          title: 'Chapter deleted!',
          description: 'The chapter has been successfully deleted.',
        });
        setChapterToDelete(null);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'There was an error deleting the chapter.',
        });
      }
    }
  };

  const cancelDelete = () => {
    setChapterToDelete(null);
  };

  const handleReorder = async (
    updateData: { id: string; position: number }[],
    updatedChapters: Chapter[]
  ) => {
    try {
      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        updates: updateData,
      });
      // Update the chapters state with new order
      setChapters(updatedChapters);
      toast({
        variant: 'default',
        title: 'Chapters reordered!',
        description: 'The chapters have been successfully reordered.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an error reordering the chapters.',
      });
    }
  };

  return (
    <>
      <div className='mt-6 border border-gray-300 bg-white rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md'>
        <div className='flex items-center justify-between border-b border-gray-100 pb-4'>
          <div className='space-y-1'>
            <h3 className='text-[16px] font-bold text-gray-900'>Chapters</h3>
            <p className='text-[14px] text-gray-700'>
              Manage the chapters for your course.
            </p>
          </div>
          <Button
            variant='ghost'
            onClick={toggleCreating}
            className='flex items-center gap-2 hover:bg-gray-100'
          >
            {isCreating ? (
              'Cancel'
            ) : (
              <>
                <PlusCircle className='h-4 w-4 text-gray-600' />
                <span className='text-gray-600 text-[15px] font-bold'>
                  Add Chapter
                </span>
              </>
            )}
          </Button>
        </div>

        {!isCreating && (
          <ChaptersList
            onEdit={handleEdit}
            onDelete={handleDelete}
            onReorder={handleReorder}
            items={chapters}
          />
        )}

        {isCreating && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 mt-4'
            >
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <FormLabel className='text-sm font-medium text-gray-700'>
                      Chapter Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder='Enter chapter title'
                        {...field}
                        className='focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex items-center gap-x-2 pt-2'>
                <Button
                  disabled={!isValid || isSubmitting}
                  type='submit'
                  className='bg-blue-600 hover:bg-blue-700 text-white transition-colors'
                >
                  {isSubmitting
                    ? editingChapter
                      ? 'Updating...'
                      : 'Adding...'
                    : editingChapter
                    ? 'Update Chapter'
                    : 'Add Chapter'}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>

      {chapterToDelete && (
        <ConfirmationDialog
          title='Delete Chapter'
          description={`Are you sure you want to delete the chapter "${chapterToDelete.title}"? This action cannot be undone.`}
          confirmLabel='Delete'
          cancelLabel='Cancel'
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          isOpen={!!chapterToDelete}
        />
      )}
    </>
  );
};

export default ChaptersForm;
