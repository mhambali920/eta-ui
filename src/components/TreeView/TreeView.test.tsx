import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TreeView, TreeItem, type TreeItemData } from './TreeView';

describe('TreeView component', () => {
  it('renders declarative TreeItems and toggles expansion on click', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(
      <TreeView onSelect={handleSelect}>
        <TreeItem id="src" label="src">
          <TreeItem id="components" label="components">
            <TreeItem id="button" label="Button.tsx" />
          </TreeItem>
        </TreeItem>
        <TreeItem id="package" label="package.json" />
      </TreeView>
    );

    expect(screen.getByText('src')).toBeInTheDocument();
    expect(screen.getByText('package.json')).toBeInTheDocument();
    expect(screen.queryByText('components')).not.toBeInTheDocument();

    // Expand "src"
    await user.click(screen.getByText('src'));
    expect(handleSelect).toHaveBeenCalledWith('src');
    expect(screen.getByText('components')).toBeInTheDocument();

    // Expand "components"
    await user.click(screen.getByText('components'));
    expect(screen.getByText('Button.tsx')).toBeInTheDocument();

    // Select file
    await user.click(screen.getByText('Button.tsx'));
    expect(handleSelect).toHaveBeenCalledWith('button');
  });

  it('supports data-driven mode using data prop with defaultExpandedIds', () => {
    const items: TreeItemData[] = [
      {
        id: 'docs',
        label: 'Documents',
        children: [
          { id: 'resume', label: 'Resume.pdf' },
          { id: 'cover', label: 'CoverLetter.docx' },
        ],
      },
    ];

    render(<TreeView data={items} defaultExpandedIds={['docs']} />);

    expect(screen.getByText('Documents')).toBeInTheDocument();
    expect(screen.getByText('Resume.pdf')).toBeInTheDocument();
    expect(screen.getByText('CoverLetter.docx')).toBeInTheDocument();
  });

  it('supports keyboard navigation (ArrowRight expands, ArrowLeft collapses)', () => {
    render(
      <TreeView defaultExpandedIds={[]}>
        <TreeItem id="folder" label="Folder">
          <TreeItem id="file" label="File.txt" />
        </TreeItem>
      </TreeView>
    );

    const folderNode = screen.getByText('Folder').closest('div');
    expect(folderNode).toBeInTheDocument();
    expect(screen.queryByText('File.txt')).not.toBeInTheDocument();

    if (folderNode) {
      fireEvent.keyDown(folderNode, { key: 'ArrowRight' });
      expect(screen.getByText('File.txt')).toBeInTheDocument();

      fireEvent.keyDown(folderNode, { key: 'ArrowLeft' });
      expect(screen.queryByText('File.txt')).not.toBeInTheDocument();
    }
  });
});
