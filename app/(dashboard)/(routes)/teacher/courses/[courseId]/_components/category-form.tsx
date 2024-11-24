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
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Course } from '@prisma/client';
import Combobox from '@/components/ui/combobox';
import { Check } from 'lucide-react';

interface CategoryFormProps {
  initialData: Course;
  courseId: string;
  options: { label: string; value: string }[];
}

const formSchema = z.object({
  categoryId: z.string().min(1),
});

const CategoryForm = ({
  initialData,
  courseId,
  options,
}: CategoryFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSelecting, setIsSelecting] = useState(false);

  const toggleSelect = () => {
    setIsSelecting((current) => !current);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData?.categoryId || '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast({
        variant: 'destructive',
        title: 'Description Updated!',
        description: 'The course description has been successfully updated.',
      });
      router.refresh();
      toggleSelect();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was an error updating the course description.',
      });
    }
  };
  const selectedOption = options.find(
    (option) => option.value === initialData.categoryId
  );

  return (
    <div className='mt-6 border border-gray-200 bg-white rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md'>
      <div className='flex items-center justify-between border-b border-gray-100 pb-4'>
        <div className='space-y-1'>
          <h3 className='text-lg font-semibold text-gray-900'>
            Course Category
          </h3>
          <p className='text-sm text-gray-500'>
            Choose a category for your course
          </p>
        </div>
        <Button
          variant='ghost'
          onClick={toggleSelect}
          className='flex items-center gap-2 hover:bg-gray-100'
        >
          {isSelecting ? (
            'Cancel'
          ) : (
            <>
              <Check className='h-4 w-4 text-gray-600' />
              <span>Select Category</span>
            </>
          )}
        </Button>
      </div>

      {!isSelecting && (
        <div className='mt-4'>
          <div
            className={cn(
              'inline-flex items-center px-3 py-1.5 rounded-full text-sm',
              selectedOption
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-gray-100 text-gray-500 italic'
            )}
          >
            <div className='text-red-500'>
              {selectedOption?.label || 'No category'}
            </div>
          </div>
        </div>
      )}

      {isSelecting && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 mt-4'
          >
            <FormField
              control={form.control}
              name='categoryId'
              render={({ field }) => (
                <FormItem className='space-y-2'>
                  <FormControl>
                    <Combobox
                      options={options}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className='text-[16px] text-gray-900'>
                    Select the most appropriate category for your course. This
                    helps students find your course more easily.
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
export default CategoryForm;
