-- przepisanie admina grupy "Wymówkowicze" na członka o nicku "Mynka"
UPDATE public."group" g
SET admin_id = ug.user_id
FROM public.user_group ug
JOIN public.user u ON u.user_id = ug.user_id
WHERE g.name = 'Wymówkowicze'
  AND ug.group_id = g.group_id
  AND COALESCE(ug.nickname, u.name) = 'Mynka';
