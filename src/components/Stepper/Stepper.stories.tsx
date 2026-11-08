import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Stepper, Step } from './Stepper';

const meta: Meta<typeof Stepper> = {
  title: 'Components/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  argTypes: {
    activeStep: { control: { type: 'number', min: 0, max: 3 } },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

export const Default: Story = {
  args: {
    activeStep: 1,
    orientation: 'horizontal',
    size: 'md',
  },
  render: (args) => (
    <Stepper {...args}>
      <Step title="Account Setup" description="Verify your email" />
      <Step title="Workspace Details" description="Choose soft theme" />
      <Step title="Invite Team" description="Collaborate together" />
    </Stepper>
  ),
};

export const InteractiveWizard: Story = {
  render: () => {
    const [activeStep, setActiveStep] = useState(1);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Stepper activeStep={activeStep} onStepClick={setActiveStep}>
          <Step title="Cart" description="Review items" />
          <Step title="Shipping" description="Delivery address" />
          <Step title="Payment" description="Confirm order" />
        </Stepper>
      </div>
    );
  },
};

export const VerticalAndErrorState: Story = {
  render: () => (
    <div style={{ maxWidth: '340px' }}>
      <Stepper activeStep={1} orientation="vertical">
        <Step title="Build Artifacts" description="Compiled ESM & CJS bundles" />
        <Step title="Accessibility Audit" description="WCAG AA check failed on 1 item" status="error" />
        <Step title="Publish to NPM" description="Waiting for verification" />
      </Stepper>
    </div>
  ),
};
