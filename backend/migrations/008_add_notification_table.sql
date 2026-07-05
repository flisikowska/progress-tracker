-- Powiadomienia w grupie: gdy ktoś doda aktywność do grupy, to pozostali członkowie dostają powiadomienie
CREATE TABLE IF NOT EXISTS public.notification(
    notification_id     SERIAL  PRIMARY KEY,
    user_id             text    NOT NULL REFERENCES public."user"(user_id)  ON DELETE CASCADE,  -- odbiorca
    group_id            integer NOT NULL REFERENCES public."group"(group_id) ON DELETE CASCADE,
    actor_name          text    NOT NULL,          -- kto dodał aktywność 
    activity_type_name  text    NOT NULL,          -- nazwa typu aktywności
    amount              integer NOT NULL,          -- czas w minutach
    is_read             boolean NOT NULL DEFAULT false,
    created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notification_user_group_idx
    ON public.notification (user_id, group_id, created_at DESC);
