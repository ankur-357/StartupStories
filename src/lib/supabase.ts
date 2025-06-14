import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          website: string | null;
          twitter: string | null;
          linkedin: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          twitter?: string | null;
          linkedin?: string | null;
        };
        Update: {
          username?: string;
          full_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          twitter?: string | null;
          linkedin?: string | null;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          color: string;
          created_at: string;
        };
      };
      case_studies: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string | null;
          cover_image: string | null;
          author_id: string;
          category_id: string | null;
          tags: string[];
          published: boolean;
          views: number;
          reading_time: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          slug: string;
          excerpt?: string | null;
          content?: string | null;
          cover_image?: string | null;
          author_id: string;
          category_id?: string | null;
          tags?: string[];
          published?: boolean;
          reading_time?: number;
        };
        Update: {
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: string | null;
          cover_image?: string | null;
          category_id?: string | null;
          tags?: string[];
          published?: boolean;
          reading_time?: number;
          updated_at?: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          case_study_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          case_study_id: string;
        };
      };
    };
  };
};