CREATE TABLE IF NOT EXISTS public.activity_group (
    activity_id integer NOT NULL,
    group_id integer NOT NULL,
    PRIMARY KEY (activity_id, group_id),
    FOREIGN KEY (activity_id) REFERENCES public.activity(activity_id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES public."group"(group_id) ON DELETE CASCADE
);

INSERT INTO public.activity_group (activity_id, group_id)
SELECT A.activity_id, UG.group_id
FROM public.activity A
JOIN public.user_group UG ON UG.user_id = A.user_id
ON CONFLICT DO NOTHING;
