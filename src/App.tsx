import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DynamicFieldGroup from './components/DynamicFieldGroup';
import IdeasList from './components/IdeasList';
import TopThreeIdeas from './components/TopThreeIdeas';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import ChallengeNavigation from './components/ChallengeNavigation';

const STORAGE_KEY = 'mdw_workbook_challenges';

interface Field {
  id: string;
  label: string;
  type: 'text' | 'textarea';
  dynamic?: boolean; // Whether this field supports multiple answers
  minFields?: number; // Minimum number of fields (for dynamic fields)
  maxFields?: number; // Maximum number of fields (for dynamic fields)
  required?: boolean; // Whether the field is required
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  fields: Field[];
}

interface ChallengeData {
  [fieldId: string]: string | string[]; // Support both single values and arrays
}

interface FormData {
  [challengeId: string]: ChallengeData;
}

interface Submission {
  data: FormData;
  savedAt: string;
}

interface StoredData {
  submissions: Submission[];
  currentData: FormData;
}

const getChallenges = (t: (key: string) => string): Challenge[] => [
  {
    id: 'dollar_challenge',
    title: t('challenges.dollar_challenge.title'),
    description: t('challenges.dollar_challenge.description'),
    fields: [
      { id: 'who_asked', label: t('challenges.dollar_challenge.fields.who_asked'), type: 'text', required: true },
      { id: 'response', label: t('challenges.dollar_challenge.fields.response'), type: 'textarea', required: true }
    ]
  },
  {
    id: 'now_not_how',
    title: t('challenges.now_not_how.title'),
    description: t('challenges.now_not_how.description'),
    fields: [
      { id: 'person_asked', label: t('challenges.now_not_how.fields.person_asked'), type: 'text', required: true },
      { id: 'ideas_suggested', label: t('challenges.now_not_how.fields.ideas_suggested'), type: 'textarea', dynamic: true, minFields: 1, maxFields: 5, required: true }
    ]
  },
  {
    id: 'freedom_number',
    title: t('challenges.freedom_number.title'),
    description: t('challenges.freedom_number.description'),
    fields: [
      { id: 'monthly_number', label: t('challenges.freedom_number.fields.monthly_number'), type: 'text', required: true },
      { id: 'breakdown', label: t('challenges.freedom_number.fields.breakdown'), type: 'textarea', required: false }
    ]
  },
  {
    id: 'coffee_challenge',
    title: t('challenges.coffee_challenge.title'),
    description: t('challenges.coffee_challenge.description'),
    fields: [
      { id: 'where', label: t('challenges.coffee_challenge.fields.where'), type: 'text', required: true },
      { id: 'result', label: t('challenges.coffee_challenge.fields.result'), type: 'textarea', required: true }
    ]
  },
  {
    id: 'target_groups',
    title: t('challenges.target_groups.title'),
    description: t('challenges.target_groups.description'),
    fields: [
      { id: 'groups', label: t('challenges.target_groups.fields.groups'), type: 'text', dynamic: true, minFields: 1, maxFields: 10, required: true }
    ]
  },
  {
    id: 'solve_problems',
    title: t('challenges.solve_problems.title'),
    description: t('challenges.solve_problems.description'),
    fields: [
      { id: 'ideas', label: t('challenges.solve_problems.fields.ideas'), type: 'textarea', dynamic: true, minFields: 1, maxFields: 10, required: true }
    ]
  },
  {
    id: 'bestsellers',
    title: t('challenges.bestsellers.title'),
    description: t('challenges.bestsellers.description'),
    fields: [
      { id: 'accessories', label: t('challenges.bestsellers.fields.accessories'), type: 'textarea', dynamic: true, minFields: 1, maxFields: 10, required: true }
    ]
  },
  {
    id: 'marketplaces',
    title: t('challenges.marketplaces.title'),
    description: t('challenges.marketplaces.description'),
    fields: [
      { id: 'marketplace_ideas', label: t('challenges.marketplaces.fields.marketplace_ideas'), type: 'textarea', dynamic: true, minFields: 1, maxFields: 10, required: true }
    ]
  },
  {
    id: 'search_queries',
    title: t('challenges.search_queries.title'),
    description: t('challenges.search_queries.description'),
    fields: [
      { id: 'search_ideas', label: t('challenges.search_queries.fields.search_ideas'), type: 'textarea', dynamic: true, minFields: 1, maxFields: 10, required: true }
    ]
  },
  {
    id: 'ten_ideas',
    title: t('challenges.ten_ideas.title'),
    description: t('challenges.ten_ideas.description'),
    fields: [
      { id: 'all_ideas', label: t('challenges.ten_ideas.fields.all_ideas'), type: 'text', dynamic: true, minFields: 1, maxFields: 20, required: true }
    ]
  },
  {
    id: 'top_three',
    title: t('challenges.top_three.title'),
    description: t('challenges.top_three.description'),
    fields: [
      { id: 'top_ideas', label: t('challenges.top_three.fields.top_ideas'), type: 'text', dynamic: true, minFields: 1, maxFields: 5, required: true }
    ]
  },
  {
    id: 'market_research',
    title: t('challenges.market_research.title'),
    description: t('challenges.market_research.description'),
    fields: [
      { id: 'business_idea', label: t('challenges.market_research.fields.business_idea'), type: 'text', required: true },
      { id: 'market_trend', label: t('challenges.market_research.fields.market_trend'), type: 'textarea', required: true },
      { id: 'market_size', label: t('challenges.market_research.fields.market_size'), type: 'text', required: true },
      { id: 'price_point', label: t('challenges.market_research.fields.price_point'), type: 'text', required: true },
      { id: 'total_value', label: t('challenges.market_research.fields.total_value'), type: 'text', required: true },
      { id: 'million_dollar', label: t('challenges.market_research.fields.million_dollar'), type: 'text', required: true }
    ]
  },
  {
    id: 'business_model',
    title: t('challenges.business_model.title'),
    description: t('challenges.business_model.description'),
    fields: [
      { id: 'product_price', label: t('challenges.business_model.fields.product_price'), type: 'text', required: true },
      { id: 'cost_per_unit', label: t('challenges.business_model.fields.cost_per_unit'), type: 'text', required: true },
      { id: 'profit_per_unit', label: t('challenges.business_model.fields.profit_per_unit'), type: 'text', required: true },
      { id: 'target_profit', label: t('challenges.business_model.fields.target_profit'), type: 'text', required: true },
      { id: 'units_needed', label: t('challenges.business_model.fields.units_needed'), type: 'text', required: true },
      { id: 'is_doable', label: t('challenges.business_model.fields.is_doable'), type: 'textarea', required: true }
    ]
  },
  {
    id: 'pivot_plan',
    title: t('challenges.pivot_plan.title'),
    description: t('challenges.pivot_plan.description'),
    fields: [
      { id: 'needs_pivot', label: t('challenges.pivot_plan.fields.needs_pivot'), type: 'text', required: false },
      { id: 'pivot_ideas', label: t('challenges.pivot_plan.fields.pivot_ideas'), type: 'textarea', dynamic: true, minFields: 1, maxFields: 5, required: false },
      { id: 'revised_model', label: t('challenges.pivot_plan.fields.revised_model'), type: 'textarea', required: false }
    ]
  }
];

interface ChallengesPageProps {
  data: FormData;
  setData: React.Dispatch<React.SetStateAction<FormData>>;
}

function ChallengesPage({ data, setData }: ChallengesPageProps) {
  const { t } = useTranslation();
  const challenges = getChallenges(t);

  const handleChange = (challengeId: string, fieldId: string, value: string | string[]) => {
    setData(prev => ({
      ...prev,
      [challengeId]: { ...prev[challengeId], [fieldId]: value }
    }));
  };

  const getCollectedIdeas = (): string[] => {
    const collectedIdeas: string[] = [];

    // From Challenge 2: Solve Your Own Problems (Business Ideas)
    const businessIdeas = data['solve_problems']?.['ideas'];
    if (Array.isArray(businessIdeas)) {
      collectedIdeas.push(...businessIdeas.filter(v => v.trim()));
    } else if (businessIdeas && typeof businessIdeas === 'string' && businessIdeas.trim()) {
      collectedIdeas.push(businessIdeas);
    }

    // From Challenge 3: Bestsellers (Accessorizing Ideas)
    const accessoryIdeas = data['bestsellers']?.['accessories'];
    if (Array.isArray(accessoryIdeas)) {
      collectedIdeas.push(...accessoryIdeas.filter(v => v.trim()));
    } else if (accessoryIdeas && typeof accessoryIdeas === 'string' && accessoryIdeas.trim()) {
      collectedIdeas.push(accessoryIdeas);
    }

    // From Challenge 4: Marketplaces (Marketplace Ideas)
    const marketplaceIdeas = data['marketplaces']?.['marketplace_ideas'];
    if (Array.isArray(marketplaceIdeas)) {
      collectedIdeas.push(...marketplaceIdeas.filter(v => v.trim()));
    } else if (marketplaceIdeas && typeof marketplaceIdeas === 'string' && marketplaceIdeas.trim()) {
      collectedIdeas.push(marketplaceIdeas);
    }

    // From Challenge 5: Search Queries (Search/Reddit Ideas)
    const searchIdeas = data['search_queries']?.['search_ideas'];
    if (Array.isArray(searchIdeas)) {
      collectedIdeas.push(...searchIdeas.filter(v => v.trim()));
    } else if (searchIdeas && typeof searchIdeas === 'string' && searchIdeas.trim()) {
      collectedIdeas.push(searchIdeas);
    }

    return collectedIdeas;
  };

  const getAllIdeas = (): string[] => {
    // Combine collected ideas from previous challenges with custom ideas
    const collectedIdeas = getCollectedIdeas();
    const customIdeas = data['ten_ideas']?.['all_ideas'];

    const allIdeas = [...collectedIdeas];

    if (Array.isArray(customIdeas)) {
      customIdeas.forEach(idea => {
        if (idea.trim() && !allIdeas.includes(idea)) {
          allIdeas.push(idea);
        }
      });
    } else if (customIdeas && typeof customIdeas === 'string' && customIdeas.trim()) {
      if (!allIdeas.includes(customIdeas)) {
        allIdeas.push(customIdeas);
      }
    }

    return allIdeas;
  };

  const getFieldValue = (challengeId: string, fieldId: string, isDynamic: boolean): string[] => {
    const value = data[challengeId]?.[fieldId];
    if (isDynamic) {
      if (Array.isArray(value)) return value;
      if (value) return [value as string];
      return [''];
    }
    return [];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pb-24 flex justify-center">
      <div className="max-w-3xl w-full">
        <ChallengeNavigation />

        <div className="mb-20">
        {challenges.map((challenge, index) => {
          // Check if this is the first challenge of a new phase
          const currentPhase = t(`challenges.${challenge.id}.phase`);
          const previousPhase = index > 0 ? t(`challenges.${challenges[index - 1].id}.phase`) : null;
          const isNewPhase = currentPhase !== previousPhase;

          // Strip phase prefix from title (e.g., "Foundation: Get Your First Dollar" -> "Get Your First Dollar")
          const titleWithoutPhase = challenge.title.includes(':')
            ? challenge.title.split(':')[1].trim()
            : challenge.title;

          return (
            <div key={challenge.id}>
              {isNewPhase && (
                <div id={`phase-${currentPhase}`} className="flex items-center gap-4 mb-6 mt-8 first:mt-0 scroll-mt-24">
                  <div className="flex-1 h-0.5 bg-amber-500"></div>
                  <h2 className="text-3xl font-bold text-amber-600 tracking-wide">
                    {t(`phases.${currentPhase}`)}
                  </h2>
                  <div className="flex-1 h-0.5 bg-amber-500"></div>
                </div>
              )}
              <div
                id={challenge.id}
                className="bg-white rounded-lg shadow-md p-6 mb-6 scroll-mt-24"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2 border-amber-500">{titleWithoutPhase}</h3>
                <p className="text-gray-700 mb-3 text-sm">{challenge.description}</p>
            <div className="space-y-3">
              {challenge.fields.map(field => (
                <div key={field.id}>
                  {challenge.id === 'ten_ideas' && field.id === 'all_ideas' ? (
                    <IdeasList
                      label={field.label}
                      collectedIdeas={getCollectedIdeas()}
                      customIdeas={(data[challenge.id]?.[field.id] as string[]) || []}
                      onCustomIdeasChange={(values) => handleChange(challenge.id, field.id, values)}
                      maxFields={field.maxFields || 20}
                      required={field.required}
                    />
                  ) : challenge.id === 'top_three' && field.id === 'top_ideas' ? (
                    <TopThreeIdeas
                      label={field.label}
                      allIdeas={getAllIdeas()}
                      selectedIdeas={(data[challenge.id]?.[field.id] as string[]) || []}
                      onSelectedIdeasChange={(values) => handleChange(challenge.id, field.id, values)}
                      required={field.required}
                    />
                  ) : field.dynamic ? (
                    <DynamicFieldGroup
                      label={field.label}
                      values={getFieldValue(challenge.id, field.id, true)}
                      onChange={(values) => handleChange(challenge.id, field.id, values)}
                      type={field.type}
                      minFields={field.minFields || 1}
                      maxFields={field.maxFields || 10}
                      required={field.required}
                    />
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">{t('common.required')}</span>}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          className="w-full border border-gray-300 rounded-md p-2 text-sm text-black focus:ring-amber-500 focus:border-amber-500"
                          rows={3}
                          value={(data[challenge.id]?.[field.id] as string) || ''}
                          onChange={e => handleChange(challenge.id, field.id, e.target.value)}
                          placeholder={t('common.placeholder')}
                        />
                      ) : (
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-md p-2 text-sm text-black focus:ring-amber-500 focus:border-amber-500"
                          value={(data[challenge.id]?.[field.id] as string) || ''}
                          onChange={e => handleChange(challenge.id, field.id, e.target.value)}
                          placeholder={t('common.placeholder')}
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
          );
        })}
        </div>

        <ScrollToTop />
      </div>
    </div>
  );
}

interface SubmissionsPageProps {
  submissions: Submission[];
  onDelete: (index: number) => void;
}

function SubmissionsPage({ submissions, onDelete }: SubmissionsPageProps) {
  const { t } = useTranslation();
  const challenges = getChallenges(t);

  if (!submissions || submissions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 pb-24 flex justify-center">
        <div className="max-w-3xl w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('submissions.title')}</h1>
          <p className="text-gray-600">{t('submissions.noSubmissions')}</p>
        </div>
      </div>
    );
  }

  const hasContent = (value: string | string[]): boolean => {
    if (Array.isArray(value)) {
      return value.some(v => v && v.trim());
    }
    return Boolean(value && value.trim().length > 0);
  };

  const renderValue = (value: string | string[]): React.ReactElement => {
    if (Array.isArray(value)) {
      const filtered = value.filter(v => v && v.trim());
      if (filtered.length === 0) return <></>;
      return (
        <>
          {filtered.map((v, i) => (
            <p key={i} className="text-sm text-gray-800">
              {filtered.length > 1 ? `${i + 1}. ` : ''}{v}
            </p>
          ))}
        </>
      );
    }
    return <p className="text-sm text-gray-800">{value}</p>;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pb-24 flex justify-center">
      <div className="max-w-3xl w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t('submissions.title')}</h1>
        {submissions.map((submission, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-md p-6 mb-4">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{t('submissions.submission')} #{idx + 1}</span>
                <span className="text-sm text-gray-500">{submission.savedAt}</span>
              </div>
              <button
                onClick={() => {
                  if (window.confirm(t('submissions.deleteConfirm'))) {
                    onDelete(idx);
                  }
                }}
                className="text-red-600 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors"
                aria-label={t('submissions.delete')}
                title={t('submissions.delete')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
            {challenges.map(challenge => {
              const challengeData = submission.data[challenge.id];
              if (!challengeData) return null;
              const hasChallengeContent = Object.values(challengeData).some(v => hasContent(v));
              if (!hasChallengeContent) return null;
              return (
                <div key={challenge.id} className="mb-4">
                  <h4 className="font-medium text-amber-600 text-sm mb-2">{challenge.title}</h4>
                  <div className="pl-3 border-l-2 border-gray-200">
                    {challenge.fields.map(field => {
                      const val = challengeData[field.id];
                      if (!hasContent(val)) return null;
                      return (
                        <div key={field.id} className="mb-2">
                          <span className="text-xs text-gray-500">{field.label}:</span>
                          {renderValue(val)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        <ScrollToTop />
      </div>
    </div>
  );
}

function getInitialData(): StoredData {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const parsed: StoredData = JSON.parse(stored);
    return {
      submissions: parsed.submissions || [],
      currentData: parsed.currentData || {}
    };
  }
  return { submissions: [], currentData: {} };
}

export default function App() {
  const { t } = useTranslation();
  const [page, setPage] = useState<'challenges' | 'submissions'>('challenges');
  const initialData = getInitialData();
  const [data, setData] = useState<FormData>(initialData.currentData);
  const [submissions, setSubmissions] = useState<Submission[]>(initialData.submissions);
  const [saved, setSaved] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Check if "Capture All Your Ideas" (ten_ideas) has content
  const hasData = (() => {
    const tenIdeasData = data['ten_ideas']?.['all_ideas'];
    if (!tenIdeasData) return false;

    if (Array.isArray(tenIdeasData)) {
      return tenIdeasData.some(v => v && v.trim().length > 0);
    }
    return typeof tenIdeasData === 'string' && tenIdeasData.trim().length > 0;
  })();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSave = () => {
    const newSubmission: Submission = {
      data: { ...data },
      savedAt: new Date().toLocaleString()
    };
    const updated: StoredData = {
      submissions: [...submissions, newSubmission],
      currentData: data
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSubmissions(updated.submissions);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm(t('common.resetConfirm'))) {
      setData({});
      setSaved(false);
    }
  };

  const handleDeleteSubmission = (index: number) => {
    const updatedSubmissions = submissions.filter((_, idx) => idx !== index);
    const updated: StoredData = {
      submissions: updatedSubmissions,
      currentData: data
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSubmissions(updatedSubmissions);
  };

  return (
    <div>
      {/* Header Section */}
      <header className="bg-gray-900 text-white fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className={`text-center px-4 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-6'}`}>
          <h1 className={`font-bold text-amber-500 transition-all duration-300 ${isScrolled ? 'text-xl sm:text-2xl mb-0' : 'text-3xl sm:text-4xl mb-4'}`}>
            {t('header.title')}
          </h1>
          <div className={`overflow-hidden transition-all duration-300 ${isScrolled ? 'text-md' : 'text-xl'}`}>
            <h2 className="text-white font-semibold">
              {t('header.subtitle')}
            </h2>
          </div>
        </div>
      </header>
      {/* Spacer to prevent content from going under fixed header */}
      <div className={`transition-all duration-300 h-32`}></div>

      {page === 'challenges' ? (
        <ChallengesPage data={data} setData={setData} />
      ) : (
        <SubmissionsPage submissions={submissions} onDelete={handleDeleteSubmission} />
      )}
      <Footer
        page={page}
        setPage={setPage}
        submissionsCount={submissions.length}
        onSave={page === 'challenges' ? handleSave : undefined}
        onReset={page === 'challenges' ? handleReset : undefined}
        saved={saved}
        hasData={hasData}
      />
    </div>
  );
}