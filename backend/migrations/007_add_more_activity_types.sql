-- Dodaje popularne sporty. Idempotentne - pomija te, których klucz ikony już jest.
INSERT INTO public.activity_type (icon, name)
SELECT v.icon, v.name
FROM (VALUES
    ('tennis', 'Tenis'),
    ('walking', 'Chodzenie'),
    ('running', 'Bieganie'),
    ('cycling', 'Kolarstwo'),
    ('gym', 'Siłownia'),
    ('volleyball', 'Siatkówka'),
    ('boxing', 'Boks'),
    ('tabletennis', 'Tenis stołowy'),
    ('golf', 'Golf'),
    ('baseball', 'Baseball'),
    ('hiking', 'Trekking'),
    ('skiing', 'Narciarstwo'),
    ('skating', 'Łyżwy'),
    ('hockey', 'Hokej'),
    ('bowling', 'Kręgle'),
    ('climbing', 'Wspinaczka'),
    ('dancing', 'Taniec')
) AS v(icon, name)
WHERE NOT EXISTS (
    SELECT 1 FROM public.activity_type at WHERE at.icon = v.icon
);
