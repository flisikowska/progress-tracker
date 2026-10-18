ALTER TABLE public."group"
    ADD COLUMN IF NOT EXISTS goal_period text NOT NULL DEFAULT 'week';

ALTER TABLE public."group"
    DROP CONSTRAINT IF EXISTS group_goal_period_check;

ALTER TABLE public."group"
    ADD CONSTRAINT group_goal_period_check CHECK (goal_period IN ('week', 'month', 'year'));
