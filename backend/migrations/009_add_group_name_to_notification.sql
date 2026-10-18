ALTER TABLE public.notification
    ADD COLUMN IF NOT EXISTS group_name text NOT NULL DEFAULT '';

UPDATE public.notification n
SET group_name = g.name
FROM public."group" g
WHERE g.group_id = n.group_id AND n.group_name = '';
