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
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required.',
  }),
});

const Create = () => {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post('/api/courses', values);
      toast({
        variant: 'default',
        title: 'Course Created!',
        description: 'Your course has been successfully created.',
      });
      router.push(`/teacher/courses/${response.data.id}`);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description:
          'There was a problem with your request of creating course.',
      });
    }
  };

  return (
    <div className='max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6'>
      <div className='w-full max-w-md bg-white shadow-md rounded-lg border border-gray-100 p-6'>
        <h1 className='text-2xl font-semibold text-gray-800 mb-2 text-center'>
          Name your course
        </h1>
        <p className='text-sm text-gray-600 mb-6 text-center'>
          What would you like to name your course?
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6'
          >
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700 font-medium'>
                    Course Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Smart Contract'
                      {...field}
                      disabled={isSubmitting}
                      className='w-full transition-all duration-200 
                        focus:ring-2 focus:ring-blue-200 
                        focus:border-blue-500
                        disabled:opacity-50 disabled:cursor-not-allowed'
                    />
                  </FormControl>
                  <FormDescription className='text-xs text-gray-900 mt-1'>
                    What will you teach in this course?
                  </FormDescription>
                  <FormMessage className='text-red-500 text-xs mt-1' />
                </FormItem>
              )}
            />

            <div className='flex items-center space-x-4'>
              <Link
                href='/'
                className='w-full'
              >
                <Button
                  variant='outline'
                  type='button'
                  className='w-full text-gray-600 hover:bg-gray-50'
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type='submit'
                disabled={!isValid || isSubmitting}
                className='w-full bg-blue-500 text-white 
                  hover:bg-blue-700 
                  disabled:opacity-50 
                  disabled:cursor-not-allowed 
                  transition-colors duration-200'
              >
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Create;
