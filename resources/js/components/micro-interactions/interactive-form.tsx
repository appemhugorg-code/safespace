/**
 * Interactive Form Component
 * 
 * Enhanced form with therapeutic validation animations and micro-interactions
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/theme-context';
import { createTransition } from '@/config/animations';
import InteractiveInput from './interactive-input';
import InteractiveButton from './interactive-button';

interface FormField {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'textarea';
  placeholder?: string;
  required?: boolean;
  validation?: (value: string) => string | null;
  helperText?: string;
  icon?: React.ReactNode;
}

interface InteractiveFormProps {
  /** Form fields configuration */
  fields: FormField[];
  /** Form title */
  title?: string;
  /** Form description */
  description?: string;
  /** Submit button text */
  submitText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Whether form is loading */
  loading?: boolean;
  /** Success message */
  successMessage?: string;
  /** Error message */
  errorMessage?: string;
  /** Form submission handler */
  onSubmit?: (data: Record<string, string>) => void | Promise<void>;
  /** Cancel handler */
  onCancel?: () => void;
  /** Form validation animation */
  validationAnimation?: 'shake' | 'bounce' | 'pulse' | 'none';
  /** Success animation */
  successAnimation?: 'confetti' | 'checkmark' | 'fade' | 'none';
  /** Form layout */
  layout?: 'vertical' | 'horizontal' | 'grid';
  /** Grid columns (for grid layout) */
  gridColumns?: number;
  /** Form spacing */
  spacing?: 'compact' | 'normal' | 'relaxed';
}

export const InteractiveForm: React.FC<InteractiveFormProps> = ({
  fields,
  title,
  description,
  submitText = 'Submit',
  cancelText = 'Cancel',
  loading = false,
  successMessage,
  errorMessage,
  onSubmit,
  onCancel,
  validationAnimation = 'shake',
  successAnimation = 'checkmark',
  layout = 'vertical',
  gridColumns = 2,
  spacing = 'normal',
}) => {
  const { theme } = useTheme();
  const reducedMotion = theme.animations?.reducedMotion ?? false;
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Spacing configurations
  const spacingClasses = {
    compact: 'space-y-3',
    normal: 'space-y-4',
    relaxed: 'space-y-6',
  };

  // Layout configurations
  const getLayoutClasses = () => {
    switch (layout) {
      case 'horizontal':
        return 'flex flex-wrap gap-4';
      case 'grid':
        return `grid grid-cols-1 md:grid-cols-${gridColumns} gap-4`;
      default:
        return spacingClasses[spacing];
    }
  };

  // Handle input change
  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle input blur
  const handleInputBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name] || '');
  };

  // Validate single field
  const validateField = (name: string, value: string) => {
    const field = fields.find(f => f.name === name);
    if (!field) return;

    let error = '';

    // Required validation
    if (field.required && !value.trim()) {
      error = `${field.label} is required`;
    }

    // Custom validation
    if (!error && field.validation && value.trim()) {
      const validationError = field.validation(value);
      if (validationError) {
        error = validationError;
      }
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    fields.forEach(field => {
      const value = formData[field.name] || '';
      const error = validateField(field.name, value);
      if (error) {
        newErrors[field.name] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting || loading) return;

    // Mark all fields as touched
    const allTouched = fields.reduce((acc, field) => {
      acc[field.name] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    // Validate form
    if (!validateForm()) {
      // Trigger validation animation
      if (!reducedMotion && validationAnimation !== 'none' && formRef.current) {
        const form = formRef.current;
        form.style.animation = 'none';
        form.offsetHeight; // Trigger reflow
        form.style.animation = '';
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onSubmit?.(formData);
      setSubmitSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({});
        setTouched({});
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get validation animation
  const getValidationAnimation = () => {
    if (reducedMotion || validationAnimation === 'none') {
      return {};
    }

    const hasErrors = Object.values(errors).some(error => error && touched[Object.keys(errors).find(key => errors[key] === error) || '']);
    
    if (!hasErrors) return {};

    switch (validationAnimation) {
      case 'shake':
        return {
          x: [-5, 5, -5, 5, 0],
          transition: { duration: 0.4 },
        };
      case 'bounce':
        return {
          y: [-2, 2, -2, 2, 0],
          transition: { duration: 0.4, type: 'spring' },
        };
      case 'pulse':
        return {
          scale: [1, 1.02, 1],
          transition: { duration: 0.3 },
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={createTransition('normal', 'gentle')}
    >
      {/* Form Header */}
      {(title || description) && (
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={createTransition('normal', 'gentle', 100)}
        >
          {title && (
            <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
          )}
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </motion.div>
      )}

      {/* Success Message */}
      <AnimatePresence>
        {(submitSuccess || successMessage) && (
          <motion.div
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={createTransition('normal', 'gentle')}
          >
            <div className="flex items-center gap-2 text-green-800">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 500 }}
              >
                ✓
              </motion.span>
              {successMessage || 'Form submitted successfully!'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {(submitError || errorMessage) && (
          <motion.div
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={createTransition('normal', 'gentle')}
          >
            <div className="flex items-center gap-2 text-red-800">
              <motion.span
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                ⚠
              </motion.span>
              {submitError || errorMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <motion.form
        ref={formRef}
        onSubmit={handleSubmit}
        className="space-y-6"
        animate={getValidationAnimation()}
      >
        {/* Form Fields */}
        <div className={getLayoutClasses()}>
          {fields.map((field, index) => (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={createTransition('normal', 'gentle', index * 50)}
            >
              <InteractiveInput
                label={field.label}
                type={field.type || 'text'}
                placeholder={field.placeholder}
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                onBlur={() => handleInputBlur(field.name)}
                error={touched[field.name] ? errors[field.name] : ''}
                helperText={field.helperText}
                icon={field.icon}
                required={field.required}
                focusAnimation="glow"
                validationAnimation={validationAnimation}
              />
            </motion.div>
          ))}
        </div>

        {/* Form Actions */}
        <motion.div
          className="flex gap-3 pt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={createTransition('normal', 'gentle', fields.length * 50)}
        >
          <InteractiveButton
            type="submit"
            loading={isSubmitting || loading}
            success={submitSuccess}
            loadingText="Submitting..."
            successText="Success!"
            interaction="gentle"
            className="flex-1"
          >
            {submitText}
          </InteractiveButton>
          
          {onCancel && (
            <InteractiveButton
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting || loading}
              interaction="gentle"
            >
              {cancelText}
            </InteractiveButton>
          )}
        </motion.div>
      </motion.form>
    </motion.div>
  );
};

export default InteractiveForm;