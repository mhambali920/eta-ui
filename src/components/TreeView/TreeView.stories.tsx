import type { Meta, StoryObj } from '@storybook/react';
import { TreeView, TreeItem, type TreeItemData } from './TreeView';

const meta: Meta<typeof TreeView> = {
  title: 'Navigation/TreeView',
  component: TreeView,
  tags: ['autodocs'],
  argTypes: {
    defaultSelectedId: {
      control: 'text',
      description: 'Default selected node ID',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TreeView>;

const projectTreeData: TreeItemData[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'components',
        label: 'components',
        children: [
          { id: 'button', label: 'Button.tsx' },
          { id: 'card', label: 'Card.tsx' },
          { id: 'dialog', label: 'Dialog.tsx' },
        ],
      },
      {
        id: 'theme',
        label: 'theme',
        children: [
          { id: 'theme-provider', label: 'ThemeProvider.tsx' },
          { id: 'tokens', label: 'tokens.css' },
        ],
      },
      { id: 'index-ts', label: 'index.ts' },
    ],
  },
  {
    id: 'public',
    label: 'public',
    children: [
      { id: 'favicon', label: 'favicon.ico' },
      { id: 'robots', label: 'robots.txt' },
    ],
  },
  { id: 'package-json', label: 'package.json' },
  { id: 'tsconfig', label: 'tsconfig.json' },
  { id: 'readme', label: 'README.md' },
];

export const Default: Story = {
  args: {
    defaultExpandedIds: ['src', 'components'],
    defaultSelectedId: 'button',
    data: projectTreeData,
  },
  render: (args) => (
    <div
      style={{
        maxWidth: 320,
        padding: 16,
        borderRadius: 'var(--eta-radius-md)',
        border: '1px solid var(--eta-border-default)',
        backgroundColor: 'var(--eta-bg-surface)',
      }}
    >
      <TreeView {...args} />
    </div>
  ),
};

export const Declarative: Story = {
  render: () => (
    <div
      style={{
        maxWidth: 320,
        padding: 16,
        borderRadius: 'var(--eta-radius-md)',
        border: '1px solid var(--eta-border-default)',
        backgroundColor: 'var(--eta-bg-surface)',
      }}
    >
      <TreeView defaultExpandedIds={['workspace']}>
        <TreeItem id="workspace" label="Workspace">
          <TreeItem id="projects" label="Projects">
            <TreeItem id="p1" label="Design System" />
            <TreeItem id="p2" label="Mobile App" />
          </TreeItem>
          <TreeItem id="shared" label="Shared Assets" />
        </TreeItem>
        <TreeItem id="trash" label="Trash" />
      </TreeView>
    </div>
  ),
};
