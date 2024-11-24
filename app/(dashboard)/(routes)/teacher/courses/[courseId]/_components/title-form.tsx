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
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Pencil } from 'lucide-react';
import { useState } from 'react';

interface TitleFormProps {
  initialData: {
    title: string;
  };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required.',
  }),
});

export const TitleForm = ({ initialData, courseId }: TitleFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing((current) => !current);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast({
        variant: 'default',
        title: 'Course Edition!',
        description: 'Your course has been successfully created.',
      });
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description:
          'There was a problem with your request of editing a title.',
      });
    }
  };

  return (
    <div className='mt-6 border border-gray-300 bg-white rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md'>
      <div className='flex items-center justify-between border-b border-gray-400 pb-4'>
        <div className='space-y-1'>
          <h3 className='text-lg font-semibold text-gray-900'>Course Title</h3>
          <p className='text-sm  font-bold text-gray-900'>
            Manage your course title
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
          {initialData.title}
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
                    This is the title of your course. It will be displayed on
                    your course page.
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
