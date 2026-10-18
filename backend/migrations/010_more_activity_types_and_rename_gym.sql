UPDATE public.activity_type SET name = 'Ćwiczenia siłowe' WHERE icon = 'gym';

INSERT INTO public.activity_type (icon, name)
SELECT v.icon, v.name
FROM (VALUES
    ('handball', 'Piłka ręczna'),
    ('nordicWalking', 'Nordic walking'),
    ('rollerSkater', 'Rolki'),
    ('aerobic', 'Aerobik'),
    ('badminton', 'Badminton'),
    ('squash', 'Squash'),
    ('crossfit', 'Crossfit'),
    ('kayak', 'Kajakarstwo'),
    ('sup', 'SUP'),
    ('stretching', 'Rozciąganie'),
    ('cardio', 'Cardio'),
    ('treadmill', 'Bieżnia')
) AS v(icon, name)
WHERE NOT EXISTS (
    SELECT 1 FROM public.activity_type at WHERE at.icon = v.icon
);
