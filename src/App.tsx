import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DynamicFieldGroup from './components/DynamicFieldGroup';
import Button from './components/Button';
import NavButton from './components/NavButton';
import ScrollToTop from './components/ScrollToTop';

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
  instruction: string;
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
    instruction: t('challenges.dollar_challenge.instruction'),
    fields: [
      { id: 'who_asked', label: t('challenges.dollar_challenge.fields.who_asked'), type: 'text', required: true },
      { id: 'response', label: t('challenges.dollar_challenge.fields.response'), type: 'textarea', required: true }
    ]
  },
  {
    id: 'now_not_how',
    title: t('challenges.now_not_how.title'),
    description: t('challenges.now_not_how.description'),
    instruction: t('challenges.now_not_how.instruction'),
    fields: [
      { id: 'person_asked', label: t('challenges.now_not_how.fields.person_asked'), type: 'text', required: true },
      { id: 'ideas_suggested', label: t('challenges.now_not_how.fields.ideas_suggested'), type: 'textarea', dynamic: true, minFields: 1, maxFields: 5, required: true }
    ]
  },
  {
    id: 'freedom_number',
    title: t('challenges.freedom_number.title'),
    description: t('challenges.freedom_number.description'),
    instruction: t('challenges.freedom_number.instruction'),
    fields: [
      { id: 'monthly_number', label: t('challenges.freedom_number.fields.monthly_number'), type: 'text', required: true },
      { id: 'breakdown', label: t('challenges.freedom_number.fields.breakdown'), type: 'textarea', required: false }
    ]
  },
  {
    id: 'coffee_challenge',
    title: t('challenges.coffee_challenge.title'),
    description: t('challenges.coffee_challenge.description'),
    instruction: t('challenges.coffee_challenge.instruction'),
    fields: [
      { id: 'where', label: t('challenges.coffee_challenge.fields.where'), type: 'text', required: true },
      { id: 'result', label: t('challenges.coffee_challenge.fields.result'), type: 'textarea', required: true }
    ]
  },
  {
    id: 'target_groups',
    title: t('challenges.target_groups.title'),
    description: t('challenges.target_groups.description'),
    instruction: t('challenges.target_groups.instruction'),
    fields: [
      { id: 'groups', label: t('challenges.target_groups.fields.groups'), type: 'text', dynamic: true, minFields: 1, maxFields: 10, required: true }
    ]
  },
  {
    id: 'solve_problems',
    title: t('challenges.solve_problems.title'),
    description: t('challenges.solve_problems.description'),
    instruction: t('challenges.solve_problems.instruction'),
    fields: [
      { id: 'ideas', label: t('challenges.solve_problems.fields.ideas'), type: 'textarea', dynamic: true, minFields: 1, maxFields: 10, required: true }
    ]
  },
  {
    id: 'bestsellers',
    title: t('challenges.bestsellers.title'),
    description: t('challenges.bestsellers.description'),
    instruction: t('challenges.bestsellers.instruction'),
    fields: [
      { id: 'accessories', label: t('challenges.bestsellers.fields.accessories'), type: 'textarea', dynamic: true, minFields: 1, maxFields: 10, required: true }
    ]
  },
  {
    id: 'marketplaces',
    title: t('challenges.marketplaces.title'),
    description: t('challenges.marketplaces.description'),
    instruction: t('challenges.marketplaces.instruction'),
    fields: [
      { id: 'marketplace_ideas', label: t('challenges.marketplaces.fields.marketplace_ideas'), type: 'textarea', dynamic: true, minFields: 1, maxFields: 10, required: true }
    ]
  },
  {
    id: 'search_queries',
    title: t('challenges.search_queries.title'),
    description: t('challenges.search_queries.description'),
    instruction: t('challenges.search_queries.instruction'),
    fields: [
      { id: 'search_ideas', label: t('challenges.search_queries.fields.search_ideas'), type: 'textarea', dynamic: true, minFields: 1, maxFields: 10, required: true }
    ]
  },
  {
    id: 'ten_ideas',
    title: t('challenges.ten_ideas.title'),
    description: t('challenges.ten_ideas.description'),
    instruction: t('challenges.ten_ideas.instruction'),
    fields: [
      { id: 'all_ideas', label: t('challenges.ten_ideas.fields.all_ideas'), type: 'text', dynamic: true, minFields: 1, maxFields: 20, required: true }
    ]
  },
  {
    id: 'top_three',
    title: t('challenges.top_three.title'),
    description: t('challenges.top_three.description'),
    instruction: t('challenges.top_three.instruction'),
    fields: [
      { id: 'top_ideas', label: t('challenges.top_three.fields.top_ideas'), type: 'text', dynamic: true, minFields: 1, maxFields: 5, required: true }
    ]
  },
  {
    id: 'market_research',
    title: t('challenges.market_research.title'),
    description: t('challenges.market_research.description'),
    instruction: t('challenges.market_research.instruction'),
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
    instruction: t('challenges.business_model.instruction'),
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
    instruction: t('challenges.pivot_plan.instruction'),
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
  onSave: () => void;
  saved: boolean;
}

function ChallengesPage({ data, setData, onSave, saved }: ChallengesPageProps) {
  const { t } = useTranslation();
  const challenges = getChallenges(t);

  const handleChange = (challengeId: string, fieldId: string, value: string | string[]) => {
    setData(prev => ({
      ...prev,
      [challengeId]: { ...prev[challengeId], [fieldId]: value }
    }));
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex justify-center">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('header.title')}</h1>
          <h2 className="text-xl text-amber-600 font-semibold">{t('header.subtitle')}</h2>
          <p className="text-gray-600 mt-2">{t('header.description')}</p>
        </div>

        {challenges.map((challenge) => (
          <div key={challenge.id} className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-amber-500">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{challenge.title}</h3>
            <p className="text-gray-700 mb-3 text-sm">{challenge.description}</p>
            <div className="bg-amber-50 p-4 rounded-md mb-4">
              <p className="text-gray-800 text-sm whitespace-pre-line">{challenge.instruction}</p>
            </div>
            <div className="space-y-3">
              {challenge.fields.map(field => (
                <div key={field.id}>
                  {field.dynamic ? (
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
                          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-amber-500 focus:border-amber-500"
                          rows={3}
                          value={(data[challenge.id]?.[field.id] as string) || ''}
                          onChange={e => handleChange(challenge.id, field.id, e.target.value)}
                          placeholder={t('common.placeholder')}
                        />
                      ) : (
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-amber-500 focus:border-amber-500"
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
        ))}

        <div className="flex items-center justify-between gap-3 bg-white rounded-lg shadow-md px-4 py-2 sticky bottom-4">
          <span className={`text-xs ${saved ? 'text-green-600' : 'text-gray-500'}`}>
            {saved ? t('common.saved') : t('common.unsavedChanges')}
          </span>
          <Button onClick={onSave} className="py-1.5 px-4 text-sm">
            {t('common.saveProgress')}
          </Button>
        </div>

        <ScrollToTop />
      </div>
    </div>
  );
}

interface SubmissionsPageProps {
  submissions: Submission[];
}

function SubmissionsPage({ submissions }: SubmissionsPageProps) {
  const { t } = useTranslation();
  const challenges = getChallenges(t);

  if (!submissions || submissions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex justify-center">
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex justify-center">
      <div className="max-w-3xl w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t('submissions.title')}</h1>
        {submissions.map((submission, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-md p-6 mb-4">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <span className="font-semibold text-gray-900">{t('submissions.submission')} #{idx + 1}</span>
              <span className="text-sm text-gray-500">{submission.savedAt}</span>
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

  return (
    <div>
      <nav className="bg-gray-900 text-white px-4 py-3 flex justify-center gap-4 sticky top-0 z-10">
        <NavButton
          onClick={() => setPage('challenges')}
          active={page === 'challenges'}
        >
          {t('nav.challenges')}
        </NavButton>
        <NavButton
          onClick={() => setPage('submissions')}
          active={page === 'submissions'}
          disabled={submissions.length === 0}
        >
          {t('nav.submissions')} ({submissions.length})
        </NavButton>
      </nav>
      {page === 'challenges' ? (
        <ChallengesPage data={data} setData={setData} onSave={handleSave} saved={saved} />
      ) : (
        <SubmissionsPage submissions={submissions} />
      )}
    </div>
  );
}