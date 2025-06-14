import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Users, BookOpen, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CaseStudyGrid } from '../components/CaseStudy/CaseStudyGrid';

export function Home() {
  const [featuredCaseStudies, setFeaturedCaseStudies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      // Fetch featured case studies
      const { data: caseStudies } = await supabase
        .from('case_studies')
        .select(`
          *,
          author:profiles(*),
          category:categories(*)
        `)
        .eq('published', true)
        .order('views', { ascending: false })
        .limit(6);

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      setFeaturedCaseStudies(caseStudies || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Discover Inspiring
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}Startup Stories
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Learn from the journeys of successful entrepreneurs. Read detailed case studies, 
              discover growth strategies, and get inspired by real startup stories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Start Reading</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/write"
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors"
              >
                Share Your Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">500+</h3>
              <p className="text-gray-600">Case Studies</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">10K+</h3>
              <p className="text-gray-600">Entrepreneurs</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">$2B+</h3>
              <p className="text-gray-600">Funding Raised</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Dive into specific industries and discover the strategies that drive success
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category: any) => (
              <Link
                key={category.id}
                to={`/category/${category.name.toLowerCase()}`}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 text-center group"
              >
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Case Studies */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Stories</h2>
              <p className="text-gray-600">Most popular case studies from our community</p>
            </div>
            <Link
              to="/case-studies"
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-2"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <CaseStudyGrid caseStudies={featuredCaseStudies} loading={loading} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Share Your Startup Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of entrepreneurs sharing their stories and insights with the community.
          </p>
          <Link
            to="/signup"
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
          >
            <Star className="w-5 h-5" />
            <span>Get Started Today</span>
          </Link>
        </div>
      </section>
    </div>
  );
}