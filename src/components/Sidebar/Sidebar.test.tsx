import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
  SidebarMenuSub,
  SidebarTrigger,
  SidebarInset,
} from './Sidebar';

describe('Sidebar component', () => {
  it('renders sidebar layout structure with header, menu items, and footer', () => {
    render(
      <SidebarProvider defaultOpen={true}>
        <Sidebar>
          <SidebarHeader>
            <span>My Application</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Platform</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <span>User Profile</span>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div>Main content</div>
        </SidebarInset>
      </SidebarProvider>
    );

    expect(screen.getByText('My Application')).toBeInTheDocument();
    expect(screen.getByText('Platform')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('User Profile')).toBeInTheDocument();
    expect(screen.getByText('Main content')).toBeInTheDocument();
  });

  it('toggles sidebar state between expanded and collapsed when trigger is clicked', async () => {
    const user = userEvent.setup();

    render(
      <SidebarProvider defaultOpen={true}>
        <Sidebar data-testid="test-sidebar">
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Overview</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarTrigger data-testid="sidebar-toggle" />
      </SidebarProvider>
    );

    const sidebar = screen.getByTestId('test-sidebar');
    expect(sidebar).toHaveAttribute('data-state', 'expanded');

    const toggleBtn = screen.getByTestId('sidebar-toggle');
    await user.click(toggleBtn);

    expect(sidebar).toHaveAttribute('data-state', 'collapsed');

    await user.click(toggleBtn);
    expect(sidebar).toHaveAttribute('data-state', 'expanded');
  });

  it('supports asChild rendering for custom link elements', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive>
                  <a href="/analytics">Analytics Link</a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );

    const link = screen.getByRole('link', { name: 'Analytics Link' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/analytics');
    expect(link).toHaveAttribute('data-active', 'true');
  });

  it('reveals submenu flyout popover when clicked in collapsed mode', async () => {
    const user = userEvent.setup();

    render(
      <SidebarProvider defaultOpen={false}>
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <span>Settings</span>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  <li>
                    <a href="/general">General</a>
                  </li>
                  <li>
                    <a href="/team">Team</a>
                  </li>
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );

    expect(screen.queryByText('General')).not.toBeInTheDocument();

    const settingsBtn = screen.getByRole('button', { name: 'Settings' });
    await user.click(settingsBtn);

    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
  });
});
