CREATE TABLE IF NOT EXISTS public.user_group (
    user_id text NOT NULL,
    group_id integer NOT NULL,
    PRIMARY KEY (user_id, group_id),
    FOREIGN KEY (user_id) REFERENCES public.user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES public.group(group_id) ON DELETE CASCADE
);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'user' AND column_name = 'group_id'
  ) THEN
    INSERT INTO public.user_group (user_id, group_id)
    SELECT user_id, group_id FROM public.user WHERE group_id IS NOT NULL
    ON CONFLICT DO NOTHING;

    ALTER TABLE public."user" DROP COLUMN group_id;
  END IF;
END $$;
