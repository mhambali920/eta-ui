import React, { useEffect } from 'react';
import type { Preview } from '@storybook/react-vite';
import '../src/styles/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      options: {
        "soft-light": { name: 'soft-light', value: '#FAF9F6' },
        "soft-dark": { name: 'soft-dark', value: '#181A20' }
      }
    },
    a11y: {
      config: {},
      options: {
        checks: { 'color-contrast': { options: { noScroll: true } } },
        restoreScroll: true,
      },
    },
  },

  globalTypes: {
    theme: {
      description: 'Global theme mode for eta-ui components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light Mode (#FAF9F6)' },
          { value: 'dark', icon: 'moon', title: 'Dark Mode (#181A20)' },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light';

      useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }, [theme]);

      return (
        <div
          style={{
            minHeight: '120px',
            padding: '2rem',
            backgroundColor: 'var(--eta-bg-base)',
            color: 'var(--eta-text-body)',
            fontFamily: 'inherit',
            transition: 'background-color 200ms ease, color 200ms ease',
          }}
        >
          <Story />
        </div>
      );
    },
  ],

  initialGlobals: {
    backgrounds: {
      value: 'soft-light'
    }
  },

  tags: ['autodocs']
};

export default preview;
