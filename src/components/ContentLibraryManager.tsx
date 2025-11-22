import React, { useState } from 'react';
import { X, Plus, Trash2, Search, PlayCircle, Eye, ThumbsUp, Calendar } from 'lucide-react';
import { ContentLibraryItem } from '../types';
import { analyzeTranscript, AnalyzedTags } from '../utils/transcriptAnalyzer';

function formatViewCount(count?: number): string {
  if (!count) return '0 views';
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M views`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K views`;
  return `${count} views`;
}

function formatLikeCount(count?: number): string {
  if (!count) return '0';
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return `${count}`;
}

function formatPublishedDate(dateString?: string): string {
  if (!dateString) return 'Unknown date';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays < 1) return 'Today';
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`;
}

interface ContentLibraryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  contentLibrary: ContentLibraryItem[];
  onSave: (items: ContentLibraryItem[]) => void;
}

interface SearchResult {
  videoId: string;
  title: string;
  channelName: string;
  duration: number;
  durationSeconds: number;
  thumbnail: string;
  description: string;
  youtubeUrl: string;
  viewCount?: number;
  likeCount?: number;
  publishedAt?: string;
}

export const ContentLibraryManager: React.FC<ContentLibraryManagerProps> = ({
  isOpen,
  onClose,
  contentLibrary,
  onSave,
}) => {
  const [items, setItems] = useState<ContentLibraryItem[]>(contentLibrary);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ContentLibraryItem>({
    id: '',
    title: '',
    youtubeUrl: '',
    channelName: '',
    duration: 3,
    question: '',
    category: 'discipline',
  });
  const [validationStatus, setValidationStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [metadataFetched, setMetadataFetched] = useState<boolean>(false);
  
  // Search functionality
  const [activeTab, setActiveTab] = useState<'library' | 'search'>('library');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const [searchMessage, setSearchMessage] = useState<string>('');

  const predefinedSearches = [
    'atomic habits how to start',
    'tiny habits BJ Fogg',
    'habit stacking',
    '2 minute rule habits',
    'how to build new habits',
    'habit formation science'
  ];

  const handleSearch = async (query: string) => {
    setSearching(true);
    setSearchMessage('🔍 Searching YouTube for habit videos...');
    setSearchResults([]);
    
    try {
      const response = await fetch(`/api/youtube/search?query=${encodeURIComponent(query)}&maxResults=12`);
      const data = await response.json();
      
      if (!response.ok) {
        setSearchMessage('✗ ' + (data.error || 'Search failed'));
        setSearching(false);
        return;
      }
      
      setSearchResults(data.videos || []);
      setSearchMessage(`✓ Found ${data.videos?.length || 0} videos under 8 minutes`);
      setSearching(false);
    } catch (error) {
      setSearchMessage('✗ Network error. Make sure backend server is running.');
      setSearching(false);
    }
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleAddFromSearch = async (result: SearchResult) => {
    const newItem: ContentLibraryItem = {
      id: Date.now().toString(),
      title: result.title,
      youtubeUrl: result.youtubeUrl,
      channelName: result.channelName,
      duration: result.duration,
      question: 'What ONE action will you take today based on this video?',
      category: 'strategy',
      viewCount: result.viewCount,
      likeCount: result.likeCount,
      publishedAt: result.publishedAt,
    };
    
    setEditingId(newItem.id);
    setFormData(newItem);
    setActiveTab('library');
    
    await fetchYouTubeMetadata(result.youtubeUrl);
  };

  const handleAddNew = () => {
    setEditingId('new');
    setFormData({
      id: Date.now().toString(),
      title: '',
      youtubeUrl: '',
      channelName: '',
      duration: 3,
      question: 'What ONE action will you take today based on this video?',
      category: 'discipline',
    });
    setValidationStatus('idle');
    setValidationMessage('');
  };

  const handleEdit = (item: ContentLibraryItem) => {
    setEditingId(item.id);
    setFormData({
      ...item,
      question: item.question || 'What ONE action will you take today based on this video?'
    });
    setValidationStatus('idle');
    setValidationMessage('');
    setMetadataFetched(false);
  };

  const fetchYouTubeMetadata = async (url: string): Promise<boolean> => {
    try {
      setValidationStatus('checking');
      setValidationMessage('🔍 Fetching real video data from YouTube...');

      const response = await fetch(`/api/youtube/metadata?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (!response.ok) {
        setValidationStatus('invalid');
        if (response.status === 503) {
          setValidationMessage('⚠️ ' + data.hint || 'YouTube API not configured');
        } else {
          setValidationMessage('✗ ' + (data.error || 'Failed to fetch video data'));
        }
        return false;
      }

      if (data.duration > 8) {
        setValidationStatus('invalid');
        setValidationMessage(`❌ Video is ${data.duration.toFixed(1)} minutes (max 8 minutes). Please choose a shorter video.`);
        return false;
      }

      setValidationMessage('🎬 Fetching transcript for intelligent tag analysis...');
      
      let analyzedTags: AnalyzedTags | null = null;
      let transcriptFetched = false;
      try {
        const transcriptResponse = await fetch(`/api/youtube/transcript?url=${encodeURIComponent(url)}`);
        if (transcriptResponse.ok) {
          const transcriptData = await transcriptResponse.json();
          analyzedTags = analyzeTranscript(transcriptData.transcript, data.title, data.description || '');
          transcriptFetched = true;
          console.log('📊 Auto-analyzed tags from transcript:', analyzedTags);
        } else if (transcriptResponse.status === 404) {
          console.log('📝 No transcript available (captions disabled), using title/description for tag analysis');
          analyzedTags = analyzeTranscript('', data.title, data.description || '');
        } else {
          console.warn('Transcript fetch failed with status:', transcriptResponse.status);
        }
      } catch (transcriptError) {
        console.warn('Could not fetch transcript for tag analysis:', transcriptError);
      }

      setFormData(prev => ({
        ...prev,
        title: data.title,
        channelName: data.channelName,
        duration: Math.ceil(data.duration),
        viewCount: data.viewCount,
        likeCount: data.likeCount,
        publishedAt: data.publishedAt,
        question: prev.question || 'What ONE action will you take today based on this video?',
        tags: analyzedTags ? {
          contentType: analyzedTags.contentType,
          lifeDomain: analyzedTags.lifeDomain,
          difficulty: analyzedTags.difficulty,
          emotion: analyzedTags.emotion,
          technique: analyzedTags.technique
        } : {
          contentType: ['education', 'tutorial'],
          lifeDomain: ['productivity', 'mental'],
          difficulty: 'beginner',
          emotion: ['empowering'],
          technique: []
        }
      }));

      setValidationStatus('valid');
      const tagMessage = transcriptFetched 
        ? 'Tags analyzed from transcript' 
        : analyzedTags 
        ? 'Tags analyzed from title/description' 
        : 'Default tags applied';
      setValidationMessage(`✓ Verified: ${data.duration.toFixed(1)} minutes | ${tagMessage}`);
      setMetadataFetched(true);
      return true;

    } catch (error) {
      setValidationStatus('invalid');
      setValidationMessage('✗ Network error. Make sure the backend server is running.');
      return false;
    }
  };

  const validateYouTubeEmbed = async (url: string): Promise<boolean> => {
    try {
      const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      if (!videoIdMatch) {
        return false;
      }

      const videoId = videoIdMatch[1];
      const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
      
      try {
        const response = await fetch(oEmbedUrl);
        return response.ok;
      } catch (error) {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  const handleSaveItem = async () => {
    if (!formData.title || !formData.youtubeUrl || !formData.question) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.duration > 8) {
      alert('⚠️ Video must be 8 minutes or less. Please choose a shorter video or adjust the duration.');
      return;
    }

    if (!metadataFetched) {
      alert('⚠️ Please verify the video using "Fetch & Verify Video" button first to ensure accurate duration and metadata.');
      return;
    }

    // Additional embedding check
    const canEmbed = await validateYouTubeEmbed(formData.youtubeUrl);
    if (!canEmbed) {
      if (!confirm('⚠️ Video embedding may be disabled. The video might not play in the app. Add anyway?')) {
        return;
      }
    }

    if (editingId === 'new' || !items.find(item => item.id === editingId)) {
      setItems([...items, formData]);
    } else {
      setItems(items.map(item => (item.id === editingId ? formData : item)));
    }
    setEditingId(null);
    setValidationStatus('idle');
    setValidationMessage('');
    setMetadataFetched(false);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSaveAll = () => {
    onSave(items);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg max-w-6xl w-full max-h-screen overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Content Library Manager</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('library')}
            className={`flex-1 px-6 py-3 font-semibold transition-colors ${
              activeTab === 'library'
                ? 'bg-gray-800 text-yellow-400 border-b-2 border-yellow-400'
                : 'bg-gray-900 text-gray-400 hover:text-white'
            }`}
          >
            Library ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 px-6 py-3 font-semibold transition-colors ${
              activeTab === 'search'
                ? 'bg-gray-800 text-yellow-400 border-b-2 border-yellow-400'
                : 'bg-gray-900 text-gray-400 hover:text-white'
            }`}
          >
            <Search className="inline mr-2" size={18} />
            Search YouTube
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'search' ? (
            <div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Search YouTube for habit formation videos
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                    className="flex-1 bg-gray-800 text-white rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="e.g., atomic habits, tiny habits, habit stacking..."
                  />
                  <button
                    onClick={() => handleSearch(searchQuery)}
                    disabled={!searchQuery || searching}
                    className="px-6 py-3 bg-yellow-600 text-white font-semibold rounded hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    {searching ? 'Searching...' : 'Search'}
                  </button>
                </div>
                
                {/* Quick search buttons */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-xs text-gray-400 mr-2">Quick searches:</span>
                  {predefinedSearches.map((query) => (
                    <button
                      key={query}
                      onClick={() => handleQuickSearch(query)}
                      className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded hover:bg-gray-600"
                    >
                      {query}
                    </button>
                  ))}
                </div>

                {searchMessage && (
                  <div className={`mt-3 p-3 rounded text-sm ${
                    searchMessage.startsWith('✓')
                      ? 'bg-green-900/30 border border-green-600 text-green-400'
                      : searchMessage.startsWith('✗')
                      ? 'bg-red-900/30 border border-red-600 text-red-400'
                      : 'bg-blue-900/30 border border-blue-600 text-blue-400'
                  }`}>
                    {searchMessage}
                  </div>
                )}
              </div>

              {/* Search Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((result) => (
                  <div
                    key={result.videoId}
                    className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-yellow-400 transition-all"
                  >
                    <div className="relative">
                      <img
                        src={result.thumbnail}
                        alt={result.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 px-2 py-1 rounded text-xs text-white font-semibold">
                        {result.duration.toFixed(1)} min
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="text-white font-semibold text-sm line-clamp-2 mb-1">
                        {result.title}
                      </h4>
                      <p className="text-gray-400 text-xs mb-2">{result.channelName}</p>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1" title="View count">
                          <Eye size={12} />
                          <span>{formatViewCount(result.viewCount)}</span>
                        </div>
                        <div className="flex items-center gap-1" title="Like count">
                          <ThumbsUp size={12} />
                          <span>{formatLikeCount(result.likeCount)}</span>
                        </div>
                        <div className="flex items-center gap-1" title="Published date">
                          <Calendar size={12} />
                          <span>{formatPublishedDate(result.publishedAt)}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddFromSearch(result)}
                          className="flex-1 px-3 py-2 bg-yellow-600 text-white text-sm font-semibold rounded hover:bg-yellow-700 flex items-center justify-center gap-1"
                        >
                          <Plus size={16} />
                          Add to Library
                        </button>
                        <a
                          href={result.youtubeUrl}
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-red-600 text-white text-sm font-semibold rounded hover:bg-red-700 flex items-center justify-center gap-1"
                          title="Watch on YouTube"
                        >
                          <PlayCircle size={16} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {searchResults.length === 0 && !searching && (
                <div className="text-center text-gray-400 py-12">
                  <Search size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Search for videos to add to your library</p>
                  <p className="text-sm mt-2">Try: "atomic habits", "tiny habits", or "habit stacking"</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              {editingId ? (
                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-bold text-white mb-4">
                    {editingId === 'new' ? 'Add New Content' : 'Edit Content'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="e.g., The Power of Consistency"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        YouTube URL *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.youtubeUrl}
                          onChange={(e) => {
                            setFormData({ ...formData, youtubeUrl: e.target.value });
                            setValidationStatus('idle');
                            setValidationMessage('');
                            setMetadataFetched(false);
                          }}
                          className="flex-1 bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          placeholder="https://www.youtube.com/watch?v=..."
                        />
                        <button
                          type="button"
                          onClick={() => fetchYouTubeMetadata(formData.youtubeUrl)}
                          disabled={!formData.youtubeUrl || validationStatus === 'checking'}
                          className="px-4 py-2 bg-yellow-600 text-white font-semibold rounded hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          {validationStatus === 'checking' ? 'Verifying...' : 'Fetch & Verify'}
                        </button>
                      </div>
                      {validationMessage && (
                        <div className={`mt-2 p-3 rounded text-sm ${
                          validationStatus === 'valid' 
                            ? 'bg-green-900/30 border border-green-600 text-green-400' 
                            : validationStatus === 'invalid'
                            ? 'bg-red-900/30 border border-red-600 text-red-400'
                            : 'bg-blue-900/30 border border-blue-600 text-blue-400'
                        }`}>
                          {validationMessage}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Channel Name
                        </label>
                        <input
                          type="text"
                          value={formData.channelName}
                          onChange={(e) =>
                            setFormData({ ...formData, channelName: e.target.value })
                          }
                          className="w-full bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          placeholder="Auto-filled from YouTube"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Duration (minutes) *
                        </label>
                        <input
                          type="number"
                          value={formData.duration}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              duration: parseInt(e.target.value) || 3,
                            })
                          }
                          className="w-full bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          min="1"
                          max="8"
                        />
                        <p className="text-xs text-yellow-400 mt-1 font-semibold">
                          Max 8 minutes
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Reflection Question *
                      </label>
                      <textarea
                        value={formData.question}
                        onChange={(e) =>
                          setFormData({ ...formData, question: e.target.value })
                        }
                        className="w-full bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="e.g., What ONE action will you take today based on this video?"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            category: e.target.value as any,
                          })
                        }
                        className="w-full bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      >
                        <option value="discipline">Discipline</option>
                        <option value="psychology">Psychology</option>
                        <option value="strategy">Strategy</option>
                        <option value="mindset">Mindset</option>
                      </select>
                    </div>

                    {/* Multi-tag selection system */}
                    <div className="border-t border-gray-700 pt-4">
                      <h4 className="text-white font-semibold mb-3">Video Tags (for personalized recommendations)</h4>
                      
                      {/* Content Type */}
                      <div className="mb-3">
                        <label className="block text-sm font-semibold text-gray-400 mb-2">Content Type</label>
                        <div className="flex flex-wrap gap-2">
                          {['motivation', 'education', 'tutorial', 'inspiration'].map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => {
                                const currentTypes = formData.tags?.contentType || [];
                                const newTypes = currentTypes.includes(type as any)
                                  ? currentTypes.filter(t => t !== type)
                                  : [...currentTypes, type as any];
                                setFormData({
                                  ...formData,
                                  tags: { ...formData.tags, contentType: newTypes }
                                });
                              }}
                              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                formData.tags?.contentType?.includes(type as any)
                                  ? 'bg-yellow-600 text-white'
                                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Life Domain */}
                      <div className="mb-3">
                        <label className="block text-sm font-semibold text-gray-400 mb-2">Life Domain</label>
                        <div className="flex flex-wrap gap-2">
                          {['physical', 'mental', 'productivity', 'business', 'relationships', 'finance', 'creativity'].map((domain) => (
                            <button
                              key={domain}
                              type="button"
                              onClick={() => {
                                const currentDomains = formData.tags?.lifeDomain || [];
                                const newDomains = currentDomains.includes(domain as any)
                                  ? currentDomains.filter(d => d !== domain)
                                  : [...currentDomains, domain as any];
                                setFormData({
                                  ...formData,
                                  tags: { ...formData.tags, lifeDomain: newDomains }
                                });
                              }}
                              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                formData.tags?.lifeDomain?.includes(domain as any)
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              }`}
                            >
                              {domain}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Difficulty */}
                      <div className="mb-3">
                        <label className="block text-sm font-semibold text-gray-400 mb-2">Difficulty</label>
                        <div className="flex gap-2">
                          {['beginner', 'intermediate', 'advanced'].map((level) => (
                            <button
                              key={level}
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  tags: { ...formData.tags, difficulty: level as any }
                                });
                              }}
                              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                                formData.tags?.difficulty === level
                                  ? 'bg-green-600 text-white'
                                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              }`}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Emotion */}
                      <div className="mb-3">
                        <label className="block text-sm font-semibold text-gray-400 mb-2">Emotional Tone</label>
                        <div className="flex flex-wrap gap-2">
                          {['energizing', 'calming', 'empowering', 'reflective'].map((emotion) => (
                            <button
                              key={emotion}
                              type="button"
                              onClick={() => {
                                const currentEmotions = formData.tags?.emotion || [];
                                const newEmotions = currentEmotions.includes(emotion as any)
                                  ? currentEmotions.filter(e => e !== emotion)
                                  : [...currentEmotions, emotion as any];
                                setFormData({
                                  ...formData,
                                  tags: { ...formData.tags, emotion: newEmotions }
                                });
                              }}
                              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                formData.tags?.emotion?.includes(emotion as any)
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              }`}
                            >
                              {emotion}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSaveItem}
                        disabled={validationStatus === 'checking'}
                        className="px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                      >
                        {validationStatus === 'checking' ? 'Validating...' : 'Save Item'}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-6 py-2 bg-gray-700 text-white font-semibold rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleAddNew}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white font-semibold rounded hover:bg-yellow-700 mb-6"
                >
                  <Plus size={20} /> Add Content Manually
                </button>
              )}

              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-800 rounded-lg p-4 flex items-start justify-between hover:bg-gray-750"
                  >
                    <div className="flex-1">
                      <div className="flex items-start gap-2">
                        <h4 className="text-white font-semibold flex-1">{item.title}</h4>
                        <a
                          href={item.youtubeUrl}
                          rel="noopener noreferrer"
                          className="text-red-500 hover:text-red-400 transition-colors"
                          title="Watch on YouTube"
                        >
                          <PlayCircle size={20} />
                        </a>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">{item.channelName}</p>
                      <p className="text-gray-400 text-sm italic mt-1">"{item.question}"</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                        <span>{item.duration} min • {item.category}</span>
                        {item.viewCount && (
                          <div className="flex items-center gap-1" title="View count">
                            <Eye size={12} />
                            <span>{formatViewCount(item.viewCount)}</span>
                          </div>
                        )}
                        {item.likeCount && (
                          <div className="flex items-center gap-1" title="Like count">
                            <ThumbsUp size={12} />
                            <span>{formatLikeCount(item.likeCount)}</span>
                          </div>
                        )}
                        {item.publishedAt && (
                          <div className="flex items-center gap-1" title="Published date">
                            <Calendar size={12} />
                            <span>{formatPublishedDate(item.publishedAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1 bg-gray-700 text-white text-sm rounded hover:bg-gray-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {items.length === 0 && !editingId && (
                <div className="text-center text-gray-400 py-12">
                  <PlayCircle size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="mb-2">No videos in your library yet</p>
                  <p className="text-sm">Search for videos or add them manually</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-700 bg-gray-900">
          <button
            onClick={handleSaveAll}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
          >
            Save All Changes
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-700 text-white font-semibold rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
