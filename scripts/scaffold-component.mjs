import fs from 'fs';
import path from 'path';

const componentName = process.argv[2];

if (!componentName) {
  console.error('Usage: node scripts/scaffold-component.mjs <ComponentName>');
  process.exit(1);
}

const componentDir = path.resolve('src/components', componentName);

if (fs.existsSync(componentDir)) {
  console.error(`Error: Component ${componentName} already exists at ${componentDir}`);
  process.exit(1);
}

fs.mkdirSync(componentDir, { recursive: true });

// 1. Component.tsx
const componentTsx = `import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import styles from './${componentName}.module.css';

export interface ${componentName}Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const ${componentName} = forwardRef<HTMLDivElement, ${componentName}Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(styles.${componentName.toLowerCase()}, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

${componentName}.displayName = '${componentName}';
`;

// 2. Component.module.css
const componentCss = `.${componentName.toLowerCase()} {
  box-sizing: border-box;
  font-family: inherit;
  color: var(--eta-text-body);
}
`;

// 3. Component.test.tsx
const componentTest = `import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ${componentName} } from './index';

describe('${componentName}', () => {
  it('renders children correctly', () => {
    render(<${componentName}>Hello ${componentName}</${componentName}>);
    expect(screen.getByText('Hello ${componentName}')).toBeInTheDocument();
  });
});
`;

// 4. Component.stories.tsx
const componentStories = `import type { Meta, StoryObj } from '@storybook/react';
import { ${componentName} } from './${componentName}';

const meta: Meta<typeof ${componentName}> = {
  title: 'Components/${componentName}',
  component: ${componentName},
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ${componentName}>;

export const Default: Story = {
  args: {
    children: '${componentName} Content',
  },
};
`;

// 5. index.ts
const indexTs = `export { ${componentName}, type ${componentName}Props } from './${componentName}';\n`;

fs.writeFileSync(path.join(componentDir, `${componentName}.tsx`), componentTsx);
fs.writeFileSync(path.join(componentDir, `${componentName}.module.css`), componentCss);
fs.writeFileSync(path.join(componentDir, `${componentName}.test.tsx`), componentTest);
fs.writeFileSync(path.join(componentDir, `${componentName}.stories.tsx`), componentStories);
fs.writeFileSync(path.join(componentDir, 'index.ts'), indexTs);

console.log(`✅ Scaffolded new component ${componentName} in ${componentDir}`);
console.log(`Don't forget to export it in src/index.ts!`);
