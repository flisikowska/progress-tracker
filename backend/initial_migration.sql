
-- Table: public.group

-- DROP TABLE IF EXISTS public."group";

CREATE TABLE IF NOT EXISTS public."group"
(
    group_id SERIAL NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    goal integer NOT NULL,
    CONSTRAINT group_pkey PRIMARY KEY (group_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."group"
    OWNER to postgres;

-- Table: public.user

-- DROP TABLE IF EXISTS public."user";

CREATE TABLE IF NOT EXISTS public."user"
(
    user_id SERIAL NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    group_id integer,
    CONSTRAINT user_pkey PRIMARY KEY (user_id),
    CONSTRAINT group_id FOREIGN KEY (group_id)
        REFERENCES public."group" (group_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."user"
    OWNER to postgres;


-- Table: public.activity_type

-- DROP TABLE IF EXISTS public.activity_type;

CREATE TABLE IF NOT EXISTS public.activity_type
(
    activity_type_id SERIAL NOT NULL,
    icon text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT activity_type_pkey PRIMARY KEY (activity_type_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.activity_type
    OWNER to postgres;


-- Table: public.activity

-- DROP TABLE IF EXISTS public.activity;

CREATE TABLE IF NOT EXISTS public.activity
(
    activity_id SERIAL NOT NULL,
    date date NOT NULL,
    activity_type_id integer NOT NULL,
    user_id integer NOT NULL,
    amount integer NOT NULL,
    CONSTRAINT activity_pkey PRIMARY KEY (activity_id),
    CONSTRAINT activity_type_id FOREIGN KEY (activity_type_id)
        REFERENCES public.activity_type (activity_type_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT,
    CONSTRAINT user_id FOREIGN KEY (user_id)
        REFERENCES public."user" (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.activity
    OWNER to postgres;

ALTER TABLE IF EXISTS public."user"
    ADD COLUMN color text NOT NULL DEFAULT 'FFFFFF';
	
	