import { useTranslation } from 'react-i18next';

interface AddButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function AddButton({ onClick, disabled = false }: AddButtonProps) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-md transition-colors flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed text-sm"
      aria-label={t('buttons.addNewField')}
      title={t('buttons.addNewField')}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    </button>
  );
}
