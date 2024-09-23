INSERT INTO public."group"(
	name, goal)
	VALUES ('Aktywne pierożki', 1200);

INSERT INTO public."user"(
	name, group_id)
	VALUES ('Kasia', 1),
	('Karolina', 1),
	('Emilia', 1),
	('Angelika', 1);
	
INSERT INTO public.activity_type(
	icon, name)
	VALUES ('swimming', 'Pływanie'),
	('soccer', 'Piłka nożna'),
	('basketball', 'Koszykówka'),
	('yoga', 'Joga'),
	('pilates', 'Pilates');

DO $$
DECLARE
	i INTEGER;
    user_record RECORD;
BEGIN
	FOR user_record IN SELECT * FROM public.user LOOP
		FOR i IN SELECT generate_series(0, 30) LOOP 
				INSERT INTO public.activity(date, activity_type_id, user_id, amount)
				VALUES (
					NOW() - ( INTERVAL '1 day' * i),
					(SELECT activity_type_id FROM activity_type ORDER BY RANDOM() LIMIT 1),
					user_record.user_id,
					FLOOR(RANDOM()*(200- 5 + 1)) + 5);
		END LOOP;
	END LOOP;
END $$;