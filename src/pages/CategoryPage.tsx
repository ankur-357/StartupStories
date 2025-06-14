import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CaseStudyGrid } from '../components/CaseStudy/CaseStudyGrid';

interface Category {
    id: string;
    name: string;
    description: string;
    color: string;
}

export const CategoryPage: React.FC = () => {
    const { categoryName } = useParams<{ categoryName: string }>();
    const [category, setCategory] = useState<Category | null>(null);
    const [caseStudies, setCaseStudies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                // First, get the category details
                const { data: categoryData, error: categoryError } = await supabase
                    .from('categories')
                    .select('*')
                    .ilike('name', categoryName || '')
                    .single();

                if (categoryError) throw categoryError;
                setCategory(categoryData);

                // Then, get all case studies for this category
                const { data: caseStudiesData, error: caseStudiesError } = await supabase
                    .from('case_studies')
                    .select(`
            *,
            author:profiles(*),
            category:categories(*)
          `)
                    .eq('category_id', categoryData.id)
                    .eq('published', true)
                    .order('created_at', { ascending: false });

                if (caseStudiesError) throw caseStudiesError;
                setCaseStudies(caseStudiesData || []);
            } catch (error) {
                console.error('Error fetching category data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryData();
    }, [categoryName]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Category Not Found</h2>
                    <p className="text-gray-600">The category you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Category Header */}
            <div className="mb-12">
                <div
                    className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}20` }}
                >
                    <div
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: category.color }}
                    />
                </div>
                <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
                    {category.name}
                </h1>
                <p className="text-xl text-gray-600 text-center max-w-2xl mx-auto">
                    {category.description}
                </p>
            </div>

            {/* Case Studies Grid */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {caseStudies.length} Case Studies
                </h2>
                <CaseStudyGrid caseStudies={caseStudies} loading={loading} />
            </div>
        </div>
    );
}; 