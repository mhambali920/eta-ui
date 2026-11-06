import React, { forwardRef, useRef, useState, useId } from 'react';
import { cn } from '../../utils/cn';
import styles from './FileDropzone.module.css';

export interface FileRejection {
  file: File;
  reason: 'exceeds-max-size' | 'exceeds-max-files' | 'invalid-type';
}

export interface FileDropzoneProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrop'> {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in bytes
  disabled?: boolean;
  isInvalid?: boolean;
  variant?: 'outline' | 'soft';
  onFilesSelected?: (files: File[]) => void;
  onFileReject?: (rejections: FileRejection[]) => void;
  name?: string;
}

export interface FileDropzoneIconProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface FileDropzoneTitleProps extends React.HTMLAttributes<HTMLParagraphElement> {}
export interface FileDropzoneDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export interface FileDropzoneFileListProps extends React.HTMLAttributes<HTMLUListElement> {}

export interface FileDropzoneFileItemProps extends React.HTMLAttributes<HTMLLIElement> {
  name: string;
  size?: number | string;
  onRemove?: () => void;
  removeLabel?: string;
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

const UploadCloudIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="M12 12v9" />
    <path d="m16 16-4-4-4 4" />
  </svg>
);

const FilePaperIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
  </svg>
);

const CloseXIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

function isTypeAccepted(file: File, accept?: string): boolean {
  if (!accept) return true;
  const acceptedTypes = accept.split(',').map((t) => t.trim().toLowerCase());
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  return acceptedTypes.some((type) => {
    if (type.startsWith('.')) {
      return fileName.endsWith(type);
    }
    if (type.endsWith('/*')) {
      const baseType = type.replace('/*', '');
      return fileType.startsWith(baseType);
    }
    return fileType === type;
  });
}

export const FileDropzone = forwardRef<HTMLDivElement, FileDropzoneProps>(
  (
    {
      className,
      accept,
      multiple = false,
      maxFiles,
      maxSize,
      disabled = false,
      isInvalid = false,
      variant = 'outline',
      onFilesSelected,
      onFileReject,
      name,
      children,
      onClick,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const inputId = useId();

    const handleFiles = (incomingFiles: FileList | File[]) => {
      if (disabled) return;
      const fileArray = Array.from(incomingFiles);
      const accepted: File[] = [];
      const rejected: FileRejection[] = [];

      fileArray.forEach((file) => {
        if (!isTypeAccepted(file, accept)) {
          rejected.push({ file, reason: 'invalid-type' });
          return;
        }
        if (maxSize && file.size > maxSize) {
          rejected.push({ file, reason: 'exceeds-max-size' });
          return;
        }
        if (maxFiles && accepted.length >= maxFiles) {
          rejected.push({ file, reason: 'exceeds-max-files' });
          return;
        }
        accepted.push(file);
      });

      if (rejected.length > 0 && onFileReject) {
        onFileReject(rejected);
      }
      if (accepted.length > 0 && onFilesSelected) {
        onFilesSelected(accepted);
      }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (disabled) return;
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    };

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(e);
      if (!disabled && inputRef.current) {
        inputRef.current.click();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
        e.preventDefault();
        inputRef.current?.click();
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files);
        // Reset input value so the same file can be picked again if needed
        e.target.value = '';
      }
    };

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled ? 'true' : undefined}
        aria-invalid={isInvalid ? 'true' : undefined}
        className={cn(
          styles.dropzone,
          styles[`variant-${variant}`],
          isDragging && styles.isDragging,
          isInvalid && styles.isInvalid,
          disabled && styles.disabled,
          className
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <input
          ref={inputRef}
          id={inputId}
          name={name}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          tabIndex={-1}
          className={styles.hiddenInput}
          onChange={handleInputChange}
        />
        {children || (
          <>
            <FileDropzoneIcon />
            <FileDropzoneTitle>Click to upload or drag and drop</FileDropzoneTitle>
            <FileDropzoneDescription>
              {accept ? `Supported formats: ${accept}` : 'Select files to upload'}
            </FileDropzoneDescription>
          </>
        )}
      </div>
    );
  }
);
FileDropzone.displayName = 'FileDropzone';

export const FileDropzoneIcon = forwardRef<HTMLDivElement, FileDropzoneIconProps>(
  ({ className, children = <UploadCloudIcon />, ...props }, ref) => (
    <div ref={ref} className={cn(styles.icon, className)} {...props}>
      {children}
    </div>
  )
);
FileDropzoneIcon.displayName = 'FileDropzoneIcon';

export const FileDropzoneTitle = forwardRef<HTMLParagraphElement, FileDropzoneTitleProps>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn(styles.title, className)} {...props} />
  )
);
FileDropzoneTitle.displayName = 'FileDropzoneTitle';

export const FileDropzoneDescription = forwardRef<
  HTMLParagraphElement,
  FileDropzoneDescriptionProps
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn(styles.description, className)} {...props} />
));
FileDropzoneDescription.displayName = 'FileDropzoneDescription';

export const FileDropzoneFileList = forwardRef<HTMLUListElement, FileDropzoneFileListProps>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn(styles.fileList, className)} {...props} />
  )
);
FileDropzoneFileList.displayName = 'FileDropzoneFileList';

export const FileDropzoneFileItem = forwardRef<HTMLLIElement, FileDropzoneFileItemProps>(
  (
    {
      className,
      name,
      size,
      onRemove,
      removeLabel = 'Remove file',
      children,
      ...props
    },
    ref
  ) => {
    const formattedSize =
      typeof size === 'number' ? formatBytes(size) : size;

    return (
      <li ref={ref} className={cn(styles.fileItem, className)} {...props}>
        {children || (
          <>
            <div className={styles.fileInfo}>
              <span className={styles.fileIcon}>
                <FilePaperIcon />
              </span>
              <span className={styles.fileName}>{name}</span>
              {formattedSize && (
                <span className={styles.fileSize}>({formattedSize})</span>
              )}
            </div>
            {onRemove && (
              <button
                type="button"
                aria-label={removeLabel}
                className={styles.removeBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
              >
                <CloseXIcon />
              </button>
            )}
          </>
        )}
      </li>
    );
  }
);
FileDropzoneFileItem.displayName = 'FileDropzoneFileItem';
