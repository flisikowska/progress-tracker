INSERT INTO public."group"(
	name, goal, goal_period)
	VALUES ('Aktywne pierożki', 1200, 'week'),
	('Bieganie po zmroku', 6000, 'month');

INSERT INTO public."user"(
	user_id, name, color)
	VALUES ('657342135207672346843', 'Kasia', 'F5B1C7'),
	( '235766135207672635456', 'Karolina', 'B8BDE1'),
	('100262135207672155021', 'Emilia', '7DCEF5'),
	('335463135207672456832', 'Angelika', '40B7B0');

INSERT INTO public.user_group(
	user_id, group_id)
	VALUES ('657342135207672346843', 1),
	('235766135207672635456', 1),
	('100262135207672155021', 1),
	('335463135207672456832', 1),
	-- Emilia należy dodatkowo do drugiej grupy
	('100262135207672155021', 2);
	
	
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
	FOR user_record IN SELECT * FROM public."user" LOOP
		FOR i IN SELECT generate_series(0, 30) LOOP 
				INSERT INTO public.activity(date, activity_type_id, user_id, amount)
				VALUES (
					NOW() - ( INTERVAL '1 day' * i),
					(SELECT activity_type_id FROM activity_type ORDER BY RANDOM() LIMIT 1),
					user_record.user_id,
					FLOOR(RANDOM()*(200- 2 + 1)) + 2);
		END LOOP;
	END LOOP;
END $$;