import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Combobox } from './index';

const FRAMEWORKS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'SolidJS', disabled: true },
];

describe('Combobox', () => {
  it('opens listbox on focus, filters options by search query, and selects an option', () => {
    const onChange = vi.fn();
    render(
      <Combobox
        options={FRAMEWORKS}
        placeholder="Select framework"
        onChange={onChange}
        aria-label="Framework"
      />
    );

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(4);

    fireEvent.change(input, { target: { value: 'sve' } });
    const filtered = screen.getAllByRole('option');
    expect(filtered).toHaveLength(1);
    expect(filtered[0]).toHaveTextContent('Svelte');

    fireEvent.click(filtered[0]);
    expect(onChange).toHaveBeenCalledWith('svelte');
    expect(input).toHaveValue('Svelte');
  });

  it('shows empty state message when no options match the query', () => {
    render(
      <Combobox
        options={FRAMEWORKS}
        emptyMessage="No framework found."
        aria-label="Search frameworks"
      />
    );

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'angular' } });

    expect(screen.getByText('No framework found.')).toBeInTheDocument();
  });

  it('supports keyboard ArrowDown,Enter selection and Escape dismissal', () => {
    const onChange = vi.fn();
    render(<Combobox options={FRAMEWORKS} onChange={onChange} aria-label="Keyboard combobox" />);

    const input = screen.getByRole('combobox');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onChange).toHaveBeenCalledWith('vue');
  });

  it('supports multiple selection mode with removable chips and clear button', () => {
    const onChange = vi.fn();
    render(
      <Combobox
        options={FRAMEWORKS}
        multiple
        defaultValue={['react', 'vue']}
        onChange={onChange}
        aria-label="Multi frameworks"
      />
    );

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Vue')).toBeInTheDocument();

    const removeReactBtn = screen.getByRole('button', { name: 'Remove React' });
    fireEvent.click(removeReactBtn);
    expect(onChange).toHaveBeenCalledWith(['vue']);

    const clearBtn = screen.getByRole('button', { name: 'Clear selection' });
    fireEvent.click(clearBtn);
    expect(onChange).toHaveBeenCalledWith([]);
  });
});
