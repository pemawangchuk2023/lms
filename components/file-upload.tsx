'use client';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Input } from './ui/input';

interface FileUploadProps {
  onChange: (url: string) => void;
}

const FileUpload = ({ onChange }: FileUploadProps) => {
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
      const response = await axios.post('/api/upload', formData);
      onChange(response.data.secure_url);
      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image',
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
        accept='image/*'
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
            Upload Image
          </>
        )}
      </Button>
    </div>
  );
};

export default FileUpload;
