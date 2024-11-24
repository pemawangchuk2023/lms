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
import { DollarSign } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Course } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/format';
import Image from 'next/image';

interface PriceFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  price: z.coerce.number(),
});

const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing((current) => !current);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData?.price || 0,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast({
        variant: 'destructive',
        title: 'Price Updated!',
        description: 'The price for the course has been successfully updated.',
      });
      router.refresh();
      toggleEdit();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was an error updating the course price.',
      });
    }
  };

  return (
    <div className='mt-6 border border-gray-300 bg-white rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md'>
      <div className='flex items-center justify-between border-b border-gray-100 pb-4'>
        <div className='space-y-1'>
          <h3 className='text-[16px] font-bold text-gray-900'>Price Detail</h3>
          <p className='text-[16px] text-gray-900'>
            Update the price for this course
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
              <Image
                src='/assets/dollar.svg'
                alt='dollar'
                width={25}
                height={25}
              />
              <span className='text-gray-600 text-[15px] font-bold'>
                Set Price
              </span>
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p
          className={cn(
            'text-sm font-bold text-gray-600 mt-4 p-2 rounded-md bg-gray-100',
            !initialData.price && 'italic text-gray-400'
          )}
        >
          {initialData.price ? formatPrice(initialData.price) : 'No price set'}
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
              name='price'
              render={({ field }) => (
                <FormItem className='space-y-2'>
                  <FormControl>
                    <Input
                      type='number'
                      step='0.01'
                      disabled={isSubmitting}
                      placeholder='Set a price of your course...'
                      {...field}
                      className='min-h-[15px] resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    />
                  </FormControl>
                  <FormDescription className='text-[16px] text-gray-900'>
                    This is the price of your course. If you don&apos;t set a
                    price, the course will be free.
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

export default PriceForm;
