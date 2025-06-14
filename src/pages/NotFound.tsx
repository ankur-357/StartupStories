import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
            <p className="text-gray-600 mb-8 text-center max-w-md">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link
                to="/"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                Return Home
            </Link>
        </div>
    );
}; 