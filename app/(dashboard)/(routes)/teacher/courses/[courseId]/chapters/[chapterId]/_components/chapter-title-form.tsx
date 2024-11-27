'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Pencil } from 'lucide-react';
import { useState } from 'react';

interface ChapterTitleFormProps {
  initialData: {
    title: string;
  };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required.',
  }),
});

export const ChapterTitleForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterTitleFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(initialData.title);

  const toggleEdit = () => {
    setIsEditing((current) => !current);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: currentTitle },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      setCurrentTitle(values.title);

      toast({
        variant: 'default',
        title: 'Chapter Update!',
        description: 'The chapter has been successfully updated.',
      });

      setIsEditing(false);
      router.refresh();

      return response.data;
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem updating the chapter. Try again',
      });
    }
  };

  return (
    <div className='mt-6 border border-gray-300 bg-white rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md'>
      <div className='flex items-center justify-between border-b border-gray-400 pb-4'>
        <div className='space-y-1'>
          <h3 className='text-lg font-semibold text-gray-900'>Chapter Title</h3>
          <p className='text-sm font-bold text-gray-900'>
            Manage your chapter title
          </p>
        </div>
        <Button
          variant='ghost'
          onClick={toggleEdit}
          className='flex items-center gap-2 hover:bg-gray-100'
        >
          {isEditing ? (
            'Cancel'
          ) : (
            <>
              <Pencil className='h-4 w-4 text-gray-600' />
              <span className='text-gray-600 text-[15px] font-bold'>
                Edit Title
              </span>
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p className='text-[16px] text-gray-600 mt-4 p-2 font-bold capitalize bg-gray-200 '>
          {currentTitle}
        </p>
      )}

      {isEditing && (
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
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder='e.g. "Advanced Web Development"'
                      {...field}
                      className='focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    />
                  </FormControl>
                  <FormDescription className='text-[15px] text-gray-900'>
                    This is the chapter title for your course. It will be
                    displayed on your course page.
                  </FormDescription>
                  <FormMessage className='text-red-500' />
                </FormItem>
              )}
            />
            <div className='flex items-center gap-x-2 pt-2'>
              <Button
                disabled={!isValid || isSubmitting}
                type='submit'
                className='bg-blue-600 hover:bg-blue-700 text-white transition-colors'
              >
                {isSubmitting ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
