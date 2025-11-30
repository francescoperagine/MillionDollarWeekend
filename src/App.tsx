import { useState } from 'react';

const STORAGE_KEY = 'mdw_chapter3_challenges';

interface Field {
  id: string;
  label: string;
  type: 'text' | 'textarea';
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  instruction: string;
  fields: Field[];
}

interface ChallengeData {
  [fieldId: string]: string;
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

const challenges: Challenge[] = [
  {
    id: 'target_groups',
    title: 'Challenge 1: Top Three Groups',
    description: "Before you even think about picking a business idea, make sure you have easy access to the people you want to help. Think about where you have easy access to a targeted group of people whom you really want to help—like new moms in Austin, cyclists, freelance writers, or taco obsessives.",
    instruction: "Who do you have easy access to that you'd be EXCITED to help? This can be your neighbors, colleagues, religious friends, golf buddies, cooking friends, etc.",
    fields: [
      { id: 'group1', label: 'Group 1', type: 'text' },
      { id: 'group2', label: 'Group 2', type: 'text' },
      { id: 'group3', label: 'Group 3', type: 'text' }
    ]
  },
  {
    id: 'solve_problems',
    title: 'Challenge 2: Solve Your Own Problems',
    description: "The best entrepreneurs are the most dissatisfied. Your frustrations—and the frustrations of others—are your business opportunities. Great ideas come from being a problem seeker.",
    instruction: "Use these four questions to find three ideas:\n\n1. What is one thing this morning that irritated me?\n2. What is one thing on my to-do list that's been there over a week?\n3. What is one thing that I regularly fail to do well?\n4. What is one thing I wanted to buy recently only to find out that no one made it?",
    fields: [
      { id: 'idea1', label: 'Business Idea 1', type: 'textarea' },
      { id: 'idea2', label: 'Business Idea 2', type: 'textarea' },
      { id: 'idea3', label: 'Business Idea 3', type: 'textarea' }
    ]
  },
  {
    id: 'bestsellers',
    title: 'Challenge 3: Bestsellers Are Your Best Friends',
    description: "What products are already selling a crap-ton? iPads, iPhones, etc. Basically, any product you'd find on Amazon's Bestseller list would work here. It's easier to sell to a large group of people who've already spent money on a product or service.",
    instruction: "How can you accessorize a popular product (for example, stickers for an iPhone) or sell a service to those people (teaching someone how to use an iPhone)?\n\nExamples: Customizing Nike shoes, Video game tutorial for an Xbox game, Teaching computer novices how to use a MacBook.\n\nWrite down two accessorizing ideas:",
    fields: [
      { id: 'accessory1', label: 'Accessorizing Idea 1', type: 'textarea' },
      { id: 'accessory2', label: 'Accessorizing Idea 2', type: 'textarea' }
    ]
  },
  {
    id: 'marketplaces',
    title: 'Challenge 4: Marketplaces',
    description: "One of Noah's favorite ways to find ideas is by studying the marketplaces where people are TRYING to spend money. Your potential customers are everywhere already asking in public for solutions—on message boards, in Facebook posts, in tweets, in church groups.",
    instruction: "Visit a marketplace like Etsy, Facebook Marketplace, Craigslist, or eBay. Look for frequent requests from people actively searching for someone to give their money to. Check completed listings on eBay to see how well certain products are selling.\n\nWrite at least one idea for a product or service:",
    fields: [
      { id: 'marketplace_idea', label: 'Marketplace Idea', type: 'textarea' }
    ]
  },
  {
    id: 'search_queries',
    title: 'Challenge 5: Search Engine Queries',
    description: "It's much easier to sell something when people ALREADY want it. There are 3 billion Google searches every day, giving you a direct line to customers' thoughts and needs. Work backwards from a problem people want solved (a query) toward a solution they may be willing to pay for.",
    instruction: "Try searching for questions like:\n• \"How do I train my cat to use a toilet?\"\n• \"Best places to travel with a family?\"\n• \"Where can I rent a bike in Barcelona?\"\n\nUse tools like AnswerThePublic.com or go to Reddit's r/SomebodyMakeThis subreddit where people are ACTIVELY offering up ideas.\n\nAsk yourself: Is the potential solution a vitamin (nice-to-have) or a painkiller (must-have)?\n\nWrite two ideas:",
    fields: [
      { id: 'search_idea1', label: 'Search/Reddit Idea 1', type: 'textarea' },
      { id: 'search_idea2', label: 'Search/Reddit Idea 2', type: 'textarea' }
    ]
  },
  {
    id: 'ten_ideas',
    title: 'Final: Your Ten Ideas',
    description: "You should now have a list of ten ideas (or more!) from the four challenges above. Write them all down here. There's never a \"perfect\" idea—your idea will evolve over time, just as all businesses do.",
    instruction: "Write your ten ideas. Then eliminate the ones you're not excited about. If the top three are screaming \"Me! Me! Me!\" your work is done. If you can't decide, choose the ones you believe will be easiest to implement—and that you (and ideally other customers) would be thrilled to spend money on.",
    fields: [
      { id: 'idea_1', label: '1.', type: 'text' },
      { id: 'idea_2', label: '2.', type: 'text' },
      { id: 'idea_3', label: '3.', type: 'text' },
      { id: 'idea_4', label: '4.', type: 'text' },
      { id: 'idea_5', label: '5.', type: 'text' },
      { id: 'idea_6', label: '6.', type: 'text' },
      { id: 'idea_7', label: '7.', type: 'text' },
      { id: 'idea_8', label: '8.', type: 'text' },
      { id: 'idea_9', label: '9.', type: 'text' },
      { id: 'idea_10', label: '10.', type: 'text' }
    ]
  },
  {
    id: 'top_three',
    title: 'Pick Your Top 3 Ideas',
    description: "Now pick the three best ideas from your list above. These are the ideas you'll evaluate in Chapter 4 with the One-Minute Business Model.",
    instruction: "Choose the ideas that:\n• You're most excited about\n• Will be easiest to implement\n• You (and customers) would pay for",
    fields: [
      { id: 'top1', label: 'Top Idea #1', type: 'text' },
      { id: 'top2', label: 'Top Idea #2', type: 'text' },
      { id: 'top3', label: 'Top Idea #3', type: 'text' }
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
  const handleChange = (challengeId: string, fieldId: string, value: string) => {
    setData(prev => ({
      ...prev,
      [challengeId]: { ...prev[challengeId], [fieldId]: value }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Million Dollar Weekend</h1>
          <h2 className="text-xl text-amber-600 font-semibold">Chapter 3: Finding Million-Dollar Ideas</h2>
          <p className="text-gray-600 mt-2">Simple Exercises to Generate Profitable Business Ideas</p>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-amber-500 focus:border-amber-500"
                      rows={3}
                      value={data[challenge.id]?.[field.id] || ''}
                      onChange={e => handleChange(challenge.id, field.id, e.target.value)}
                      placeholder="Write your answer here..."
                    />
                  ) : (
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-amber-500 focus:border-amber-500"
                      value={data[challenge.id]?.[field.id] || ''}
                      onChange={e => handleChange(challenge.id, field.id, e.target.value)}
                      placeholder="Write your answer here..."
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-4 sticky bottom-4">
          <span className={`text-sm ${saved ? 'text-green-600' : 'text-gray-500'}`}>
            {saved ? '✓ Saved!' : 'Unsaved changes'}
          </span>
          <button
            onClick={onSave}
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-6 rounded-md transition"
          >
            Save Progress
          </button>
        </div>
      </div>
    </div>
  );
}

interface SubmissionsPageProps {
  submissions: Submission[];
}

function SubmissionsPage({ submissions }: SubmissionsPageProps) {
  if (!submissions || submissions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Saved Submissions</h1>
          <p className="text-gray-600">No submissions yet. Complete the challenges and save your progress!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Saved Submissions</h1>
        {submissions.map((submission, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-md p-6 mb-4">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <span className="font-semibold text-gray-900">Submission #{idx + 1}</span>
              <span className="text-sm text-gray-500">{submission.savedAt}</span>
            </div>
            {challenges.map(challenge => {
              const challengeData = submission.data[challenge.id];
              if (!challengeData) return null;
              const hasContent = Object.values(challengeData).some(v => v && v.trim());
              if (!hasContent) return null;
              return (
                <div key={challenge.id} className="mb-4">
                  <h4 className="font-medium text-amber-600 text-sm mb-2">{challenge.title}</h4>
                  <div className="pl-3 border-l-2 border-gray-200">
                    {challenge.fields.map(field => {
                      const val = challengeData[field.id];
                      if (!val || !val.trim()) return null;
                      return (
                        <div key={field.id} className="mb-2">
                          <span className="text-xs text-gray-500">{field.label}:</span>
                          <p className="text-sm text-gray-800">{val}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
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
        <button
          onClick={() => setPage('challenges')}
          className={`px-4 py-1 rounded ${page === 'challenges' ? 'bg-amber-500' : 'hover:bg-gray-700'}`}
        >
          Challenges
        </button>
        <button
          onClick={() => setPage('submissions')}
          className={`px-4 py-1 rounded ${page === 'submissions' ? 'bg-amber-500' : 'hover:bg-gray-700'}`}
        >
          Submissions ({submissions.length})
        </button>
      </nav>
      {page === 'challenges' ? (
        <ChallengesPage data={data} setData={setData} onSave={handleSave} saved={saved} />
      ) : (
        <SubmissionsPage submissions={submissions} />
      )}
    </div>
  );
}