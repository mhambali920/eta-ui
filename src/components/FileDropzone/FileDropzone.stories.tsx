import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  FileDropzone,
  FileDropzoneIcon,
  FileDropzoneTitle,
  FileDropzoneDescription,
  FileDropzoneFileList,
  FileDropzoneFileItem,
  type FileRejection,
} from './FileDropzone';

const meta: Meta<typeof FileDropzone> = {
  title: 'Forms/FileDropzone',
  component: FileDropzone,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['outline', 'soft'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
    isInvalid: {
      control: 'boolean',
    },
    multiple: {
      control: 'boolean',
    },
    accept: {
      control: 'text',
    },
    maxFiles: {
      control: 'number',
    },
    maxSize: {
      control: 'number',
    },
  },
};

export default meta;

type Story = StoryObj<typeof FileDropzone>;

export const Default: Story = {
  args: {
    variant: 'outline',
    size: 'md',
    disabled: false,
    isInvalid: false,
    multiple: true,
    accept: 'image/*,.pdf',
  },
  render: (args) => (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 24 }}>
      <FileDropzone {...args} />
    </div>
  ),
};

export const SoftVariant: Story = {
  args: {
    variant: 'soft',
    disabled: false,
    isInvalid: false,
    multiple: false,
    accept: 'image/png,image/jpeg',
  },
  render: (args) => (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 24 }}>
      <FileDropzone {...args} />
    </div>
  ),
};

export const CustomContent: Story = {
  args: {
    variant: 'outline',
    multiple: true,
  },
  render: (args) => (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 24 }}>
      <FileDropzone {...args}>
        <FileDropzoneIcon />
        <FileDropzoneTitle>Upload profile photo</FileDropzoneTitle>
        <FileDropzoneDescription>PNG, JPG, or WEBP up to 5MB</FileDropzoneDescription>
      </FileDropzone>
    </div>
  ),
};

export const InteractiveWithFileList: Story = {
  args: {
    variant: 'outline',
    multiple: true,
    maxSize: 1024 * 1024 * 5, // 5MB
  },
  render: (args) => {
    const DropzoneDemo = () => {
      const [files, setFiles] = useState<File[]>([]);
      const [errorMsg, setErrorMsg] = useState<string | null>(null);

      const handleFilesSelected = (newFiles: File[]) => {
        setErrorMsg(null);
        setFiles((prev) => [...prev, ...newFiles]);
      };

      const handleReject = (rejections: FileRejection[]) => {
        const reasons = rejections.map((r) => `${r.file.name}: ${r.reason}`).join(', ');
        setErrorMsg(`Rejected: ${reasons}`);
      };

      const handleRemove = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
      };

      return (
        <div style={{ maxWidth: 500, margin: '0 auto', padding: 24 }}>
          <FileDropzone
            {...args}
            onFilesSelected={handleFilesSelected}
            onFileReject={handleReject}
            isInvalid={Boolean(errorMsg)}
          />

          {errorMsg && (
            <p style={{ color: 'var(--eta-status-error-solid)', fontSize: '0.8125rem', marginTop: 8 }}>
              {errorMsg}
            </p>
          )}

          {files.length > 0 && (
            <FileDropzoneFileList>
              {files.map((file, idx) => (
                <FileDropzoneFileItem
                  key={`${file.name}-${idx}`}
                  name={file.name}
                  size={file.size}
                  onRemove={() => handleRemove(idx)}
                />
              ))}
            </FileDropzoneFileList>
          )}
        </div>
      );
    };

    return <DropzoneDemo />;
  },
};
