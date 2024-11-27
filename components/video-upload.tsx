'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Input } from './ui/input';

interface VideoUploadProps {
  onChange: (url: string) => void;
}

const VideoUpload = ({ onChange }: VideoUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Uploading file to /api/upload');
      const response = await axios.post('/api/upload', formData);
      console.log('Upload response:', response.data);
      onChange(response.data.secure_url);
      toast({
        title: 'Success',
        description: 'Video uploaded successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload video',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <Input
        type='file'
        accept='video/*'
        onChange={handleFileChange}
        style={{ display: 'none' }}
        ref={fileInputRef}
        disabled={isUploading}
      />
      <Button
        onClick={handleButtonClick}
        disabled={isUploading}
      >
        {isUploading ? (
          <>
            <Loader2 className='h-4 w-4 mr-2 animate-spin' />
            Uploading...
          </>
        ) : (
          <>
            <Upload className='h-4 w-4 mr-2' />
            Upload Video
          </>
        )}
      </Button>
    </div>
  );
};

export default VideoUpload;
