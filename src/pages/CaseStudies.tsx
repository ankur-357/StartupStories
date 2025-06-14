import React, { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CaseStudyGrid } from '../components/CaseStudy/CaseStudyGrid';

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface CaseStudy {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  cover_image?: string;
  author: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
  category?: {
    name: string;
    color: string;
  };
  reading_time: number;
  views: number;
  created_at: string;
}

export function CaseStudies() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('created_at');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCaseStudies();
  }, [searchQuery, selectedCategory, sortBy]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    setCategories(data || []);
  };

  const fetchCaseStudies = async () => {
    setLoading(true);

    let query = supabase
      .from('case_studies')
      .select(`
        *,
        author:profiles(*),
        category:categories(*)
      `)
      .eq('published', true);

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`);
    }

    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory);
    }

    if (sortBy === 'views') {
      query = query.order('views', { ascending: false });
    } else if (sortBy === 'created_at') {
      query = query.order('created_at', { ascending: false });
    }

    const { data } = await query;
    setCaseStudies(data || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Case Studies</h1>
          <p className="text-gray-600">
            Discover inspiring startup stories and learn from successful entrepreneurs
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search case studies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="created_at">Latest</option>
              <option value="views">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <CaseStudyGrid caseStudies={caseStudies} loading={loading} />
      </div>
    </div>
  );
}