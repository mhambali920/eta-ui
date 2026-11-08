import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Kbd, Code, CodeBlock } from './index';

describe('Code, Kbd & CodeBlock', () => {
  it('renders Kbd and inline Code with semantic colors and variants', () => {
    render(
      <div>
        <Kbd size="sm">⌘</Kbd>
        <Kbd>K</Kbd>
        <Code variant="soft" color="primary">
          npm install @eta-ui/react
        </Code>
      </div>
    );

    expect(screen.getByText('⌘').tagName).toBe('KBD');
    expect(screen.getByText('npm install @eta-ui/react').tagName).toBe('CODE');
  });

  it('renders CodeBlock with filename, line numbers, and copy callback', () => {
    const onCopy = vi.fn();
    render(
      <CodeBlock
        filename="App.tsx"
        language="tsx"
        showLineNumbers
        onCopy={onCopy}
        code={`import { Button } from '@eta-ui/react';\nexport default () => <Button>Save</Button>;`}
      />
    );

    expect(screen.getByText('App.tsx')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    const copyBtn = screen.getByRole('button', { name: 'Copy code' });
    fireEvent.click(copyBtn);

    expect(onCopy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Copied')).toBeInTheDocument();
  });
});
