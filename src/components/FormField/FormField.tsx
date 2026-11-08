import React, { createContext, forwardRef, useContext, useId } from 'react';
import { cn } from '../../utils/cn';
import styles from './FormField.module.css';

export interface FormFieldContextValue {
  id: string;
  labelId: string;
  helperTextId: string;
  errorMessageId: string;
  isInvalid: boolean;
  isDisabled: boolean;
  isRequired: boolean;
  isReadOnly: boolean;
  hasHelperText: boolean;
  hasErrorMessage: boolean;
}

const FormFieldContext = createContext<FormFieldContextValue | undefined>(undefined);

export function useFormField() {
  return useContext(FormFieldContext);
}

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  isReadOnly?: boolean;
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  errorMessage?: React.ReactNode;
  optionalText?: React.ReactNode;
}

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  optionalText?: React.ReactNode;
  hideRequiredIndicator?: boolean;
}

export interface FormHelperTextProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export interface FormErrorMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  icon?: React.ReactNode;
  hideIcon?: boolean;
}

export const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ optionalText, hideRequiredIndicator = false, className, htmlFor, id, children, ...props }, ref) => {
    const field = useFormField();
    const resolvedHtmlFor = htmlFor ?? field?.id;
    const resolvedId = id ?? field?.labelId;

    return (
      <label
        ref={ref}
        id={resolvedId}
        htmlFor={resolvedHtmlFor}
        className={cn(styles.label, field?.isDisabled && styles.labelDisabled, className)}
        {...props}
      >
        <span>{children}</span>
        {field?.isRequired && !hideRequiredIndicator && (
          <span className={styles.requiredIndicator} aria-hidden="true">
            *
          </span>
        )}
        {!field?.isRequired && optionalText && (
          <span className={styles.optionalText}>{optionalText}</span>
        )}
      </label>
    );
  }
);
FormLabel.displayName = 'FormLabel';

export const FormHelperText = forwardRef<HTMLParagraphElement, FormHelperTextProps>(
  ({ className, id, children, ...props }, ref) => {
    const field = useFormField();
    const resolvedId = id ?? field?.helperTextId;

    return (
      <p ref={ref} id={resolvedId} className={cn(styles.helperText, className)} {...props}>
        {children}
      </p>
    );
  }
);
FormHelperText.displayName = 'FormHelperText';

export const FormErrorMessage = forwardRef<HTMLParagraphElement, FormErrorMessageProps>(
  ({ icon, hideIcon = false, className, id, children, ...props }, ref) => {
    const field = useFormField();
    if (field && !field.isInvalid) {
      return null;
    }

    const resolvedId = id ?? field?.errorMessageId;

    return (
      <p
        ref={ref}
        id={resolvedId}
        role="alert"
        aria-live="polite"
        className={cn(styles.errorMessage, className)}
        {...props}
      >
        {!hideIcon && (
          <span className={styles.errorIcon} aria-hidden="true">
            {icon ?? (
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="14"
                height="14"
              >
                <circle cx="8" cy="8" r="6.5" />
                <line x1="8" y1="5" x2="8" y2="8.5" />
                <circle cx="8" cy="11.25" r="0.5" fill="currentColor" />
              </svg>
            )}
          </span>
        )}
        <span>{children}</span>
      </p>
    );
  }
);
FormErrorMessage.displayName = 'FormErrorMessage';

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      id: idProp,
      isInvalid = false,
      isDisabled = false,
      isRequired = false,
      isReadOnly = false,
      label,
      helperText,
      errorMessage,
      optionalText,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = idProp ?? `eta-field-${generatedId}`;
    const labelId = `${id}-label`;
    const helperTextId = `${id}-helper`;
    const errorMessageId = `${id}-error`;

    const childArray = React.Children.toArray(children);

    const hasChildHelperText =
      Boolean(helperText) ||
      childArray.some(
        (child) => React.isValidElement(child) && child.type === FormHelperText
      );

    const hasChildErrorMessage =
      Boolean(errorMessage) ||
      childArray.some(
        (child) => React.isValidElement(child) && child.type === FormErrorMessage
      );

    const describedByIds: string[] = [];
    if (hasChildHelperText) describedByIds.push(helperTextId);
    if (isInvalid && hasChildErrorMessage) describedByIds.push(errorMessageId);
    const ariaDescribedBy = describedByIds.length > 0 ? describedByIds.join(' ') : undefined;

    const contextValue: FormFieldContextValue = {
      id,
      labelId,
      helperTextId,
      errorMessageId,
      isInvalid,
      isDisabled,
      isRequired,
      isReadOnly,
      hasHelperText: hasChildHelperText,
      hasErrorMessage: hasChildErrorMessage,
    };

    const enhancedChildren = React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;
      if (
        child.type === FormLabel ||
        child.type === FormHelperText ||
        child.type === FormErrorMessage
      ) {
        return child;
      }

      const childProps = child.props as Record<string, unknown>;
      const isNativeTag = typeof child.type === 'string';

      const injectedProps: Record<string, unknown> = {
        id: (childProps.id as string | undefined) ?? id,
        'aria-describedby':
          [childProps['aria-describedby'], ariaDescribedBy].filter(Boolean).join(' ') || undefined,
        'aria-invalid':
          (childProps['aria-invalid'] as boolean | undefined) ?? (isInvalid ? true : undefined),
        'aria-required':
          (childProps['aria-required'] as boolean | undefined) ?? (isRequired ? true : undefined),
      };

      if (isDisabled && childProps.disabled === undefined) {
        injectedProps.disabled = true;
      }
      if (isReadOnly && childProps.readOnly === undefined) {
        injectedProps.readOnly = true;
      }
      if (isRequired && childProps.required === undefined) {
        injectedProps.required = true;
      }
      if (!isNativeTag && isInvalid && childProps.isInvalid === undefined) {
        injectedProps.isInvalid = true;
      }

      return React.cloneElement(child, injectedProps);
    });

    return (
      <FormFieldContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(styles.field, isDisabled && styles.disabled, className)}
          data-invalid={isInvalid ? '' : undefined}
          data-disabled={isDisabled ? '' : undefined}
          data-readonly={isReadOnly ? '' : undefined}
          {...props}
        >
          {label && <FormLabel optionalText={optionalText}>{label}</FormLabel>}
          {enhancedChildren}
          {helperText && <FormHelperText>{helperText}</FormHelperText>}
          {errorMessage && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
        </div>
      </FormFieldContext.Provider>
    );
  }
);
FormField.displayName = 'FormField';
