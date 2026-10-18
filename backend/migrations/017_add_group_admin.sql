ALTER TABLE public."group" ADD COLUMN IF NOT EXISTS admin_id text REFERENCES public."user"(user_id);

-- dla istniejących grup jako admina bierzemy dowolnego usera
UPDATE public."group" g SET admin_id = (
  SELECT user_id FROM public.user_group ug WHERE ug.group_id = g.group_id ORDER BY user_id LIMIT 1
) WHERE admin_id IS NULL;
