ALTER TABLE public.notification ADD COLUMN IF NOT EXISTS scoring_mode text NOT NULL DEFAULT 'hours';
ALTER TABLE public.notification ADD COLUMN IF NOT EXISTS weight numeric(3,2) NOT NULL DEFAULT 1;
