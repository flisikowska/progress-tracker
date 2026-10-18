CREATE TABLE IF NOT EXISTS public.group_settings (
  group_id integer NOT NULL REFERENCES public."group"(group_id) ON DELETE CASCADE,
  goal integer NOT NULL,
  scoring_mode text NOT NULL DEFAULT 'hours',
  effective_from date NOT NULL,
  PRIMARY KEY (group_id, effective_from),
  CONSTRAINT group_settings_scoring_mode_check CHECK (scoring_mode IN ('hours', 'points'))
);

INSERT INTO public.group_settings (group_id, goal, scoring_mode, effective_from)
SELECT group_id, goal, scoring_mode, DATE '2000-01-01'
FROM public."group"
ON CONFLICT (group_id, effective_from) DO NOTHING;
