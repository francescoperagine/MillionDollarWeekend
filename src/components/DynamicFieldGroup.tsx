import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Input from './Input';
import AddButton from './AddButton';

interface DynamicFieldGroupProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  type?: 'text' | 'textarea';
  minFields?: number;
  maxFields?: number;
  required?: boolean;
  placeholder?: string;
}

export default function DynamicFieldGroup({
  label,
  values,
  onChange,
  type = 'text',
  minFields = 1,
  maxFields = 10,
  required = false,
  placeholder
}: DynamicFieldGroupProps) {
  const { t } = useTranslation();
  const placeholderText = placeholder || t('common.placeholder');

  // Initialize with at least minFields
  useEffect(() => {
    if (values.length === 0) {
      onChange(Array(minFields).fill(''));
    }
  }, []);

  const handleAddField = () => {
    if (values.length < maxFields) {
      onChange([...values, '']);
    }
  };

  const handleRemoveField = (index: number) => {
    if (values.length > minFields) {
      const newValues = values.filter((_, i) => i !== index);
      onChange(newValues);
    }
  };

  const handleChangeField = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    onChange(newValues);
  };

  const canAddMore = values.length < maxFields;
  const canRemove = values.length > minFields;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">{t('common.required')}</span>}
        </label>
        {canAddMore && <AddButton onClick={handleAddField} />}
      </div>

      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={index} className="relative">
            <Input
              value={value}
              onChange={(newValue) => handleChangeField(index, newValue)}
              type={type}
              label={values.length > 1 ? `${index + 1}.` : undefined}
              placeholder={`${placeholderText} ${values.length > 1 ? `#${index + 1}` : ''}`}
              required={required && index === 0}
              showValidation={required}
              onRemove={canRemove && values.length > 1 ? () => handleRemoveField(index) : undefined}
            />
          </div>
        ))}
      </div>

      {values.length > 1 && (
        <div className="text-xs text-gray-500">
          {values.length} {t('common.of')} {maxFields} {t('common.fieldsUsed')}
        </div>
      )}
    </div>
  );
}
