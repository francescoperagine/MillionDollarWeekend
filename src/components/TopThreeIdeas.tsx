import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface TopThreeIdeasProps {
  label: string;
  allIdeas: string[];
  selectedIdeas: string[];
  onSelectedIdeasChange: (values: string[]) => void;
  required?: boolean;
}

export default function TopThreeIdeas({
  label,
  allIdeas,
  selectedIdeas,
  onSelectedIdeasChange,
  required = false
}: TopThreeIdeasProps) {
  const { t } = useTranslation();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const prevAllIdeasRef = useRef<string[]>([]);

  // Keep selectedIdeas in sync with allIdeas
  useEffect(() => {
    // Check if allIdeas actually changed
    const allIdeasChanged =
      prevAllIdeasRef.current.length !== allIdeas.length ||
      prevAllIdeasRef.current.some((idea, i) => idea !== allIdeas[i]);

    if (!allIdeasChanged) return;

    // Update the ref
    prevAllIdeasRef.current = [...allIdeas];

    if (allIdeas.length === 0) return;

    // If no ideas selected yet, initialize with all ideas
    if (selectedIdeas.length === 0) {
      onSelectedIdeasChange([...allIdeas]);
      return;
    }

    // Filter out ideas that no longer exist in allIdeas
    const stillExistingIdeas = selectedIdeas.filter(idea => allIdeas.includes(idea));

    // Find new ideas that aren't in selectedIdeas yet
    const newIdeas = allIdeas.filter(idea => !selectedIdeas.includes(idea));

    // Combine: keep existing ideas in their order, add new ones at the end
    const updatedIdeas = [...stillExistingIdeas, ...newIdeas];

    // Only update if something actually changed
    if (updatedIdeas.length !== selectedIdeas.length ||
        updatedIdeas.some((idea, i) => idea !== selectedIdeas[i])) {
      onSelectedIdeasChange(updatedIdeas.length > 0 ? updatedIdeas : []);
    }
  }, [allIdeas]);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newIdeas = [...selectedIdeas];
    const draggedItem = newIdeas[draggedIndex];
    newIdeas.splice(draggedIndex, 1);
    newIdeas.splice(index, 0, draggedItem);

    onSelectedIdeasChange(newIdeas);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleRemove = (index: number) => {
    // Allow removal until only 1 idea remains
    if (selectedIdeas.length > 1) {
      const newIdeas = selectedIdeas.filter((_, i) => i !== index);
      onSelectedIdeasChange(newIdeas);
    }
  };

  const canRemove = selectedIdeas.length > 1;
  const hasMoreThanThree = selectedIdeas.length > 3;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">{t('common.required')}</span>}
        </label>
      </div>

      {hasMoreThanThree && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800">
          <p className="font-medium">{t('topThree.instruction')}</p>
          <p className="text-xs mt-1">{t('topThree.hint')}</p>
        </div>
      )}

      <div className="space-y-2">
        {selectedIdeas.map((idea, index) => (
          <div
            key={`idea-${index}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`relative flex items-center gap-2 bg-white border rounded-md p-3 transition-all ${
              draggedIndex === index
                ? 'opacity-50 border-amber-400'
                : 'opacity-100 border-gray-300 hover:border-amber-300 cursor-move'
            }`}
          >
            {/* Drag handle */}
            <div className="flex-shrink-0 text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
            </div>

            {/* Rank number */}
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-amber-500 text-white rounded-full text-xs font-bold">
              {index + 1}
            </div>

            {/* Idea text */}
            <div className="flex-1 text-sm text-gray-800">
              {idea}
            </div>

            {/* Remove button */}
            {canRemove && (
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded p-1 transition-colors"
                aria-label={t('buttons.remove')}
                title={t('buttons.remove')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedIdeas.length === 0 ? (
        <div className="bg-gray-50 border border-gray-300 rounded-md p-4 text-center text-sm text-gray-600">
          <p>{t('topThree.noIdeas')}</p>
        </div>
      ) : (
        <>
          <div className="text-xs text-gray-500">
            {selectedIdeas.length} {selectedIdeas.length === 1 ? 'idea' : 'ideas'} selected
            {hasMoreThanThree && (
              <span className="text-amber-600 font-medium ml-2">
                (Remove {selectedIdeas.length - 3} more to reach your top 3)
              </span>
            )}
          </div>

          {selectedIdeas.length > 0 && selectedIdeas.length <= 3 && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-800">
              <p className="font-medium">✓ {t('topThree.complete')}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
