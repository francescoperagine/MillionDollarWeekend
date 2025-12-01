import { useTranslation } from 'react-i18next';

interface FooterProps {
  page: 'challenges' | 'submissions';
  setPage: (page: 'challenges' | 'submissions') => void;
  submissionsCount: number;
  onSave?: () => void;
  onReset?: () => void;
  saved?: boolean;
  hasData?: boolean;
}

export default function Footer({ page, setPage, submissionsCount, onSave, onReset, saved, hasData }: FooterProps) {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-white fixed bottom-0 left-0 right-0 z-10">
      {/* Navigation and Save Progress Row */}
      <div className="border-b border-gray-700">
        <div className="max-w-3xl mx-auto px-4 py-2 sm:py-3 flex items-center justify-between">
          {/* Left: Navigation Buttons */}
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => setPage('challenges')}
              className={`px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-md transition-colors font-medium ${
                page === 'challenges'
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {t('nav.challenges')}
            </button>
            <button
              onClick={() => setPage('submissions')}
              disabled={submissionsCount === 0}
              className={`px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-md transition-colors font-medium ${
                submissionsCount === 0
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : page === 'submissions'
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {t('nav.submissions')} ({submissionsCount})
            </button>
          </div>

          {/* Right: Reset and Save Progress Buttons */}
          {page === 'challenges' && (
            <div className="flex gap-2">
              {onReset && (
                <button
                  onClick={onReset}
                  disabled={!hasData}
                  className={`px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-md transition-colors font-medium ${
                    !hasData
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {t('common.reset')}
                </button>
              )}
              {onSave && (
                <button
                  onClick={onSave}
                  disabled={saved || !hasData}
                  className={`px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-md transition-colors font-medium ${
                    saved
                      ? 'bg-green-600 text-white cursor-not-allowed'
                      : !hasData
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-amber-500 hover:bg-amber-600 text-white'
                  }`}
                >
                  {saved ? '✓' : t('common.saveProgress')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Attribution Row */}
      <div className="px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
          <p className="text-xs sm:text-sm text-gray-300">
            {t('footer.attribution')}{' '}
            <span className="font-semibold text-white">{t('footer.bookTitle')}</span>{' '}
            {t('footer.author')}
          </p>
          <span className="hidden sm:inline text-gray-600">|</span>
          <div className="flex items-center gap-3">
            <a
              href={t('footer.bookUrl')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm text-amber-400 hover:text-amber-300 font-medium hover:underline"
            >
              {t('footer.getBook')} →
            </a>
            <span className="text-gray-600">•</span>
            <a
              href={t('footer.authorUrl')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm text-amber-400 hover:text-amber-300 font-medium hover:underline"
            >
              {t('footer.learnMore')} →
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
