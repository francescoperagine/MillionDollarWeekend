interface NavButtonProps {
  onClick: () => void;
  active: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

export default function NavButton({ onClick, active, disabled = false, children }: NavButtonProps) {
  const activeClasses = active
    ? 'bg-amber-500 hover:bg-amber-600 text-white'
    : disabled
      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
      : 'bg-gray-700 hover:bg-gray-600 text-white';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md transition-colors font-medium ${activeClasses}`}
    >
      {children}
    </button>
  );
}
