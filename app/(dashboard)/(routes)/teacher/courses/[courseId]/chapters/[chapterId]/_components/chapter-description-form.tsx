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
import { Pencil } from 'lucide-react';
import { useState, useRef } from 'react';
import { MDXEditorMethods } from '@mdxeditor/editor';
import Editor from '@/components/editor';

interface ChapterDescriptionFormProps {
  initialData: {
    description: string;
  };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  description: z.string().min(1),
});

const ChapterDescriptionUpdate = ({
  initialData,
  courseId,
  chapterId,
}: ChapterDescriptionFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef<MDXEditorMethods | null>(null);

  const toggleEdit = () => {
    setIsEditing((current) => !current);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast({
        variant: 'default',
        title: 'Description Updated!',
        description: 'The chapter description has been successfully updated.',
      });
      router.refresh();
      toggleEdit();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was an error updating the chapter description.',
      });
    }
  };

  return (
    <div className='mt-6 border border-gray-300 bg-white rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md'>
      <div className='flex items-center justify-between border-b border-gray-100 pb-4'>
        <div className='space-y-1'>
          <h3 className='text-[16px] font-bold text-gray-900'>
            Chapter Description
          </h3>
          <p className='text-[16px] text-gray-900'>
            Create a compelling chapter description
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
                Edit Chapter Description
              </span>
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p className='text-sm font-bold text-gray-600 mt-4 p-2 rounded-md bg-gray-100'>
          {initialData.description || 'No description provided'}
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
              name='description'
              render={({ field }) => (
                <FormItem className='space-y-2'>
                  <FormControl>
                    <Editor
                      value={field.value}
                      editorRef={editorRef}
                      fieldChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription className='text-[16px] text-gray-900'>
                    This is the detailed description of your chapter. It helps
                    students understand what the chapter is about.
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

export default ChapterDescriptionUpdate;
