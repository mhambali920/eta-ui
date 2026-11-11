import type { Meta, StoryObj } from '@storybook/react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarTrigger,
  SidebarInset,
} from './Sidebar';

interface SidebarStoryProps {
  variant?: 'standard' | 'floating' | 'inset';
  collapsible?: 'icon' | 'offcanvas' | 'none';
  side?: 'left' | 'right';
  defaultOpen?: boolean;
}

const meta: Meta<SidebarStoryProps> = {
  title: 'Layout/Sidebar',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['standard', 'floating', 'inset'],
      description: 'Visual layout style of the sidebar',
    },
    collapsible: {
      control: 'select',
      options: ['icon', 'offcanvas', 'none'],
      description: 'How the sidebar collapses (icon rail or offcanvas hidden)',
    },
    side: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Which side of the screen the sidebar anchors to',
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state',
    },
  },
};

export default meta;
type Story = StoryObj<SidebarStoryProps>;

const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const InboxIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const Default: Story = {
  args: {
    variant: 'standard',
    collapsible: 'icon',
    side: 'left',
    defaultOpen: true,
  },
  render: (args) => (
    <div style={{ height: 500, display: 'flex', border: '1px solid var(--eta-border-default)', borderRadius: 'var(--eta-radius-lg)', overflow: 'hidden' }}>
      <SidebarProvider defaultOpen={args.defaultOpen}>
        <Sidebar
          variant={args.variant}
          collapsible={args.collapsible}
          side={args.side}
        >
          <SidebarHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--eta-radius-sm)',
                  backgroundColor: 'var(--eta-color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              >
                η
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Acme Studio</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--eta-text-muted)' }}>Pro Plan</div>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>
                      <HomeIcon />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <InboxIcon />
                      <span>Inbox</span>
                      <SidebarMenuBadge>12</SidebarMenuBadge>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <SettingsIcon />
                      <span>Settings</span>
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton isActive>General</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Team Members</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Billing & Invoices</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 'var(--eta-radius-full)',
                  backgroundColor: 'var(--eta-bg-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                JD
              </div>
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 500 }}>John Doe</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--eta-text-muted)' }}>john@example.com</div>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header
            style={{
              height: 52,
              borderBottom: '1px solid var(--eta-border-subtle)',
              display: 'flex',
              alignItems: 'center',
              padding: '0 16px',
              gap: 12,
              backgroundColor: 'var(--eta-bg-surface)',
            }}
          >
            <SidebarTrigger />
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Dashboard Overview</span>
          </header>
          <div style={{ padding: 24 }}>
            <h3 style={{ margin: '0 0 8px 0' }}>Welcome back, John!</h3>
            <p style={{ margin: 0, color: 'var(--eta-text-muted)', fontSize: '0.875rem' }}>
              Click the sidebar trigger button on the top left or use controls to collapse into icon mode.
            </p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  ),
};

export const Collapsed: Story = {
  ...Default,
  args: {
    ...Default.args,
    defaultOpen: false,
  },
};

export const CollapsedWithFlyoutSubmenu: Story = {
  render: () => (
    <div style={{ height: 450, display: 'flex', border: '1px solid var(--eta-border-default)', borderRadius: 'var(--eta-radius-lg)', overflow: 'hidden' }}>
      <SidebarProvider defaultOpen={false}>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--eta-radius-sm)',
                  backgroundColor: 'var(--eta-color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              >
                η
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <HomeIcon />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem defaultFlyoutOpen={true}>
                  <SidebarMenuButton isActive>
                    <SettingsIcon />
                    <span>Settings</span>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton isActive>General</SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton>Team Members</SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton>Billing & Invoices</SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset>
          <div style={{ padding: 24 }}>
            <h3 style={{ margin: '0 0 8px 0' }}>Submenu Flyout Demo</h3>
            <p style={{ margin: 0, color: 'var(--eta-text-muted)', fontSize: '0.875rem' }}>
              When collapsed, clicking any menu button with sub-items opens this floating flyout card.
            </p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  ),
};

