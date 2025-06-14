import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface CaseStudy {
    id: string;
    title: string;
    content: string;
    author_id: string;
    created_at: string;
    author: {
        full_name: string;
    };
}

export const CaseStudyDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCaseStudy = async () => {
            try {
                const { data, error } = await supabase
                    .from('case_studies')
                    .select(`
            *,
            author:profiles(full_name)
          `)
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setCaseStudy(data);
            } catch (error) {
                console.error('Error fetching case study:', error);
                navigate('/case-studies');
            } finally {
                setLoading(false);
            }
        };

        fetchCaseStudy();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!caseStudy) {
        return <div>Case study not found</div>;
    }

    const isAuthor = user?.id === caseStudy.author_id;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <article className="prose lg:prose-xl mx-auto">
                <h1 className="text-4xl font-bold mb-4">{caseStudy.title}</h1>
                <div className="flex items-center text-gray-600 mb-8">
                    <span>By {caseStudy.author.full_name}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(caseStudy.created_at).toLocaleDateString()}</span>
                </div>
                {isAuthor && (
                    <div className="mb-8">
                        <button
                            onClick={() => navigate(`/case-studies/${id}/edit`)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            Edit Case Study
                        </button>
                    </div>
                )}
                <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: caseStudy.content }}
                />
            </article>
        </div>
    );
}; 