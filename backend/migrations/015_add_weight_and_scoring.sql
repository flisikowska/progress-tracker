ALTER TABLE public.activity_type ADD COLUMN IF NOT EXISTS weight numeric(3,2) NOT NULL DEFAULT 1;
ALTER TABLE public."group" ADD COLUMN IF NOT EXISTS scoring_mode text NOT NULL DEFAULT 'hours';

ALTER TABLE public."group" DROP CONSTRAINT IF EXISTS group_scoring_mode_check;

ALTER TABLE public."group" ADD CONSTRAINT group_scoring_mode_check CHECK (scoring_mode IN ('hours', 'points'));

UPDATE public.activity_type SET icon = 'gardening'     WHERE icon = 'ogrodnictwo';
UPDATE public.activity_type SET icon = 'rowingMachine' WHERE icon = 'wioslarz';
UPDATE public.activity_type SET icon = 'nordicWalking' WHERE icon = 'nordic-walking';
UPDATE public.activity_type SET icon = 'rollerSkater'  WHERE icon = 'roller-skater';

INSERT INTO public.activity_type (icon, name, weight)
SELECT v.icon, v.name, v.weight
FROM (VALUES
    ('interval', 'HIIT', 2),
    ('tabata', 'Tabata', 2),
    ('kettlebell', 'Ćwiczenia z obciążeniem', 1.5),
    ('calisthenics', 'Kalistenika', 1.7),
    ('jumpingRope', 'Skakanka', 1.6),
    ('spinning', 'Spinning', 1.7),
    ('spinning', 'Orbitrek', 1.5),
    ('exercising', 'Gimnastyka', 1),
    ('karate', 'Karate', 1.25),
    ('judo', 'Judo', 1.25),
    ('taekwondo', 'Taekwondo', 1.25),
    ('sailing', 'Żeglarstwo', 0.5),
    ('diving', 'Nurkowanie', 1),
    ('surfing', 'Surfing', 1.25),
    ('paddle', 'Padel', 1.25),
    ('snowboarding', 'Snowboard', 1),
    ('horseRiding', 'Jazda konno', 0.75),
    ('archery', 'Łucznictwo', 0.5),
    ('trampoline', 'Trampolina', 1),
    ('zumba', 'Zumba', 1.5)
) AS v(icon, name, weight)
WHERE NOT EXISTS (
    SELECT 1 FROM public.activity_type at WHERE at.icon = v.icon
);

UPDATE public.activity_type SET weight = 0.5  WHERE icon IN ('yoga', 'walking', 'golf', 'bowling', 'stretching');
UPDATE public.activity_type SET weight = 0.75 WHERE icon IN ('gardening', 'seks', 'pilates', 'tabletennis', 'baseball', 'sup');
UPDATE public.activity_type SET weight = 1    WHERE icon IN ('gym', 'volleyball', 'hiking', 'skating', 'dancing', 'nordicWalking', 'rollerSkater', 'badminton', 'kayak');
UPDATE public.activity_type SET weight = 1.25 WHERE icon IN ('tennis', 'cycling', 'skiing', 'aerobic');
UPDATE public.activity_type SET weight = 1.5  WHERE icon IN ('swimming', 'soccer', 'basketball', 'hockey', 'climbing', 'handball', 'cardio', 'treadmill');
UPDATE public.activity_type SET weight = 1.75 WHERE icon IN ('running', 'rowingMachine');
UPDATE public.activity_type SET weight = 2    WHERE icon IN ('boxing', 'squash', 'crossfit');
