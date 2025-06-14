import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface CaseStudy {
    id: string;
    title: string;
    content: string;
    author_id: string;
}

export const EditCaseStudy: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchCaseStudy = async () => {
            try {
                const { data, error } = await supabase
                    .from('case_studies')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;

                if (data.author_id !== user?.id) {
                    navigate('/case-studies');
                    return;
                }

                setCaseStudy(data);
                setTitle(data.title);
                setContent(data.content);
            } catch (error) {
                console.error('Error fetching case study:', error);
                navigate('/case-studies');
            } finally {
                setLoading(false);
            }
        };

        fetchCaseStudy();
    }, [id, navigate, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const { error } = await supabase
                .from('case_studies')
                .update({
                    title,
                    content,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', id);

            if (error) throw error;
            navigate(`/case-studies/${id}`);
        } catch (error) {
            console.error('Error updating case study:', error);
            alert('Failed to update case study. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Edit Case Study</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                    </label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={15}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(`/case-studies/${id}`)}
                        className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}; 