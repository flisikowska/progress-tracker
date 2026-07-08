-- Token zaproszenia do grupy. Na jego podstawie budujemy link zapraszający,
-- a każdy zalogowany user z tym tokenem może dołączyć do grupy.
ALTER TABLE public."group"
    ADD COLUMN IF NOT EXISTS invite_token text UNIQUE;
