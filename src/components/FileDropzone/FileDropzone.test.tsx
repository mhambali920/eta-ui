import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  FileDropzone,
  FileDropzoneFileList,
  FileDropzoneFileItem,
  formatBytes,
} from './FileDropzone';

describe('FileDropzone component', () => {
  it('renders default dropzone structure with accessible button role', () => {
    render(<FileDropzone />);

    const dropzone = screen.getByRole('button', { name: /click to upload or drag and drop/i });
    expect(dropzone).toBeInTheDocument();
    expect(screen.getByText('Click to upload or drag and drop')).toBeInTheDocument();
  });

  it('handles file selection via change event', () => {
    const onFilesSelected = vi.fn();
    const { container } = render(<FileDropzone onFilesSelected={onFilesSelected} />);

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['hello world'], 'document.pdf', { type: 'application/pdf' });

    fireEvent.change(input, { target: { files: [file] } });

    expect(onFilesSelected).toHaveBeenCalledTimes(1);
    expect(onFilesSelected).toHaveBeenCalledWith([file]);
  });

  it('handles dragover, dragleave, and drop events', () => {
    const onFilesSelected = vi.fn();
    render(<FileDropzone onFilesSelected={onFilesSelected} data-testid="dropzone" />);

    const dropzone = screen.getByTestId('dropzone');
    const file = new File(['content'], 'sample.png', { type: 'image/png' });

    fireEvent.dragOver(dropzone);
    expect(dropzone.className).toContain('isDragging');

    fireEvent.dragLeave(dropzone);
    expect(dropzone.className).not.toContain('isDragging');

    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file],
      },
    });

    expect(onFilesSelected).toHaveBeenCalledWith([file]);
    expect(dropzone.className).not.toContain('isDragging');
  });

  it('filters rejected files when exceeding maxSize', () => {
    const onFilesSelected = vi.fn();
    const onFileReject = vi.fn();

    const { container } = render(
      <FileDropzone
        maxSize={10} // 10 bytes
        onFilesSelected={onFilesSelected}
        onFileReject={onFileReject}
      />
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const largeFile = new File(['this is longer than 10 bytes'], 'large.txt', {
      type: 'text/plain',
    });

    fireEvent.change(input, { target: { files: [largeFile] } });

    expect(onFilesSelected).not.toHaveBeenCalled();
    expect(onFileReject).toHaveBeenCalledTimes(1);
    expect(onFileReject).toHaveBeenCalledWith([
      { file: largeFile, reason: 'exceeds-max-size' },
    ]);
  });

  it('renders FileDropzoneFileList and FileDropzoneFileItem with remove button', async () => {
    const user = userEvent.setup();
    const handleRemove = vi.fn();

    render(
      <FileDropzoneFileList>
        <FileDropzoneFileItem
          name="invoice.pdf"
          size={1024 * 500}
          onRemove={handleRemove}
        />
      </FileDropzoneFileList>
    );

    expect(screen.getByText('invoice.pdf')).toBeInTheDocument();
    expect(screen.getByText('(500 KB)')).toBeInTheDocument();

    const removeBtn = screen.getByRole('button', { name: 'Remove file' });
    await user.click(removeBtn);
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it('formats bytes correctly using formatBytes helper', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1024 * 1024 * 2.5)).toBe('2.5 MB');
  });

  it('applies invalid and disabled styling and attributes', () => {
    render(<FileDropzone disabled isInvalid data-testid="dropzone" />);

    const dropzone = screen.getByTestId('dropzone');
    expect(dropzone).toHaveAttribute('aria-disabled', 'true');
    expect(dropzone).toHaveAttribute('aria-invalid', 'true');
    expect(dropzone.className).toContain('disabled');
    expect(dropzone.className).toContain('isInvalid');
  });
});
