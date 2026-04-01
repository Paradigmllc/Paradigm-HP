-- ============================================================
-- paradigmjp.com CMS Tables Migration
-- Supabase Project: yihdmgtxiqfdgdueolub (appexx-studio)
-- Created: 2026-04-01
-- ============================================================

-- ─── 1. cms_posts ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cms_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text,
  content text,
  category text,
  tags text[] DEFAULT '{}',
  read_time text,
  status text DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_cms_posts_slug ON cms_posts (slug);
CREATE INDEX idx_cms_posts_status ON cms_posts (status);
CREATE INDEX idx_cms_posts_category ON cms_posts (category);
CREATE INDEX idx_cms_posts_published_at ON cms_posts (published_at DESC);

-- ─── 2. cms_services ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cms_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id text UNIQUE NOT NULL,
  icon text,
  title text NOT NULL,
  tagline text,
  description text,
  features text[] DEFAULT '{}',
  results text,
  color text,
  sort_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_cms_services_service_id ON cms_services (service_id);
CREATE INDEX idx_cms_services_sort_order ON cms_services (sort_order);

-- ─── 3. cms_pricing ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cms_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id text NOT NULL,
  plan_name text NOT NULL,
  price text,
  period text,
  description text,
  features text[] DEFAULT '{}',
  is_popular boolean DEFAULT false,
  sort_order int DEFAULT 0,
  monthly_note text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_cms_pricing_service_id ON cms_pricing (service_id);
CREATE INDEX idx_cms_pricing_sort_order ON cms_pricing (sort_order);

-- ─── 4. cms_faqs ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cms_faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  sort_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_cms_faqs_sort_order ON cms_faqs (sort_order);

-- ─── 5. cms_works ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cms_works (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  industry text,
  description text,
  metrics text,
  tags text[] DEFAULT '{}',
  color text,
  sort_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_cms_works_sort_order ON cms_works (sort_order);

-- ─── 6. cms_settings ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cms_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_cms_settings_key ON cms_settings (key);

-- ─── 7. cms_media ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cms_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  url text NOT NULL,
  alt_text text,
  mime_type text,
  size_bytes int,
  created_at timestamptz DEFAULT now()
);

-- ─── updated_at trigger ─────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_cms_posts_updated_at
  BEFORE UPDATE ON cms_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_cms_services_updated_at
  BEFORE UPDATE ON cms_services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_cms_pricing_updated_at
  BEFORE UPDATE ON cms_pricing
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_cms_faqs_updated_at
  BEFORE UPDATE ON cms_faqs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_cms_works_updated_at
  BEFORE UPDATE ON cms_works
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_cms_settings_updated_at
  BEFORE UPDATE ON cms_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── RLS Policies ───────────────────────────────────────────
-- Enable RLS on all tables
ALTER TABLE cms_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_media ENABLE ROW LEVEL SECURITY;

-- Service role: full access
CREATE POLICY "service_role_all_cms_posts" ON cms_posts
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "service_role_all_cms_services" ON cms_services
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "service_role_all_cms_pricing" ON cms_pricing
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "service_role_all_cms_faqs" ON cms_faqs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "service_role_all_cms_works" ON cms_works
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "service_role_all_cms_settings" ON cms_settings
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "service_role_all_cms_media" ON cms_media
  FOR ALL USING (auth.role() = 'service_role');

-- Anon: read-only for published content (public website)
CREATE POLICY "anon_read_published_posts" ON cms_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "anon_read_active_services" ON cms_services
  FOR SELECT USING (is_active = true);

CREATE POLICY "anon_read_pricing" ON cms_pricing
  FOR SELECT USING (true);

CREATE POLICY "anon_read_active_faqs" ON cms_faqs
  FOR SELECT USING (is_active = true);

CREATE POLICY "anon_read_active_works" ON cms_works
  FOR SELECT USING (is_active = true);

CREATE POLICY "anon_read_settings" ON cms_settings
  FOR SELECT USING (true);

CREATE POLICY "anon_read_media" ON cms_media
  FOR SELECT USING (true);
