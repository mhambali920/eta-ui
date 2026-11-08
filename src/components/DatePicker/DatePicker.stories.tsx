import type { Meta, StoryObj } from '@storybook/react-vite';
import { DatePicker, DateRangePicker, Calendar } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  argTypes: {
    dateFormat: {
      control: 'select',
      options: ['medium', 'short', 'long', 'full', 'yyyy-mm-dd', 'dd/mm/yyyy', 'mm/dd/yyyy'],
      description: 'Preset display format for the selected date',
    },
    locale: {
      control: 'select',
      options: ['en-US', 'id-ID', 'en-GB', 'ja-JP', 'de-DE'],
      description: 'BCP 47 locale tag used by Intl.DateTimeFormat',
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['outline', 'filled'] },
    isClearable: { control: 'boolean' },
    isInvalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  args: {
    defaultValue: new Date(2026, 10, 8),
    placeholder: 'Pick a date...',
    dateFormat: 'medium',
    locale: 'en-US',
    size: 'md',
    variant: 'outline',
    isClearable: true,
  },
  render: (args) => (
    <div style={{ maxWidth: '280px', minHeight: '340px' }}>
      <DatePicker {...args} />
    </div>
  ),
};

export const DateFormats: Story = {
  render: () => {
    const sampleDate = new Date(2026, 10, 8);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '280px' }}>
        <DatePicker defaultValue={sampleDate} dateFormat="yyyy-mm-dd" aria-label="ISO format" />
        <DatePicker defaultValue={sampleDate} dateFormat="dd/mm/yyyy" aria-label="DD/MM/YYYY" />
        <DatePicker defaultValue={sampleDate} dateFormat="long" locale="id-ID" aria-label="Indonesian long" />
        <DatePicker defaultValue={sampleDate} dateFormat="full" locale="en-US" aria-label="Full format" />
      </div>
    );
  },
};

export const InlineCalendar: Story = {
  render: () => <Calendar defaultValue={new Date(2026, 10, 8)} />,
};

export const RangePicker: Story = {
  render: () => (
    <div style={{ maxWidth: '320px', minHeight: '340px' }}>
      <DateRangePicker
        defaultValue={{
          from: new Date(2026, 10, 8),
          to: new Date(2026, 10, 14),
        }}
        dateFormat="dd/mm/yyyy"
      />
    </div>
  ),
};
