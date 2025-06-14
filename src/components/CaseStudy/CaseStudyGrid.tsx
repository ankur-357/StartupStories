import React from 'react';
import { CaseStudyCard } from './CaseStudyCard';

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

interface CaseStudyGridProps {
  caseStudies: CaseStudy[];
  loading?: boolean;
}

export function CaseStudyGrid({ caseStudies, loading = false }: CaseStudyGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="aspect-video bg-gray-200 animate-pulse" />
            <div className="p-6">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-3" />
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-3" />
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                  <div className="space-y-1">
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
                    <div className="h-2 bg-gray-200 rounded animate-pulse w-16" />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-12" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-8" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (caseStudies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No case studies found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {caseStudies.map((caseStudy) => (
        <CaseStudyCard
          key={caseStudy.id}
          id={caseStudy.id}
          title={caseStudy.title}
          excerpt={caseStudy.excerpt || ''}
          slug={caseStudy.slug}
          coverImage={caseStudy.cover_image}
          author={{
            username: caseStudy.author.username,
            fullName: caseStudy.author.full_name || caseStudy.author.username,
            avatarUrl: caseStudy.author.avatar_url,
          }}
          category={caseStudy.category}
          readingTime={caseStudy.reading_time}
          views={caseStudy.views}
          createdAt={caseStudy.created_at}
        />
      ))}
    </div>
  );
}