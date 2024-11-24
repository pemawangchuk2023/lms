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
  FormMessage,
} from '@/components/ui/form';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Attachement, Course } from '@prisma/client';
import { Plus, X, Link, Upload, Paperclip, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachement[] };
  courseId: string;
}

const formSchema = z.object({
  type: z.enum(['url', 'file']),
  url: z.string().url('Invalid URL format.').optional(),
  file: z.instanceof(File).optional(),
});

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'url',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let attachmentData;

      if (values.type === 'file' && values.file) {
        const formData = new FormData();
        formData.append('file', values.file);

        const response = await axios.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        attachmentData = { url: response.data.secure_url };
      } else if (values.type === 'url' && values.url) {
        attachmentData = { url: values.url };
      } else {
        throw new Error('Invalid attachment data.');
      }

      // Save the attachment to your backend
      await axios.post(`/api/courses/${courseId}/attachments`, attachmentData);

      toast({
        variant: 'destructive',
        title: 'Attachment Uploaded!',
        description: 'The attachment has been successfully added.',
      });

      router.refresh();
      toggleEdit();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an error uploading the attachment.',
      });
    }
  };
  const deleteAttachment = async (attachmentId: string) => {
    try {
      await axios.delete(`/api/courses/${courseId}/attachments`, {
        params: { attachmentId },
      });

      toast({
        variant: 'default',
        title: 'Attachment Deleted!',
        description: 'The attachment has been successfully removed.',
      });

      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete the attachment.',
      });
    }
  };

  return (
    <Card className='w-full'>
      <CardHeader className='p-6'>
        <div className='flex items-center justify-between'>
          <div className='space-y-1'>
            <h3 className='text-xl font-semibold tracking-tight'>
              Attachments
            </h3>
            <p className='text-sm text-gray-500'>
              Add files or links to supplement your course
            </p>
          </div>
          {!isEditing && (
            <Button
              onClick={toggleEdit}
              variant='outline'
              className='flex items-center gap-2 hover:bg-gray-50'
            >
              <Plus size={16} />
              Add Attachment
            </Button>
          )}
          {isEditing && (
            <Button
              onClick={toggleEdit}
              variant='ghost'
              size='icon'
              className='h-8 w-8'
            >
              <X size={16} />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className='px-6 pb-6'>
        {!isEditing && (
          <div className='space-y-3'>
            {initialData.attachments.length > 0 ? (
              initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className='flex items-center justify-between group rounded-lg border p-3 hover:bg-gray-50 transition-colors'
                >
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600'>
                      <Paperclip size={20} />
                    </div>
                    <div className='flex flex-col'>
                      <span className='text-sm font-medium truncate max-w-[300px]'>
                        {attachment.url.split('/').pop()}
                      </span>
                      <span className='text-xs text-gray-500 truncate max-w-[300px]'>
                        {attachment.url}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => deleteAttachment(attachment.id)}
                    variant='ghost'
                    size='icon'
                    className='opacity-100 group-hover:opacity-100 h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50'
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))
            ) : (
              <div className='flex flex-col items-center justify-center py-8 text-center'>
                <div className='h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4'>
                  <Paperclip className='h-6 w-6 text-gray-600' />
                </div>
                <h3 className='text-sm font-medium text-gray-900'>
                  No attachments
                </h3>
                <p className='text-sm text-gray-500 mt-1'>
                  Add your first attachment to this course
                </p>
              </div>
            )}
          </div>
        )}

        {isEditing && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex gap-4'>
                      <Button
                        type='button'
                        variant={field.value === 'url' ? 'default' : 'outline'}
                        className='flex-1 h-24'
                        onClick={() => field.onChange('url')}
                      >
                        <div className='flex flex-col items-center gap-2'>
                          <Link size={20} />
                          <span className='text-sm font-medium'>Add URL</span>
                        </div>
                      </Button>
                      <Button
                        type='button'
                        variant={field.value === 'file' ? 'default' : 'outline'}
                        className='flex-1 h-24'
                        onClick={() => field.onChange('file')}
                      >
                        <div className='flex flex-col items-center gap-2'>
                          <Upload size={20} />
                          <span className='text-sm font-medium'>
                            Upload File
                          </span>
                        </div>
                      </Button>
                    </div>
                  </FormItem>
                )}
              />

              {form.watch('type') === 'url' && (
                <FormField
                  control={form.control}
                  name='url'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder='Enter URL for your attachment...'
                          {...field}
                          className='h-12'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {form.watch('type') === 'file' && (
                <FormField
                  control={form.control}
                  name='file'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className='flex items-center justify-center w-full'>
                          <label className='flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50'>
                            <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                              <Upload className='w-8 h-8 mb-2 text-gray-500' />
                              <p className='mb-2 text-sm text-gray-500'>
                                <span className='font-semibold'>
                                  Click to upload
                                </span>{' '}
                                or drag and drop
                              </p>
                              <p className='text-xs text-gray-500'>
                                PDF, DOC, images up to 10MB
                              </p>
                            </div>
                            <Input
                              type='file'
                              className='hidden'
                              onChange={(e) =>
                                field.onChange(
                                  e.target.files ? e.target.files[0] : null
                                )
                              }
                            />
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className='flex justify-end gap-2 pt-4'>
                <Button
                  type='button'
                  variant='ghost'
                  onClick={toggleEdit}
                  className='h-10'
                >
                  Cancel
                </Button>
                <Button
                  disabled={!isValid || isSubmitting}
                  type='submit'
                  className='h-10'
                >
                  {isSubmitting ? 'Adding...' : 'Add attachment'}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default AttachmentForm;
