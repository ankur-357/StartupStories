/*
  # Startup Case Study Platform Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `username` (text, unique)
      - `full_name` (text)
      - `bio` (text)
      - `avatar_url` (text)
      - `website` (text)
      - `twitter` (text)
      - `linkedin` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `color` (text)
      - `created_at` (timestamp)

    - `case_studies`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `excerpt` (text)
      - `content` (text)
      - `cover_image` (text)
      - `author_id` (uuid, references profiles)
      - `category_id` (uuid, references categories)
      - `tags` (text array)
      - `published` (boolean)
      - `views` (integer)
      - `reading_time` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `case_study_id` (uuid, references case_studies)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access to published content
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username text UNIQUE NOT NULL,
  full_name text,
  bio text,
  avatar_url text,
  website text,
  twitter text,
  linkedin text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  color text DEFAULT '#3b82f6',
  created_at timestamptz DEFAULT now()
);

-- Create case_studies table
CREATE TABLE IF NOT EXISTS case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text,
  cover_image text,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  tags text[] DEFAULT '{}',
  published boolean DEFAULT false,
  views integer DEFAULT 0,
  reading_time integer DEFAULT 5,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  case_study_id uuid REFERENCES case_studies(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, case_study_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Categories policies
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

-- Case studies policies
CREATE POLICY "Published case studies are viewable by everyone"
  ON case_studies FOR SELECT
  USING (published = true OR auth.uid() = author_id);

CREATE POLICY "Users can insert their own case studies"
  ON case_studies FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own case studies"
  ON case_studies FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own case studies"
  ON case_studies FOR DELETE
  USING (auth.uid() = author_id);

-- Favorites policies
CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Insert default categories
INSERT INTO categories (name, description, color) VALUES
  ('SaaS', 'Software as a Service startups', '#3b82f6'),
  ('E-commerce', 'Online retail and marketplace platforms', '#059669'),
  ('FinTech', 'Financial technology and services', '#dc2626'),
  ('HealthTech', 'Healthcare and medical technology', '#7c3aed'),
  ('EdTech', 'Educational technology platforms', '#ea580c'),
  ('AI/ML', 'Artificial Intelligence and Machine Learning', '#0891b2'),
  ('Mobile Apps', 'Mobile application startups', '#be185d'),
  ('Hardware', 'Physical product and hardware startups', '#65a30d')
ON CONFLICT (name) DO NOTHING;

-- Create function to handle user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to update case study views
CREATE OR REPLACE FUNCTION increment_case_study_views(case_study_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE case_studies 
  SET views = views + 1 
  WHERE id = case_study_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;