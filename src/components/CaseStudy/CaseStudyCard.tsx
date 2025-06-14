import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, Heart, User } from 'lucide-react';

interface CaseStudyCardProps {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  coverImage?: string;
  author: {
    username: string;
    fullName: string;
    avatarUrl?: string;
  };
  category?: {
    name: string;
    color: string;
  };
  readingTime: number;
  views: number;
  createdAt: string;
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
}

export function CaseStudyCard({
  id,
  title,
  excerpt,
  slug,
  coverImage,
  author,
  category,
  readingTime,
  views,
  createdAt,
  isFavorited = false,
  onToggleFavorite,
}: CaseStudyCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Cover Image */}
      {coverImage && (
        <div className="aspect-video overflow-hidden">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6">
        {/* Category */}
        {category && (
          <div className="mb-3">
            <span
              className="inline-block px-3 py-1 text-xs font-medium rounded-full text-white"
              style={{ backgroundColor: category.color }}
            >
              {category.name}
            </span>
          </div>
        )}

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          <Link to={`/case-studies/${id}`}>{title}</Link>
        </h2>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>

        {/* Author and Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              {author.avatarUrl ? (
                <img
                  src={author.avatarUrl}
                  alt={author.fullName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-white" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{author.fullName}</p>
              <p className="text-xs text-gray-500">@{author.username}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{readingTime} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{views}</span>
            </div>
            {onToggleFavorite && (
              <button
                onClick={onToggleFavorite}
                className={`flex items-center space-x-1 hover:text-red-500 transition-colors ${isFavorited ? 'text-red-500' : ''
                  }`}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Date */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">{formatDate(createdAt)}</p>
        </div>
      </div>
    </article>
  );
}