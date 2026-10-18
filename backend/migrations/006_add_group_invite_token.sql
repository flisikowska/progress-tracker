ALTER TABLE public."group"
    ADD COLUMN IF NOT EXISTS invite_token text UNIQUE;
