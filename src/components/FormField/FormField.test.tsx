import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormField, FormLabel, FormHelperText, FormErrorMessage } from './index';
import { Input } from '../Input';

describe('FormField', () => {
  it('links FormLabel, Input, and FormHelperText via accessible IDs', () => {
    render(
      <FormField id="username">
        <FormLabel>Username</FormLabel>
        <Input placeholder="Enter username" />
        <FormHelperText>Choose a unique handle.</FormHelperText>
      </FormField>
    );

    const input = screen.getByLabelText('Username');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'username');
    expect(input).toHaveAttribute('aria-describedby', 'username-helper');
    expect(screen.getByText('Choose a unique handle.')).toHaveAttribute('id', 'username-helper');
  });

  it('displays required asterisk and sets aria-required when isRequired is true', () => {
    render(
      <FormField id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input type="email" />
      </FormField>
    );

    const input = screen.getByLabelText(/Email/);
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(input).toBeRequired();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('shows FormErrorMessage only when isInvalid is true and binds aria-invalid', () => {
    const { rerender } = render(
      <FormField id="password" isInvalid={false}>
        <FormLabel>Password</FormLabel>
        <Input type="password" />
        <FormErrorMessage>Password is too short.</FormErrorMessage>
      </FormField>
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    rerender(
      <FormField id="password" isInvalid={true}>
        <FormLabel>Password</FormLabel>
        <Input type="password" />
        <FormErrorMessage>Password is too short.</FormErrorMessage>
      </FormField>
    );

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Password is too short.');
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'password-error');
  });

  it('supports shorthand label, helperText, errorMessage, and propagates isDisabled', () => {
    render(
      <FormField
        id="bio"
        label="Biography"
        optionalText="(Optional)"
        helperText="Max 160 characters."
        errorMessage="Biography contains restricted words."
        isInvalid
        isDisabled
      >
        <Input />
      </FormField>
    );

    const input = screen.getByLabelText(/Biography/);
    expect(input).toBeDisabled();
    expect(screen.getByText('(Optional)')).toBeInTheDocument();
    expect(screen.getByText('Max 160 characters.')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Biography contains restricted words.');
  });
});
