import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Tag, TagGroup } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Data Display/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['soft', 'solid', 'outline'] },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    shape: { control: 'select', options: ['rounded', 'pill'] },
    children: { control: 'text' },
    isClosable: { control: 'boolean' },
    isSelected: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: {
    children: 'Soft UI Kit',
    variant: 'soft',
    color: 'primary',
    size: 'md',
    shape: 'rounded',
    isClosable: true,
  },
};

export const RemovableTags: Story = {
  render: () => {
    const [tags, setTags] = useState(['React 19', 'TypeScript', 'Radix UI', 'WCAG AA']);
    return (
      <TagGroup>
        {tags.map((t) => (
          <Tag
            key={t}
            color="primary"
            isClosable
            onRemove={() => setTags((prev) => prev.filter((item) => item !== t))}
          >
            {t}
          </Tag>
        ))}
      </TagGroup>
    );
  },
};

export const SelectableFilterChips: Story = {
  render: () => {
    const categories = ['All', 'Components', 'Tokens', 'Accessibility', 'Themes'];
    const [selected, setSelected] = useState<string>('Components');
    return (
      <TagGroup>
        {categories.map((cat) => {
          const active = selected === cat;
          return (
            <Tag
              key={cat}
              shape="pill"
              variant={active ? 'solid' : 'soft'}
              color={active ? 'primary' : 'neutral'}
              isSelected={active}
              onClick={() => setSelected(cat)}
            >
              {cat}
            </Tag>
          );
        })}
      </TagGroup>
    );
  },
};
