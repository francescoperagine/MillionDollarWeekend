import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { validateAndSanitize } from '../utils/sanitize';
import type { ValidationError } from '../utils/sanitize';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'textarea';
  label?: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  showValidation?: boolean;
  onRemove?: () => void;
  className?: string;
}

export default function Input({
  value,
  onChange,
  type = 'text',
  label,
  placeholder,
  required = false,
  minLength,
  maxLength = 5000,
  showValidation = false,
  onRemove,
  className = ''
}: InputProps) {
  const { t } = useTranslation();
  const placeholderText = placeholder || t('common.placeholder');
  const [touched, setTouched] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  useEffect(() => {
    if (touched && showValidation) {
      const validation = validateAndSanitize(value, {
        required,
        minLength,
        maxLength,
        allowSpecialChars: true
      });
      setErrors(validation.errors);
    }
  }, [value, touched, showValidation, required, minLength, maxLength]);

  const handleChange = (newValue: string) => {
    // Sanitize on change
    const validation = validateAndSanitize(newValue, {
      required: false, // Don't validate required on change
      maxLength,
      allowSpecialChars: true
    });

    // Only update if it doesn't exceed max length
    if (newValue.length <= maxLength) {
      onChange(validation.sanitized);
    }
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const baseInputClasses = `w-full border rounded-md p-2 text-sm focus:ring-amber-500 focus:border-amber-500 transition-colors ${
    touched && errors.length > 0 ? 'border-red-500' : 'border-gray-300'
  } ${className}`;

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">{t('common.required')}</span>}
        </label>
      )}

      <div className="relative flex gap-2">
        {type === 'textarea' ? (
          <textarea
            className={baseInputClasses}
            rows={3}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            placeholder={placeholderText}
            aria-invalid={errors.length > 0}
            aria-describedby={errors.length > 0 ? `error-${label}` : undefined}
          />
        ) : (
          <input
            type="text"
            className={baseInputClasses}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            placeholder={placeholderText}
            aria-invalid={errors.length > 0}
            aria-describedby={errors.length > 0 ? `error-${label}` : undefined}
          />
        )}

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="shrink-0 w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-md transition-colors"
            aria-label={t('buttons.removeField')}
            title={t('buttons.removeThisField')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {touched && errors.length > 0 && (
        <div id={`error-${label}`} className="mt-1 text-xs text-red-600">
          {errors.map((error, idx) => (
            <div key={idx}>{t(error.key, error.params)}</div>
          ))}
        </div>
      )}

      {maxLength && value.length > maxLength * 0.9 && (
        <div className="mt-1 text-xs text-gray-500">
          {value.length} / {maxLength} {t('submissions.characters')}
        </div>
      )}
    </div>
  );
}
