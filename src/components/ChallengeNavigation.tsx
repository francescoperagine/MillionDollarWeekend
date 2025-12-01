import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface NavigationItem {
  id: string;
  label: string;
  phase: string;
}

export default function ChallengeNavigation() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems: NavigationItem[] = [
    // Foundation
    { id: 'dollar_challenge', label: 'First Dollar', phase: 'foundation' },
    { id: 'now_not_how', label: 'Act Now', phase: 'foundation' },
    { id: 'freedom_number', label: 'Freedom Number', phase: 'foundation' },
    // Mindset
    { id: 'coffee_challenge', label: 'Awkward Ask', phase: 'mindset' },
    // Discovery
    { id: 'target_groups', label: 'Who Can You Help?', phase: 'discovery' },
    { id: 'solve_problems', label: 'Mine Frustrations', phase: 'discovery' },
    { id: 'bestsellers', label: 'Ride the Wave', phase: 'discovery' },
    { id: 'marketplaces', label: 'Listen to Buyers', phase: 'discovery' },
    { id: 'search_queries', label: 'Follow Questions', phase: 'discovery' },
    { id: 'ten_ideas', label: 'All Ideas', phase: 'discovery' },
    { id: 'top_three', label: 'Top 3 Ideas', phase: 'discovery' },
    // Validation
    { id: 'market_research', label: 'Verify Market', phase: 'validation' },
    { id: 'business_model', label: 'Run Numbers', phase: 'validation' },
    { id: 'pivot_plan', label: 'Adjust Model', phase: 'validation' },
  ];

  const scrollToChallenge = (challengeId: string) => {
    const element = document.getElementById(challengeId);
    if (element) {
      const offset = 80; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMenuOpen(false);
    }
  };

  // Group items by phase
  const groupedItems = navigationItems.reduce((acc, item) => {
    if (!acc[item.phase]) {
      acc[item.phase] = [];
    }
    acc[item.phase].push(item);
    return acc;
  }, {} as Record<string, NavigationItem[]>);

  // Phase order
  const phaseOrder = ['foundation', 'mindset', 'discovery', 'validation'];

  return (
    <>
      {/* Mobile: Breadcrumb Navigation */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-full px-4 py-2.5 flex items-center justify-between text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm"
          aria-label="Toggle navigation menu"
        >
          <span className="text-sm font-medium uppercase tracking-wide">{t('nav.quickJump')}</span>
          <svg
            className={`w-5 h-5 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            {phaseOrder.map((phase) => {
              const items = groupedItems[phase];
              if (!items) return null;
              const phaseHeaderId = `phase-${phase}`;
              return (
                <button
                  key={phase}
                  onClick={() => scrollToChallenge(phaseHeaderId)}
                  className="w-full px-4 py-3 text-left text-sm font-semibold text-gray-900 hover:text-amber-600 transition-colors border-b border-gray-100 last:border-b-0 uppercase tracking-wide"
                >
                  {t(`phases.${phase}`)}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop: Breadcrumb style phase navigation */}
      <div className="hidden lg:block mb-6">
        <div className="flex gap-3 justify-center items-center flex-wrap">
          {phaseOrder.map((phase, index) => {
            const items = groupedItems[phase];
            if (!items) return null;
            const phaseHeaderId = `phase-${phase}`;
            return (
              <div key={phase} className="flex items-center gap-3">
                <button
                  onClick={() => scrollToChallenge(phaseHeaderId)}
                  className="text-sm font-semibold text-gray-900 hover:text-amber-600 transition-colors uppercase tracking-wide"
                  title={`Jump to ${t(`phases.${phase}`)} section`}
                >
                  {t(`phases.${phase}`)}
                </button>
                {index < phaseOrder.length - 1 && (
                  <span className="text-gray-400">|</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
