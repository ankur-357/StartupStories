import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Eye, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { RichTextEditor } from '../components/Editor/RichTextEditor';

export function Write() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState('');
  const [published, setPublished] = useState(false);
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCategories();
  }, [user, navigate]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    setCategories(data || []);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, '');
    const wordCount = textContent.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  const handleSave = async (shouldPublish = false) => {
    if (!title.trim() || !content.trim()) {
      alert('Please fill in the title and content');
      return;
    }

    setSaving(true);

    try {
      const slug = generateSlug(title);
      const readingTime = calculateReadingTime(content);
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);

      const caseStudyData = {
        title: title.trim(),
        slug,
        excerpt: excerpt.trim() || null,
        content: content.trim(),
        cover_image: coverImage.trim() || null,
        author_id: user!.id,
        category_id: categoryId || null,
        tags: tagsArray,
        published: shouldPublish,
        reading_time: readingTime,
      };

      const { data, error } = await supabase
        .from('case_studies')
        .insert([caseStudyData])
        .select()
        .single();

      if (error) throw error;

      if (shouldPublish) {
        navigate(`/case-study/${data.slug}`);
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Error saving case study:', error);
      alert('Error saving case study: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Write Your Case Study</h1>
            <div className="flex space-x-3">
              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>Save Draft</span>
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Eye className="w-4 h-4" />
                <span>Publish</span>
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter an engaging title for your case study"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Write a brief summary of your case study"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Cover Image */}
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image URL
              </label>
              <div className="flex space-x-3">
                <input
                  type="url"
                  id="coverImage"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                </button>
              </div>
              {coverImage && (
                <div className="mt-3">
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Category and Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map((category: any) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="startup, growth, marketing (comma separated)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Tell your startup story. Share the challenges, victories, and lessons learned..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}