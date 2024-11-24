'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Course } from '@prisma/client';
import { Pencil, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import FileUpload from '@/components/file-upload';

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().url({
    message: 'A valid image URL is required.',
  }),
});
const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing((current) => !current);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: initialData?.imageUrl || '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast({
        variant: 'default',
        title: 'Image Updated!',
        description: 'The course image has been successfully updated.',
      });
      router.refresh();
      toggleEdit();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was an error updating the course image.',
      });
    }
  };

  return (
    <div className='mt-6 border border-gray-200 bg-white rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md'>
      <div className='flex items-center justify-between border-b border-gray-100 pb-4'>
        <div className='space-y-1'>
          <h3 className='text-lg font-semibold text-gray-900'>Course Image</h3>
          <p className='text-sm text-gray-500'>
            Add a compelling visual for your course
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
              {initialData.imageUrl ? (
                <Pencil className='h-4 w-4 text-gray-600' />
              ) : (
                <PlusCircle className='h-4 w-4 text-gray-600' />
              )}
              <span>{initialData.imageUrl ? 'Edit Image' : 'Add Image'}</span>
            </>
          )}
        </Button>
      </div>

      {isEditing ? (
        <div className='space-y-4 mt-6'>
          <div className='bg-gray-50 rounded-lg p-4'>
            <FileUpload
              onChange={(url) => {
                if (url) {
                  form.setValue('imageUrl', url, { shouldValidate: true });
                }
              }}
            />
            <p className='text-sm text-gray-500 mt-4'>
              Upload an image for your course. Accepted formats: JPG, PNG.
            </p>
          </div>
          <div className='flex items-center gap-x-2'>
            <Button
              disabled={!isValid || isSubmitting}
              onClick={form.handleSubmit(onSubmit)}
              className='bg-blue-600 hover:bg-blue-700 text-white transition-colors'
            >
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </div>
      ) : (
        <div className='mt-6'>
          {initialData.imageUrl ? (
            <div className='relative rounded-lg overflow-hidden bg-gray-50 border border-gray-200'>
              <div className='aspect-video relative'>
                <Image
                  src={initialData.imageUrl}
                  alt='Course image'
                  fill
                  className='object-cover'
                />
              </div>
            </div>
          ) : (
            <div className='flex items-center justify-center h-60 bg-gray-50 rounded-lg border border-dashed border-gray-300'>
              <p className='text-sm text-gray-500'>No image provided</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageForm;
