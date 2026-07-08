-- Powiadomienia mają teraz jedną wspólną listę (bez podziału na grupy w UI),
-- więc każdy wpis musi nieść nazwę grupy, w której coś dodano.
ALTER TABLE public.notification
    ADD COLUMN IF NOT EXISTS group_name text NOT NULL DEFAULT '';

-- Uzupełnij nazwę dla już istniejących powiadomień na podstawie group_id.
UPDATE public.notification n
SET group_name = g.name
FROM public."group" g
WHERE g.group_id = n.group_id AND n.group_name = '';
