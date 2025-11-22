import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { ContentLibraryItem } from '../types';

interface ContentLibraryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  contentLibrary: ContentLibraryItem[];
  onSave: (items: ContentLibraryItem[]) => void;
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

  const handleAddNew = () => {
    setEditingId('new');
    setFormData({
      id: Date.now().toString(),
      title: '',
      youtubeUrl: '',
      channelName: '',
      duration: 3,
      question: '',
      category: 'discipline',
    });
    setValidationStatus('idle');
    setValidationMessage('');
  };

  const handleEdit = (item: ContentLibraryItem) => {
    setEditingId(item.id);
    setFormData(item);
    setValidationStatus('idle');
    setValidationMessage('');
  };

  const validateYouTubeEmbed = async (url: string): Promise<boolean> => {
    try {
      setValidationStatus('checking');
      setValidationMessage('Checking if video can be embedded...');

      // Extract video ID from URL
      const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      if (!videoIdMatch) {
        setValidationStatus('invalid');
        setValidationMessage('Invalid YouTube URL format');
        return false;
      }

      const videoId = videoIdMatch[1];

      // Check embed permissions using YouTube oEmbed API
      const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
      
      try {
        const response = await fetch(oEmbedUrl);
        
        if (response.ok) {
          setValidationStatus('valid');
          setValidationMessage('✓ Video can be embedded successfully!');
          return true;
        } else {
          setValidationStatus('invalid');
          setValidationMessage('✗ Video embedding is disabled by the owner. Please choose a different video.');
          return false;
        }
      } catch (error) {
        // If oEmbed fails, it usually means embedding is restricted
        setValidationStatus('invalid');
        setValidationMessage('✗ Video embedding is disabled by the owner. Please choose a different video.');
        return false;
      }
    } catch (error) {
      setValidationStatus('invalid');
      setValidationMessage('Error checking video. Please verify the URL.');
      return false;
    }
  };

  const handleSaveItem = async () => {
    if (!formData.title || !formData.youtubeUrl || !formData.question) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate embedding if not already validated
    if (validationStatus !== 'valid') {
      const isValid = await validateYouTubeEmbed(formData.youtubeUrl);
      if (!isValid) {
        return; // Don't save if validation fails
      }
    }

    if (editingId === 'new') {
      setItems([...items, formData]);
    } else {
      setItems(items.map(item => (item.id === editingId ? formData : item)));
    }
    setEditingId(null);
    setValidationStatus('idle');
    setValidationMessage('');
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
      <div className="bg-gray-900 rounded-lg max-w-3xl w-full max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-900">
          <h2 className="text-2xl font-bold text-white">Content Library Manager</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
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
                    className="w-full bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        setValidationStatus('idle'); // Reset validation when URL changes
                        setValidationMessage('');
                      }}
                      className="flex-1 bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                    <button
                      type="button"
                      onClick={() => validateYouTubeEmbed(formData.youtubeUrl)}
                      disabled={!formData.youtubeUrl || validationStatus === 'checking'}
                      className="px-4 py-2 bg-yellow-600 text-white font-semibold rounded hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {validationStatus === 'checking' ? 'Testing...' : 'Test Video'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Any YouTube URL format works (watch, embed, or short link)
                  </p>
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

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Duration (minutes)
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
                    className="w-full bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Question *
                  </label>
                  <textarea
                    value={formData.question}
                    onChange={(e) =>
                      setFormData({ ...formData, question: e.target.value })
                    }
                    className="w-full bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., How will you apply this lesson today?"
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
                    className="w-full bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="discipline">Discipline</option>
                    <option value="psychology">Psychology</option>
                    <option value="strategy">Strategy</option>
                    <option value="mindset">Mindset</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveItem}
                    disabled={validationStatus === 'checking'}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    {validationStatus === 'checking' ? 'Validating...' : 'Save Item'}
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 bg-gray-700 text-white font-semibold rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 mb-6"
            >
              <Plus size={20} /> Add Content
            </button>
          )}

          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-gray-800 rounded-lg p-4 flex items-start justify-between"
              >
                <div className="flex-1">
                  <h4 className="text-white font-semibold">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.question}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {item.duration} min • {item.category}
                  </p>
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
            <p className="text-center text-gray-400 py-8">
              No content yet. Add your first video!
            </p>
          )}

          <div className="flex gap-3 mt-8 sticky bottom-0 bg-gray-900 pt-4 border-t border-gray-700">
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
    </div>
  );
};
