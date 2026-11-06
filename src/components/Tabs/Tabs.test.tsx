import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';

describe('Tabs component', () => {
  it('renders default tab and switches content on trigger click', async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Account Settings Content</TabsContent>
        <TabsContent value="password">Password Settings Content</TabsContent>
      </Tabs>
    );

    expect(screen.getByText('Account Settings Content')).toBeInTheDocument();
    expect(screen.queryByText('Password Settings Content')).not.toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Password' }));

    expect(screen.queryByText('Account Settings Content')).not.toBeInTheDocument();
    expect(screen.getByText('Password Settings Content')).toBeInTheDocument();
  });

  it('supports keyboard navigation between tabs', async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
        <TabsContent value="tab3">Content 3</TabsContent>
      </Tabs>
    );

    const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
    tab1.focus();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveFocus();
    expect(await screen.findByText('Content 2')).toBeInTheDocument();
  });

  it('renders variants and size classes correctly', () => {
    const { rerender } = render(
      <Tabs defaultValue="t1" variant="underline" size="sm" data-testid="tabs">
        <TabsList>
          <TabsTrigger value="t1">T1</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    let el = screen.getByTestId('tabs');
    expect(el.className).toContain('variant-underline');
    expect(el.className).toContain('size-sm');

    rerender(
      <Tabs defaultValue="t1" variant="outline" size="lg" data-testid="tabs">
        <TabsList>
          <TabsTrigger value="t1">T1</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    el = screen.getByTestId('tabs');
    expect(el.className).toContain('variant-outline');
    expect(el.className).toContain('size-lg');
  });

  it('respects disabled tab triggers', async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="disabled" disabled>
            Disabled
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active">Active View</TabsContent>
        <TabsContent value="disabled">Disabled View</TabsContent>
      </Tabs>
    );

    const disabledTab = screen.getByRole('tab', { name: 'Disabled' });
    await user.click(disabledTab);

    expect(screen.getByText('Active View')).toBeInTheDocument();
    expect(screen.queryByText('Disabled View')).not.toBeInTheDocument();
  });
});
