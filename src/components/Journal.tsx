'use client';

import { useState, useEffect } from 'react';
import { useApp, useAppActions } from '@/context/AppContext';
import { JournalEntry } from '@/types';
import { localStorage } from '@/utils/storage';
import { Calendar, Save, BookOpen, Search, Filter, Plus, Edit3, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface JournalProps {
  className?: string;
}

// Predefined journal prompts based on TMS therapy
const JOURNAL_PROMPTS = [
  {
    category: 'Emotional Awareness',
    prompts: [
      "What emotions am I feeling right now, and what might be causing them?",
      "What situations or people in my life cause me the most stress?",
      "What am I most angry about, even if I don't usually express it?",
      "What pressures do I put on myself that others don't put on me?",
      "What would I say if I could express my feelings without any consequences?"
    ]
  },
  {
    category: 'Perfectionism & Control',
    prompts: [
      "In what areas of my life do I demand perfection from myself?",
      "What would happen if I let go of control in one area of my life?",
      "How do I react when things don't go according to my plans?",
      "What standards do I hold myself to that I wouldn't expect from others?",
      "Where in my life do I feel like I 'should' be doing better?"
    ]
  },
  {
    category: 'Relationships & People-Pleasing',
    prompts: [
      "When do I say 'yes' when I really want to say 'no'?",
      "What relationships in my life feel draining or one-sided?",
      "How do I handle conflict, and what does that say about me?",
      "What do I wish I could tell someone but haven't?",
      "In what ways do I sacrifice my own needs for others?"
    ]
  },
  {
    category: 'Childhood & Past',
    prompts: [
      "What messages about emotions did I learn as a child?",
      "How did my family handle anger, sadness, or conflict?",
      "What did I have to do as a child to feel loved or accepted?",
      "What patterns from my childhood am I still repeating today?",
      "What would my child self want to tell my adult self?"
    ]
  },
  {
    category: 'Pain & Body Connection',
    prompts: [
      "When does my pain seem to get worse or better?",
      "What was happening in my life when my pain first started?",
      "How does my pain change when I'm stressed vs. relaxed?",
      "What emotions come up when I think about being pain-free?",
      "What would I do differently if I didn't have this pain?"
    ]
  }
];

const EMOTIONAL_TAGS = [
  'angry', 'frustrated', 'sad', 'anxious', 'overwhelmed', 'guilty', 'ashamed',
  'peaceful', 'hopeful', 'grateful', 'confident', 'relieved', 'energized',
  'confused', 'lonely', 'excited', 'content', 'worried', 'proud'
];

export default function Journal({ className = "" }: JournalProps) {
  const { state } = useApp();
  const { addJournalEntry } = useAppActions();
  
  const [isWriting, setIsWriting] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    // Load journal entries from treatment progress
    if (state.treatmentProgress?.journalEntries) {
      setEntries(state.treatmentProgress.journalEntries);
    }
  }, [state.treatmentProgress]);

  const handleSaveEntry = () => {
    if (!response.trim()) return;

    const prompt = selectedPrompt || customPrompt;
    if (!prompt.trim()) return;

    const newEntry: JournalEntry = {
      date: new Date(),
      prompt: prompt.trim(),
      response: response.trim(),
      emotionalTags: selectedTags
    };

    // Add to state and save to storage
    addJournalEntry(newEntry);
    
    // Update local entries
    setEntries(prev => [newEntry, ...prev]);

    // Reset form
    setResponse('');
    setSelectedPrompt('');
    setCustomPrompt('');
    setSelectedTags([]);
    setIsWriting(false);
  };

  const handleUpdateEntry = () => {
    if (!editingEntry || !response.trim()) return;

    const updatedEntry = {
      ...editingEntry,
      response: response.trim(),
      emotionalTags: selectedTags
    };

    // Update entries
    const updatedEntries = entries.map(entry => 
      entry.date.getTime() === editingEntry.date.getTime() ? updatedEntry : entry
    );
    setEntries(updatedEntries);

    // Update treatment progress
    if (state.treatmentProgress) {
      const updatedProgress = {
        ...state.treatmentProgress,
        journalEntries: updatedEntries
      };
      localStorage.saveTreatmentProgress(updatedProgress);
    }

    // Reset editing state
    setEditingEntry(null);
    setResponse('');
    setSelectedTags([]);
  };

  const handleDeleteEntry = (entryToDelete: JournalEntry) => {
    const updatedEntries = entries.filter(entry => 
      entry.date.getTime() !== entryToDelete.date.getTime()
    );
    setEntries(updatedEntries);

    // Update treatment progress
    if (state.treatmentProgress) {
      const updatedProgress = {
        ...state.treatmentProgress,
        journalEntries: updatedEntries
      };
      localStorage.saveTreatmentProgress(updatedProgress);
    }
  };

  const startEditing = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setResponse(entry.response);
    setSelectedTags(entry.emotionalTags);
    setIsWriting(true);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = searchTerm === '' || 
      entry.response.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || 
      entry.emotionalTags.some(tag => tag.toLowerCase().includes(filterCategory.toLowerCase()));
    
    return matchesSearch && matchesCategory;
  });

  if (!state.user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please complete your assessment to access journaling.</p>
      </div>
    );
  }

  return (
    <div className={`journal-container ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">TMS Journal</h2>
        <p className="text-gray-600">
          Explore your emotions and thoughts to understand the connection between your mind and body.
        </p>
      </div>

      {/* Writing Interface */}
      {isWriting ? (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingEntry ? 'Edit Entry' : 'New Journal Entry'}
            </h3>
            <button
              onClick={() => {
                setIsWriting(false);
                setEditingEntry(null);
                setResponse('');
                setSelectedPrompt('');
                setCustomPrompt('');
                setSelectedTags([]);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          {!editingEntry && (
            <>
              {/* Prompt Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose a prompt or write your own:
                </label>
                
                {/* Predefined Prompts */}
                <div className="space-y-3 mb-4">
                  {JOURNAL_PROMPTS.map((category) => (
                    <div key={category.category}>
                      <h4 className="text-sm font-medium text-gray-800 mb-2">{category.category}</h4>
                      <div className="space-y-1">
                        {category.prompts.map((prompt, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSelectedPrompt(prompt);
                              setCustomPrompt('');
                            }}
                            className={`w-full text-left p-3 rounded-lg border transition-colors ${
                              selectedPrompt === prompt
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <p className="text-sm">{prompt}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Custom Prompt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or write your own prompt:
                  </label>
                  <textarea
                    value={customPrompt}
                    onChange={(e) => {
                      setCustomPrompt(e.target.value);
                      setSelectedPrompt('');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={2}
                    placeholder="What would you like to explore today?"
                  />
                </div>
              </div>
            </>
          )}

          {/* Response Area */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your response:
            </label>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows={8}
              placeholder="Write freely about your thoughts and feelings..."
            />
          </div>

          {/* Emotional Tags */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How are you feeling? (select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOTIONAL_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={editingEntry ? handleUpdateEntry : handleSaveEntry}
              disabled={!response.trim() || (!selectedPrompt && !customPrompt.trim() && !editingEntry)}
              className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{editingEntry ? 'Update Entry' : 'Save Entry'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* New Entry Button */
        <div className="mb-8">
          <button
            onClick={() => setIsWriting(true)}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>New Journal Entry</span>
          </button>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search your entries..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Emotions</option>
              <option value="angry">Anger/Frustration</option>
              <option value="sad">Sadness</option>
              <option value="anxious">Anxiety/Worry</option>
              <option value="peaceful">Peace/Calm</option>
              <option value="hopeful">Hope/Optimism</option>
            </select>
          </div>
        </div>
      </div>

      {/* Journal Entries */}
      <div className="space-y-6">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No entries yet</h3>
            <p className="text-gray-600 mb-4">
              Start your healing journey by writing your first journal entry.
            </p>
            <button
              onClick={() => setIsWriting(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Write Your First Entry
            </button>
          </div>
        ) : (
          filteredEntries.map((entry, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {format(entry.date, 'MMMM d, yyyy \'at\' h:mm a')}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => startEditing(entry)}
                    className="text-gray-400 hover:text-indigo-600"
                    title="Edit entry"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEntry(entry)}
                    className="text-gray-400 hover:text-red-600"
                    title="Delete entry"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Prompt:</h4>
                <p className="text-gray-700 italic">{entry.prompt}</p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Response:</h4>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{entry.response}</p>
                </div>
              </div>

              {entry.emotionalTags.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Emotions:</h4>
                  <div className="flex flex-wrap gap-2">
                    {entry.emotionalTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
