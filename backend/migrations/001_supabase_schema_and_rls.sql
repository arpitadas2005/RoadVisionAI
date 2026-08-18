-- ==============================================================================
-- ROADVISIONAI / SMART ROAD DAMAGE - SUPABASE POSTGRESQL SCHEMA & RLS MIGRATION
-- ==============================================================================

-- 1. Create Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    organization TEXT DEFAULT 'Road Infrastructure Ops',
    role TEXT DEFAULT 'operator',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Profiles SELECT: Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Profiles INSERT: Users can create own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Profiles UPDATE: Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- 2. Create Detections Table
CREATE TABLE IF NOT EXISTS public.detections (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    input_type TEXT DEFAULT 'image',
    overall_condition TEXT NOT NULL,
    overall_severity TEXT NOT NULL,
    road_condition_score INT DEFAULT 75,
    detection_count INT DEFAULT 0,
    processing_time_ms INT DEFAULT 140,
    location_name TEXT DEFAULT 'Survey Sector B-4',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Detections Performance Indexes
CREATE INDEX IF NOT EXISTS idx_detections_user_id ON public.detections(user_id);
CREATE INDEX IF NOT EXISTS idx_detections_created_at ON public.detections(created_at DESC);

-- Enable RLS on Detections
ALTER TABLE public.detections ENABLE ROW LEVEL SECURITY;

-- Detections RLS Policies
CREATE POLICY "Detections SELECT: Users can view own detections"
    ON public.detections FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Detections INSERT: Users can insert own detections"
    ON public.detections FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Detections UPDATE: Users can update own detections"
    ON public.detections FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Detections DELETE: Users can delete own detections"
    ON public.detections FOR DELETE
    USING (auth.uid() = user_id);

-- 3. Create Damage Detections Bounding Boxes Table
CREATE TABLE IF NOT EXISTS public.damage_detections (
    id TEXT PRIMARY KEY,
    detection_id TEXT NOT NULL REFERENCES public.detections(id) ON DELETE CASCADE,
    damage_type TEXT NOT NULL,
    label TEXT NOT NULL,
    confidence DOUBLE PRECISION NOT NULL,
    severity TEXT NOT NULL,
    bounding_box TEXT NOT NULL,
    description TEXT,
    recommended_action TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_damage_detections_detection_id ON public.damage_detections(detection_id);

-- Enable RLS on Damage Detections
ALTER TABLE public.damage_detections ENABLE ROW LEVEL SECURITY;

-- Damage Detections RLS Policies (inherits user ownership via detection relationship)
CREATE POLICY "Damage Detections SELECT: Users can view own damage items"
    ON public.damage_detections FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.detections d
        WHERE d.id = damage_detections.detection_id AND d.user_id = auth.uid()
    ));

CREATE POLICY "Damage Detections INSERT: Users can insert own damage items"
    ON public.damage_detections FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.detections d
        WHERE d.id = damage_detections.detection_id AND d.user_id = auth.uid()
    ));

CREATE POLICY "Damage Detections DELETE: Users can delete own damage items"
    ON public.damage_detections FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.detections d
        WHERE d.id = damage_detections.detection_id AND d.user_id = auth.uid()
    ));
