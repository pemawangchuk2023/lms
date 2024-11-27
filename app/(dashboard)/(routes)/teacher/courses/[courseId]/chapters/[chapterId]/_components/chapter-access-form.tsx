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
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

interface ChapterAccessFormProps {
  initialData: {
    isFree: boolean;
  };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  isFree: z.boolean(),
});

const ChapterAccessForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterAccessFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFree: initialData?.isFree || false,
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const currentIsFree = form.watch('isFree');

  const toggleEdit = () => {
    setIsEditing((current) => !current);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast({
        variant: 'default',
        title: 'Access Updated!',
        description: `The chapter access has been successfully updated to ${
          values.isFree ? 'Free' : 'Paid'
        }.`,
      });
      router.refresh();
      setIsEditing(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was a problem updating the chapter access.',
      });
    }
  };

  return (
    <div className='mt-6 border border-gray-300 bg-white rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md'>
      <div className='flex items-center justify-between border-b border-gray-100 pb-4'>
        <div className='space-y-1'>
          <h3 className='text-[16px] font-bold text-gray-900'>
            Chapter Access Settings
          </h3>
          <p className='text-[16px] text-gray-900'>
            Toggle the chapter access to either Free or Paid.
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
              <span className='text-gray-600 text-[15px] font-bold'>
                Edit Access
              </span>
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p className='text-sm font-bold text-gray-600 mt-4 p-2 rounded-md bg-gray-100'>
          {currentIsFree ? 'This chapter is Free' : 'This chapter is Paid'}
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
              name='isFree'
              render={({ field }) => (
                <FormItem className='flex items-center gap-x-3'>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className='text-[16px]'>
                    {field.value ? 'Free' : 'Paid'}
                  </FormLabel>
                </FormItem>
              )}
            />
            <FormDescription className='text-[16px] text-gray-900'>
              Toggle this setting to control whether the chapter is free or part
              of the paid content.
            </FormDescription>
            <FormMessage />
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

export default ChapterAccessForm;
