import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface DashboardStats {
    totalCaseStudies: number;
    totalViews: number;
    recentCaseStudies: Array<{
        id: string;
        title: string;
        created_at: string;
        views: number;
    }>;
}

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats>({
        totalCaseStudies: 0,
        totalViews: 0,
        recentCaseStudies: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) {
                navigate('/login');
                return;
            }

            try {
                const { data: caseStudies, error: caseStudiesError } = await supabase
                    .from('case_studies')
                    .select('*')
                    .eq('author_id', user.id)
                    .order('created_at', { ascending: false });

                if (caseStudiesError) throw caseStudiesError;

                const totalViews = caseStudies.reduce((sum, study) => sum + (study.views || 0), 0);

                setStats({
                    totalCaseStudies: caseStudies.length,
                    totalViews,
                    recentCaseStudies: caseStudies.slice(0, 5),
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user, navigate]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
                <button
                    onClick={() => navigate('/write')}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                    Write New Case Study
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Total Case Studies</h3>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.totalCaseStudies}</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Total Views</h3>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.totalViews}</p>
                </div>
            </div>

            {/* Recent Case Studies */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                    <h2 className="text-lg sm:text-xl font-semibold">Recent Case Studies</h2>
                </div>
                <div className="divide-y divide-gray-200">
                    {stats.recentCaseStudies.length > 0 ? (
                        stats.recentCaseStudies.map((study) => (
                            <div
                                key={study.id}
                                className="p-4 sm:p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => navigate(`/case-studies/${study.id}`)}
                            >
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                    <div>
                                        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">{study.title}</h3>
                                        <p className="text-sm text-gray-500">
                                            {new Date(study.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {study.views || 0} views
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 sm:p-6 text-center text-gray-500">
                            No case studies yet. Start writing your first case study!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}; 