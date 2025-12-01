import { useTranslation } from 'react-i18next';
import Input from './Input';
import AddButton from './AddButton';

interface IdeasListProps {
  label: string;
  collectedIdeas: string[];
  customIdeas: string[];
  onCustomIdeasChange: (values: string[]) => void;
  maxFields?: number;
  required?: boolean;
}

export default function IdeasList({
  label,
  collectedIdeas,
  customIdeas,
  onCustomIdeasChange,
  maxFields = 20,
  required = false
}: IdeasListProps) {
  const { t } = useTranslation();

  const handleAddField = () => {
    if (collectedIdeas.length + customIdeas.length < maxFields) {
      onCustomIdeasChange([...customIdeas, '']);
    }
  };

  const handleRemoveCustom = (index: number) => {
    const newCustomIdeas = customIdeas.filter((_, i) => i !== index);
    onCustomIdeasChange(newCustomIdeas);
  };

  const handleChangeCustom = (index: number, value: string) => {
    const newCustomIdeas = [...customIdeas];
    newCustomIdeas[index] = value;
    onCustomIdeasChange(newCustomIdeas);
  };

  const totalIdeas = collectedIdeas.length + customIdeas.length;
  const canAddMore = totalIdeas < maxFields;

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
        {/* Display collected ideas as read-only */}
        {collectedIdeas.map((idea, index) => (
          <div key={`collected-${index}`} className="relative">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 text-sm text-black bg-gray-50 cursor-not-allowed"
              value={idea}
              readOnly
              disabled
              title="This idea is collected from previous challenges"
            />
          </div>
        ))}

        {/* Display custom ideas as editable */}
        {customIdeas.map((idea, index) => (
          <div key={`custom-${index}`} className="relative">
            <Input
              value={idea}
              onChange={(newValue) => handleChangeCustom(index, newValue)}
              type="text"
              placeholder={t('common.placeholder')}
              required={required && collectedIdeas.length === 0 && index === 0}
              showValidation={required}
              onRemove={() => handleRemoveCustom(index)}
            />
          </div>
        ))}
      </div>

      {totalIdeas > 1 && (
        <div className="text-xs text-gray-500">
          {totalIdeas} {t('common.of')} {maxFields} {t('common.fieldsUsed')}
          {collectedIdeas.length > 0 && (
            <span className="ml-2">
              ({collectedIdeas.length} from previous challenges, {customIdeas.length} custom)
            </span>
          )}
        </div>
      )}
    </div>
  );
}
