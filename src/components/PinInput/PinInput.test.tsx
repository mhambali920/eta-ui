import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PinInput, PinInputGroup, PinInputField, PinInputSeparator } from './index';

describe('PinInput', () => {
  it('renders the specified number of pin slots and auto-advances focus on entry', () => {
    const onChange = vi.fn();
    const onComplete = vi.fn();
    render(<PinInput length={4} onChange={onChange} onComplete={onComplete} />);

    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(4);

    fireEvent.change(inputs[0], { target: { value: '1' } });
    expect(inputs[1]).toHaveFocus();

    fireEvent.change(inputs[1], { target: { value: '2' } });
    fireEvent.change(inputs[2], { target: { value: '3' } });
    fireEvent.change(inputs[3], { target: { value: '4' } });

    expect(onChange).toHaveBeenLastCalledWith('1234');
    expect(onComplete).toHaveBeenCalledWith('1234');
  });

  it('rejects non-numeric characters in numeric mode and allows letters in alphanumeric mode', () => {
    const { rerender } = render(<PinInput length={3} type="numeric" />);
    const inputs = screen.getAllByRole('textbox');

    fireEvent.change(inputs[0], { target: { value: 'A' } });
    expect(inputs[0]).toHaveValue('');

    rerender(<PinInput length={3} type="alphanumeric" />);
    fireEvent.change(inputs[0], { target: { value: 'A' } });
    expect(inputs[0]).toHaveValue('A');
  });

  it('distributes pasted code across slots and calls onComplete', () => {
    const onComplete = vi.fn();
    render(<PinInput length={4} onComplete={onComplete} />);

    const inputs = screen.getAllByRole('textbox');
    fireEvent.paste(inputs[0], {
      clipboardData: {
        getData: () => '9876',
      },
    });

    expect(inputs[0]).toHaveValue('9');
    expect(inputs[1]).toHaveValue('8');
    expect(inputs[2]).toHaveValue('7');
    expect(inputs[3]).toHaveValue('6');
    expect(onComplete).toHaveBeenCalledWith('9876');
  });

  it('supports Backspace navigation, mask mode, and composable groups/separators', () => {
    render(
      <PinInput length={4} defaultValue="12" mask>
        <PinInputGroup>
          <PinInputField index={0} />
          <PinInputField index={1} />
        </PinInputGroup>
        <PinInputSeparator />
        <PinInputGroup>
          <PinInputField index={2} />
          <PinInputField index={3} />
        </PinInputGroup>
      </PinInput>
    );

    const field2 = screen.getByLabelText('Pin digit 2 of 4') as HTMLInputElement;
    const field3 = screen.getByLabelText('Pin digit 3 of 4') as HTMLInputElement;
    expect(field2.type).toBe('password');
    expect(screen.getByRole('separator')).toBeInTheDocument();

    fireEvent.keyDown(field3, { key: 'Backspace' });
    expect(field2).toHaveFocus();
    expect(field2.value).toBe('');
  });
});
