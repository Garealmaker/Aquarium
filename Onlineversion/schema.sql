create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  player_name text,
  birth_date date,
  coins integer not null default 240,
  pearls integer not null default 12,
  level integer not null default 1,
  xp integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists player_name text;
alter table public.profiles add column if not exists birth_date date;
alter table public.profiles add column if not exists coins integer not null default 240;
alter table public.profiles add column if not exists pearls integer not null default 12;
alter table public.profiles add column if not exists level integer not null default 1;
alter table public.profiles add column if not exists xp integer not null default 0;
alter table public.profiles add column if not exists updated_at timestamptz not null default now();
alter table public.profiles add column if not exists last_reward_at date;
alter table public.profiles add column if not exists mission_date_key text;
alter table public.profiles add column if not exists mission_selected_ids jsonb not null default '[]'::jsonb;
alter table public.profiles add column if not exists mission_claimed_ids jsonb not null default '[]'::jsonb;
alter table public.profiles add column if not exists mission_trackers jsonb not null default '{}'::jsonb;
alter table public.profiles add column if not exists weekly_contest_entries jsonb not null default '{}'::jsonb;
alter table public.profiles add column if not exists competition_history jsonb not null default '[]'::jsonb;
alter table public.profiles add column if not exists onboarding_step integer not null default 0;
alter table public.profiles add column if not exists onboarding_completed boolean not null default false;
alter table public.profiles add column if not exists onboarding_reward_claimed boolean not null default false;

create unique index if not exists profiles_player_name_unique_idx
on public.profiles (lower(player_name))
where player_name is not null and length(trim(player_name)) > 0;

create table if not exists public.game_saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  save_version integer not null default 1,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.aquariums (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slot_index integer not null,
  name text not null default 'Aquarium 1',
  water_quality numeric(5,2) not null default 84,
  temperature_target numeric(5,2) not null default 24,
  light_hours integer not null default 2,
  co2_level numeric(5,2) not null default 4,
  ph_level numeric(5,2) not null default 7,
  lamp_level integer not null default 1,
  diffuser_level integer not null default 1,
  filter_level integer not null default 1,
  feed_uses_this_cycle integer not null default 0,
  cycle_number integer not null default 1,
  minutes_remaining integer not null default 120,
  last_auto_cycle_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, slot_index)
);

alter table public.aquariums add column if not exists lamp_level integer not null default 1;
alter table public.aquariums add column if not exists diffuser_level integer not null default 1;
alter table public.aquariums add column if not exists last_auto_cycle_at timestamptz not null default now();
alter table public.aquariums alter column co2_level set default 4;

create table if not exists public.fish_species_catalog (
  id text primary key,
  species text not null,
  cost integer not null default 0,
  temperature_min numeric(5,2) not null,
  temperature_max numeric(5,2) not null,
  ph_min numeric(5,2) not null,
  ph_max numeric(5,2) not null,
  oxygen_need numeric(6,2) not null,
  adult_size_cm numeric(6,2) not null,
  lifespan_cycles integer not null,
  preferred_plant_id text,
  description text not null default ''
);

create table if not exists public.plant_species_catalog (
  id text primary key,
  species text not null,
  cost integer not null default 0,
  temperature_min numeric(5,2) not null,
  temperature_max numeric(5,2) not null,
  ph_min numeric(5,2) not null,
  ph_max numeric(5,2) not null,
  light_min integer not null,
  light_max integer not null,
  co2_need numeric(6,2) not null,
  oxygen_generation numeric(6,2) not null,
  comfort_bonus integer not null default 0,
  lifespan_cycles integer not null,
  description text not null default ''
);

create table if not exists public.utility_shop_catalog (
  id text primary key,
  category text not null check (category in ('utility', 'equipment')),
  inventory_key text,
  equipment_type text,
  display_name text not null,
  amount integer not null default 1,
  cost integer not null default 0,
  target_level integer,
  description text not null default ''
);

create table if not exists public.utility_inventory (
  user_id uuid not null references auth.users(id) on delete cascade,
  item_key text not null,
  quantity integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, item_key)
);

create table if not exists public.mission_catalog (
  id text primary key,
  label text not null,
  goal integer not null,
  reward_coins integer not null,
  reward_pearls integer not null,
  tracker text not null
);

create table if not exists public.owned_fish (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  aquarium_id uuid references public.aquariums(id) on delete set null,
  species_id text not null references public.fish_species_catalog(id),
  nickname text not null,
  hunger numeric(5,2) not null default 100,
  vitality_points integer not null default 10,
  good_cycle_streak integer not null default 0,
  longevity_cycles_left integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.owned_plants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  aquarium_id uuid references public.aquariums(id) on delete set null,
  species_id text not null references public.plant_species_catalog(id),
  nickname text not null,
  depth integer not null default 2 check (depth in (1, 2)),
  x_percent numeric(5,2) not null default 50,
  vitality_points integer not null default 10,
  good_cycle_streak integer not null default 0,
  longevity_cycles_left integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.owned_plants add column if not exists x_percent numeric(5,2) not null default 50;

create table if not exists public.fry_batches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  aquarium_id uuid not null references public.aquariums(id) on delete cascade,
  species_id text not null references public.fish_species_catalog(id),
  count integer not null default 1,
  cycles_remaining integer not null default 2,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.community_feed_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  aquarium_id uuid references public.aquariums(id) on delete set null,
  author text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.journal_log_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  aquarium_id uuid references public.aquariums(id) on delete set null,
  message text not null,
  created_at timestamptz not null default now()
);

insert into public.fish_species_catalog (
  id,
  species,
  cost,
  temperature_min,
  temperature_max,
  ph_min,
  ph_max,
  oxygen_need,
  adult_size_cm,
  lifespan_cycles,
  preferred_plant_id,
  description
)
values
  ('golden-guppy', 'Guppy dore', 0, 22, 26, 6.8, 7.8, 1.00, 4, 28, 'vallis-emerald', 'Petit poisson sociable parfait pour lancer un elevage vivant.'),
  ('sun-cory', 'Cory solaire', 0, 24, 28, 6.6, 7.4, 1.20, 6, 31, 'anubia-bronze', 'Un poisson de fond qui aide a garder un bac calme et stable.'),
  ('moon-betta', 'Betta lunaire', 0, 25, 29, 6.2, 7.4, 1.10, 7, 34, 'lotus-rose', 'Un nageur de prestige qui attire les visiteurs du port.'),
  ('coral-clown', 'Clown corallien', 0, 24, 27, 6.8, 7.6, 1.30, 8, 30, 'anubia-bronze', 'Une star chaleureuse ideale pour les aquariums lumineux.'),
  ('glass-tetra', 'Tetra de verre', 0, 21, 24, 6.0, 7.2, 0.90, 5, 27, 'cabomba-feather', 'Sa silhouette translucide donne une allure haut de gamme au bac.'),
  ('moss-koi', 'Koi mousse', 0, 20, 24, 7.0, 8.0, 2.30, 12, 36, 'lotus-rose', 'Un grand nageur calme qui renforce la valeur contemplative du recif.'),
  ('pearl-discus', 'Discus perle', 0, 27, 30, 6.0, 7.0, 1.90, 15, 35, 'anubia-bronze', 'Un disque raffine qui fait monter la reputation du gardien.'),
  ('reef-angel', 'Ange de recif', 0, 24, 27, 6.4, 7.4, 2.00, 14, 33, 'kelp-spiral', 'Une vedette majestueuse qui rapporte de belles perles.'),
  ('ember-rasbora', 'Rasbora braise', 0, 23, 27, 6.6, 7.6, 0.80, 3, 29, 'cabomba-feather', 'Un poisson vif qui donne du rythme a la scene principale.'),
  ('starlight-gourami', 'Gourami stellaire', 0, 25, 28, 6.5, 7.5, 1.40, 10, 32, 'lotus-rose', 'Ses reflets lumineux rendent chaque visite plus memorable.')
on conflict (id) do update
set
  species = excluded.species,
  cost = excluded.cost,
  temperature_min = excluded.temperature_min,
  temperature_max = excluded.temperature_max,
  ph_min = excluded.ph_min,
  ph_max = excluded.ph_max,
  oxygen_need = excluded.oxygen_need,
  adult_size_cm = excluded.adult_size_cm,
  lifespan_cycles = excluded.lifespan_cycles,
  preferred_plant_id = excluded.preferred_plant_id,
  description = excluded.description;

insert into public.plant_species_catalog (
  id,
  species,
  cost,
  temperature_min,
  temperature_max,
  ph_min,
  ph_max,
  light_min,
  light_max,
  co2_need,
  oxygen_generation,
  comfort_bonus,
  lifespan_cycles,
  description
)
values
  ('vallis-emerald', 'Vallisneria emeraude', 58, 20, 27, 6.5, 7.8, 3, 5, 3.2, 1.8, 4, 34, 'Une grande plante rubanee qui enrichit l''eau en oxygene.'),
  ('lotus-rose', 'Lotus rose', 72, 22, 28, 6.2, 7.2, 4, 6, 4.5, 0.7, 8, 29, 'Une fleur delicate qui adore les eaux stables et lumineuses.'),
  ('anubia-bronze', 'Anubia bronze', 64, 22, 29, 6.0, 7.5, 2, 4, 2.2, 0.95, 7, 36, 'Une plante robuste, parfaite pour stabiliser un aquarium jeune.'),
  ('cabomba-feather', 'Cabomba plume', 78, 18, 25, 6.0, 7.0, 4, 6, 5.6, 1.55, 3, 28, 'Une tige legere et tres oxygenante qui ondule sans cesse.'),
  ('kelp-spiral', 'Kelp spiral', 82, 19, 26, 6.4, 7.6, 3, 5, 3.8, 1.2, 5, 31, 'Une silhouette torsadee qui donne du relief et renouvelle l''oxygene.')
on conflict (id) do update
set
  species = excluded.species,
  cost = excluded.cost,
  temperature_min = excluded.temperature_min,
  temperature_max = excluded.temperature_max,
  ph_min = excluded.ph_min,
  ph_max = excluded.ph_max,
  light_min = excluded.light_min,
  light_max = excluded.light_max,
  co2_need = excluded.co2_need,
  oxygen_generation = excluded.oxygen_generation,
  comfort_bonus = excluded.comfort_bonus,
  lifespan_cycles = excluded.lifespan_cycles,
  description = excluded.description;

insert into public.utility_shop_catalog (
  id,
  category,
  inventory_key,
  equipment_type,
  display_name,
  amount,
  cost,
  target_level,
  description
)
values
  ('food-pack', 'utility', 'food', null, 'Granules marines', 6, 28, null, 'Recharge 6 portions de nourriture premium.'),
  ('food-feast', 'utility', 'food', null, 'Banquet de plancton', 14, 58, null, 'Un stock plus rentable pour les aquariums qui grandissent.'),
  ('water-kit', 'utility', 'water', null, 'Kit de filtration', 20, 36, null, 'Ajoute des charges de nettoyage pour la qualite d''eau.'),
  ('water-premium', 'utility', 'water', null, 'Cycleur oceanique', 34, 62, null, 'Une maintenance haut de gamme pour les grands bacs.'),
  ('ph-up-tabs', 'utility', 'ph-up', null, 'Pastilles pH+', 4, 32, null, 'Augmente legerement le pH du bac. Pack de 4 pastilles.'),
  ('ph-down-tabs', 'utility', 'ph-down', null, 'Pastilles pH-', 4, 32, null, 'Baisse legerement le pH du bac. Pack de 4 pastilles.'),
  ('lamp-upgrade-2', 'equipment', null, 'lamp', 'Lampe horticole II', 1, 74, 2, 'Etend le reglage de luminosite jusqu''a 8 h d''exposition.'),
  ('lamp-upgrade-3', 'equipment', null, 'lamp', 'Lampe horticole III', 1, 128, 3, 'Etend le reglage de luminosite jusqu''a 10 h d''exposition.'),
  ('lamp-upgrade-4', 'equipment', null, 'lamp', 'Lampe horticole IV', 1, 186, 4, 'Etend le reglage de luminosite jusqu''a 12 h d''exposition.'),
  ('lamp-upgrade-5', 'equipment', null, 'lamp', 'Lampe horticole V', 1, 248, 5, 'Etend le reglage de luminosite jusqu''a 14 h d''exposition.'),
  ('co2-upgrade-2', 'equipment', null, 'co2', 'Diffuseur CO2 II', 1, 82, 2, 'Augmente la production maximale automatique de CO2 jusqu''au niveau 6.'),
  ('co2-upgrade-3', 'equipment', null, 'co2', 'Diffuseur CO2 III', 1, 136, 3, 'Augmente la production maximale automatique de CO2 jusqu''au niveau 8.'),
  ('co2-upgrade-4', 'equipment', null, 'co2', 'Diffuseur CO2 IV', 1, 194, 4, 'Augmente la production maximale automatique de CO2 jusqu''au niveau 10.'),
  ('co2-upgrade-5', 'equipment', null, 'co2', 'Diffuseur CO2 V', 1, 256, 5, 'Augmente la production maximale automatique de CO2 jusqu''au niveau 12.'),
  ('filter-upgrade-2', 'equipment', null, 'filter', 'Filtre II', 1, 70, 2, 'Reduit l''impact du cycle sur la qualite de l''eau de 8%.'),
  ('filter-upgrade-3', 'equipment', null, 'filter', 'Filtre III', 1, 112, 3, 'Reduit l''impact du cycle sur la qualite de l''eau de 10%.'),
  ('filter-upgrade-4', 'equipment', null, 'filter', 'Filtre IV', 1, 164, 4, 'Reduit l''impact du cycle sur la qualite de l''eau de 12%.'),
  ('filter-upgrade-5', 'equipment', null, 'filter', 'Filtre V', 1, 224, 5, 'Reduit l''impact du cycle sur la qualite de l''eau de 14%.')
on conflict (id) do update
set
  category = excluded.category,
  inventory_key = excluded.inventory_key,
  equipment_type = excluded.equipment_type,
  display_name = excluded.display_name,
  amount = excluded.amount,
  cost = excluded.cost,
  target_level = excluded.target_level,
  description = excluded.description;

insert into public.mission_catalog (id, label, goal, reward_coins, reward_pearls, tracker)
values
  ('visit-2', 'Faire 2 visites', 2, 38, 3, 'visitCount'),
  ('visit-4', 'Faire une tournee de 4 visites', 4, 88, 5, 'visitCount'),
  ('buy-1', 'Acheter une ressource ou une deco', 1, 34, 1, 'purchaseCount'),
  ('buy-3', 'Effectuer 3 achats dans la boutique', 3, 94, 4, 'purchaseCount'),
  ('clean-2', 'Nettoyer l''eau 2 fois', 2, 52, 2, 'cleanCount'),
  ('adopt-1', 'Adopter un nouveau poisson', 1, 60, 3, 'adoptionCount'),
  ('reward-1', 'Recuperer la recompense du jour', 1, 32, 2, 'dailyRewardCount')
on conflict (id) do update
set
  label = excluded.label,
  goal = excluded.goal,
  reward_coins = excluded.reward_coins,
  reward_pearls = excluded.reward_pearls,
  tracker = excluded.tracker;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, email, player_name, birth_date, coins, pearls, level, xp, updated_at)
  values (
    new.id,
    new.email,
    coalesce(
      nullif(left(trim(coalesce(new.raw_user_meta_data->>'player_name', '')), 26), ''),
      nullif(split_part(new.email, '@', 1), ''),
      'Gardien des recifs'
    ),
    case
      when coalesce(new.raw_user_meta_data->>'birth_date', '') ~ '^\d{4}-\d{2}-\d{2}$'
        then (new.raw_user_meta_data->>'birth_date')::date
      else null
    end,
    240,
    12,
    1,
    0,
    now()
  )
  on conflict (user_id) do update
  set
    email = excluded.email,
    player_name = coalesce(public.profiles.player_name, excluded.player_name),
    birth_date = coalesce(public.profiles.birth_date, excluded.birth_date),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.get_login_email_for_player_name(target_player_name text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  cleaned_name text := left(trim(coalesce(target_player_name, '')), 26);
  resolved_email text;
begin
  if cleaned_name = '' then
    raise exception 'Pseudo invalide';
  end if;

  select email
  into resolved_email
  from public.profiles
  where lower(player_name) = lower(cleaned_name)
    and email is not null
  limit 1;

  if resolved_email is null then
    raise exception 'Pseudo inconnu';
  end if;

  return resolved_email;
end;
$$;

alter table public.profiles enable row level security;
alter table public.game_saves enable row level security;
alter table public.aquariums enable row level security;
alter table public.utility_inventory enable row level security;
alter table public.owned_fish enable row level security;
alter table public.owned_plants enable row level security;
alter table public.fry_batches enable row level security;
alter table public.community_feed_entries enable row level security;
alter table public.journal_log_entries enable row level security;

create or replace function public.get_filter_reduction(filter_level_value integer)
returns numeric
language sql
immutable
as $$
  select case greatest(1, least(coalesce(filter_level_value, 1), 5))
    when 1 then 0.06
    when 2 then 0.08
    when 3 then 0.10
    when 4 then 0.12
    else 0.14
  end;
$$;

create or replace function public.get_lamp_max_hours(lamp_level_value integer)
returns integer
language sql
immutable
as $$
  select case greatest(1, least(coalesce(lamp_level_value, 1), 5))
    when 1 then 6
    when 2 then 8
    when 3 then 10
    when 4 then 12
    else 14
  end;
$$;

create or replace function public.get_diffuser_output(diffuser_level_value integer)
returns numeric
language sql
immutable
as $$
  select case greatest(1, least(coalesce(diffuser_level_value, 1), 5))
    when 1 then 4
    when 2 then 6
    when 3 then 8
    when 4 then 10
    else 12
  end;
$$;

create or replace function public.get_today_key_paris()
returns text
language sql
stable
as $$
  select to_char(timezone('Europe/Paris', now())::date, 'YYYY-MM-DD');
$$;

create or replace function public.get_week_key_paris()
returns text
language sql
stable
as $$
  select to_char(timezone('Europe/Paris', now()), 'IYYY-"W"IW');
$$;

create or replace function public.get_default_server_mission_trackers()
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'visitCount', 0,
    'purchaseCount', 0,
    'cleanCount', 0,
    'adoptionCount', 0,
    'dailyRewardCount', 0
  );
$$;

create or replace function public.refresh_daily_missions_for_user(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  today_key text := public.get_today_key_paris();
  profile_record public.profiles%rowtype;
  selected_ids jsonb;
begin
  select *
  into profile_record
  from public.profiles
  where user_id = target_user_id
  for update;

  if profile_record.user_id is null then
    return;
  end if;

  if coalesce(profile_record.mission_date_key, '') = today_key
    and jsonb_array_length(coalesce(profile_record.mission_selected_ids, '[]'::jsonb)) > 0 then
    return;
  end if;

  select coalesce(jsonb_agg(to_jsonb(m.id) order by m.sort_key), '[]'::jsonb)
  into selected_ids
  from (
    select id, md5(today_key || ':' || id) as sort_key
    from public.mission_catalog
    order by sort_key
    limit 3
  ) m;

  update public.profiles
  set
    mission_date_key = today_key,
    mission_selected_ids = selected_ids,
    mission_claimed_ids = '[]'::jsonb,
    mission_trackers = public.get_default_server_mission_trackers(),
    updated_at = now()
  where user_id = target_user_id;
end;
$$;

create or replace function public.increment_mission_tracker(target_user_id uuid, tracker_key text, tracker_amount integer default 1)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.refresh_daily_missions_for_user(target_user_id);

  update public.profiles
  set
    mission_trackers = jsonb_set(
      coalesce(mission_trackers, public.get_default_server_mission_trackers()),
      array[tracker_key],
      to_jsonb(greatest(0, coalesce((mission_trackers->>tracker_key)::integer, 0) + greatest(tracker_amount, 0))),
      true
    ),
    updated_at = now()
  where user_id = target_user_id;
end;
$$;

create or replace function public.ensure_aquarium_minutes(target_aquarium_id uuid, required_minutes integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  aquarium_owner uuid;
  shared_minutes integer := 0;
begin
  select user_id
  into aquarium_owner
  from public.aquariums
  where id = target_aquarium_id
    and user_id = auth.uid();

  if aquarium_owner is null then
    raise exception 'Aquarium introuvable ou non autorise';
  end if;

  select minutes_remaining
  into shared_minutes
  from public.aquariums
  where user_id = aquarium_owner
  order by slot_index
  limit 1
  for update;

  if coalesce(shared_minutes, 0) < greatest(required_minutes, 0) then
    raise exception 'Temps de cycle insuffisant pour cette action';
  end if;
end;
$$;

create or replace function public.spend_user_cycle_minutes(target_user_id uuid, required_minutes integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  anchor_record record;
  next_minutes integer;
begin
  select id, minutes_remaining
  into anchor_record
  from public.aquariums
  where user_id = target_user_id
  order by slot_index
  limit 1
  for update;

  if anchor_record.id is null then
    return;
  end if;

  if coalesce(anchor_record.minutes_remaining, 0) < greatest(required_minutes, 0) then
    raise exception 'Temps de cycle insuffisant pour cette action';
  end if;

  next_minutes := greatest(0, anchor_record.minutes_remaining - greatest(required_minutes, 0));

  update public.aquariums
  set
    minutes_remaining = next_minutes,
    updated_at = now()
  where user_id = target_user_id;
end;
$$;

create or replace function public.append_community_feed_entry(
  target_user_id uuid,
  target_author text,
  target_message text,
  target_aquarium_id uuid default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if nullif(trim(coalesce(target_author, '')), '') is null or nullif(trim(coalesce(target_message, '')), '') is null then
    return;
  end if;

  insert into public.community_feed_entries (user_id, aquarium_id, author, message)
  values (target_user_id, target_aquarium_id, left(trim(target_author), 64), left(trim(target_message), 220));

  delete from public.community_feed_entries
  where user_id = target_user_id
    and id not in (
      select id
      from public.community_feed_entries
      where user_id = target_user_id
      order by created_at desc
      limit 20
    );
end;
$$;

create or replace function public.append_journal_log_entry(
  target_user_id uuid,
  target_message text,
  target_aquarium_id uuid default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if nullif(trim(coalesce(target_message, '')), '') is null then
    return;
  end if;

  insert into public.journal_log_entries (user_id, aquarium_id, message)
  values (target_user_id, target_aquarium_id, left(trim(target_message), 220));

  delete from public.journal_log_entries
  where user_id = target_user_id
    and id not in (
      select id
      from public.journal_log_entries
      where user_id = target_user_id
      order by created_at desc
      limit 24
    );
end;
$$;

create or replace function public.grant_profile_xp(target_user_id uuid, xp_gain integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target_profile public.profiles%rowtype;
  xp_total integer;
  next_level integer;
  bonus_coins integer := 0;
  bonus_pearls integer := 0;
begin
  if greatest(coalesce(xp_gain, 0), 0) <= 0 then
    return;
  end if;

  select *
  into target_profile
  from public.profiles
  where user_id = target_user_id
  for update;

  if target_profile.user_id is null then
    return;
  end if;

  xp_total := greatest(0, coalesce(target_profile.xp, 0)) + greatest(xp_gain, 0);
  next_level := greatest(1, coalesce(target_profile.level, 1));

  while xp_total >= next_level * 100 loop
    xp_total := xp_total - next_level * 100;
    next_level := next_level + 1;
    bonus_coins := bonus_coins + 70;
    bonus_pearls := bonus_pearls + 5;
  end loop;

  update public.profiles
  set
    xp = xp_total,
    level = next_level,
    coins = coins + bonus_coins,
    pearls = pearls + bonus_pearls,
    updated_at = now()
  where user_id = target_user_id;

  if next_level > greatest(1, coalesce(target_profile.level, 1)) then
    perform public.append_journal_log_entry(
      target_user_id,
      'Niveau ' || next_level || ' atteint. Bonus: ' || bonus_coins || ' coquillages et ' || bonus_pearls || ' perles.',
      null
    );
    perform public.append_community_feed_entry(
      target_user_id,
      'Port communautaire',
      'Le gardien du recif atteint le niveau ' || next_level || '.',
      null
    );
  end if;
end;
$$;

create or replace function public.get_player_core_state_by_user(target_user_id uuid)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'profile',
    (
      select jsonb_build_object(
        'user_id', p.user_id,
        'email', p.email,
        'player_name', p.player_name,
        'birth_date', p.birth_date,
        'coins', p.coins,
        'pearls', p.pearls,
        'level', p.level,
        'xp', p.xp,
        'onboarding_step', coalesce(p.onboarding_step, 0),
        'onboarding_completed', coalesce(p.onboarding_completed, false),
        'onboarding_reward_claimed', coalesce(p.onboarding_reward_claimed, false),
        'last_reward_at', p.last_reward_at,
        'updated_at', p.updated_at
      )
      from public.profiles p
      where p.user_id = target_user_id
    ),
    'mission_state',
    (
      select jsonb_build_object(
        'dateKey', coalesce(p.mission_date_key, public.get_today_key_paris()),
        'selectedIds', coalesce(p.mission_selected_ids, '[]'::jsonb),
        'entries', coalesce(
          (
            select jsonb_agg(
              jsonb_build_object(
                'id', m.id,
                'progress', least(m.goal, coalesce((p.mission_trackers->>m.tracker)::integer, 0)),
                'claimed', coalesce(p.mission_claimed_ids, '[]'::jsonb) ? m.id
              )
              order by selected.ordinality
            )
            from jsonb_array_elements_text(coalesce(p.mission_selected_ids, '[]'::jsonb)) with ordinality as selected(id, ordinality)
            join public.mission_catalog m on m.id = selected.id
          ),
          '[]'::jsonb
        ),
        'trackers', coalesce(p.mission_trackers, public.get_default_server_mission_trackers())
      )
      from public.profiles p
      where p.user_id = target_user_id
    ),
    'competition_state',
    (
      select jsonb_build_object(
        'weeklyContestEntries', coalesce(p.weekly_contest_entries, '{}'::jsonb),
        'history', coalesce(p.competition_history, '[]'::jsonb)
      )
      from public.profiles p
      where p.user_id = target_user_id
    ),
    'aquariums',
    coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', a.id,
            'slot_index', a.slot_index,
            'name', a.name,
            'water_quality', a.water_quality,
            'temperature_target', a.temperature_target,
            'light_hours', a.light_hours,
            'lamp_level', a.lamp_level,
            'lamp_max_hours', public.get_lamp_max_hours(a.lamp_level),
            'co2_level', a.co2_level,
            'diffuser_level', a.diffuser_level,
            'diffuser_output', public.get_diffuser_output(a.diffuser_level),
            'ph_level', a.ph_level,
            'filter_level', a.filter_level,
            'feed_uses_this_cycle', a.feed_uses_this_cycle,
            'cycle_number', a.cycle_number,
            'minutes_remaining', a.minutes_remaining,
            'last_auto_cycle_at', a.last_auto_cycle_at,
            'updated_at', a.updated_at,
            'fish',
            coalesce(
              (
                select jsonb_agg(
                  jsonb_build_object(
                    'id', f.id,
                    'species_id', f.species_id,
                    'species_name', c.species,
                    'nickname', f.nickname,
                    'hunger', f.hunger,
                    'vitality_points', f.vitality_points,
                    'good_cycle_streak', f.good_cycle_streak,
                    'longevity_cycles_left', f.longevity_cycles_left,
                    'updated_at', f.updated_at
                  )
                  order by f.created_at
                )
                from public.owned_fish f
                join public.fish_species_catalog c on c.id = f.species_id
                where f.user_id = target_user_id
                  and f.aquarium_id = a.id
              ),
              '[]'::jsonb
            ),
            'plants',
            coalesce(
              (
                select jsonb_agg(
                  jsonb_build_object(
                    'id', p.id,
                    'species_id', p.species_id,
                    'species_name', c.species,
                    'nickname', p.nickname,
                    'depth', p.depth,
                    'x_percent', p.x_percent,
                    'vitality_points', p.vitality_points,
                    'good_cycle_streak', p.good_cycle_streak,
                    'longevity_cycles_left', p.longevity_cycles_left,
                    'updated_at', p.updated_at
                  )
                  order by p.created_at
                )
                from public.owned_plants p
                join public.plant_species_catalog c on c.id = p.species_id
                where p.user_id = target_user_id
                  and p.aquarium_id = a.id
              ),
              '[]'::jsonb
            ),
            'fry_batches',
            coalesce(
              (
                select jsonb_agg(
                  jsonb_build_object(
                    'id', b.id,
                    'species_id', b.species_id,
                    'count', b.count,
                    'cycles_remaining', b.cycles_remaining,
                    'created_at', b.created_at,
                    'updated_at', b.updated_at
                  )
                  order by b.created_at
                )
                from public.fry_batches b
                where b.user_id = target_user_id
                  and b.aquarium_id = a.id
              ),
              '[]'::jsonb
            )
          )
          order by a.slot_index
        )
        from public.aquariums a
        where a.user_id = target_user_id
      ),
      '[]'::jsonb
    ),
    'community_feed',
    coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'author', e.author,
            'message', e.message,
            'when', to_char(timezone('Europe/Paris', e.created_at), 'DD/MM HH24:MI')
          )
          order by e.created_at desc
        )
        from public.community_feed_entries e
        where e.user_id = target_user_id
      ),
      '[]'::jsonb
    ),
    'logs',
    coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'message', l.message,
            'when', to_char(timezone('Europe/Paris', l.created_at), 'DD/MM HH24:MI')
          )
          order by l.created_at desc
        )
        from public.journal_log_entries l
        where l.user_id = target_user_id
      ),
      '[]'::jsonb
    ),
    'inventory',
    jsonb_build_object(
      'utilities',
      coalesce(
        (
          select jsonb_agg(
            jsonb_build_object(
              'item_key', ui.item_key,
              'quantity', ui.quantity,
              'updated_at', ui.updated_at
            )
            order by ui.item_key
          )
          from public.utility_inventory ui
          where ui.user_id = target_user_id
            and ui.quantity > 0
        ),
        '[]'::jsonb
      ),
      'fish',
      coalesce(
        (
          select jsonb_agg(
            jsonb_build_object(
              'id', f.id,
              'species_id', f.species_id,
              'species_name', c.species,
              'nickname', f.nickname,
              'hunger', f.hunger,
              'vitality_points', f.vitality_points,
              'good_cycle_streak', f.good_cycle_streak,
              'longevity_cycles_left', f.longevity_cycles_left,
              'updated_at', f.updated_at
            )
            order by f.created_at
          )
          from public.owned_fish f
          join public.fish_species_catalog c on c.id = f.species_id
          where f.user_id = target_user_id
            and f.aquarium_id is null
        ),
        '[]'::jsonb
      ),
      'plants',
      coalesce(
        (
          select jsonb_agg(
            jsonb_build_object(
              'id', p.id,
              'species_id', p.species_id,
              'species_name', c.species,
              'nickname', p.nickname,
              'depth', p.depth,
              'x_percent', p.x_percent,
              'vitality_points', p.vitality_points,
              'good_cycle_streak', p.good_cycle_streak,
              'longevity_cycles_left', p.longevity_cycles_left,
              'updated_at', p.updated_at
            )
            order by p.created_at
          )
          from public.owned_plants p
          join public.plant_species_catalog c on c.id = p.species_id
          where p.user_id = target_user_id
            and p.aquarium_id is null
        ),
        '[]'::jsonb
      )
    )
  );
$$;

create or replace function public.apply_single_cycle_to_aquarium(target_user_id uuid, target_aquarium_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  aquarium_record public.aquariums%rowtype;
  plant_record record;
  fish_record record;
  fry_record record;
  hatch_index integer;
  water_drop_seed integer;
  water_drop numeric;
  total_plant_co2_need numeric := 0;
  total_fish_oxygen_need numeric := 0;
  co2_output numeric := 0;
  co2_coverage numeric := 1;
  oxygen_output numeric := 0;
  oxygen_coverage numeric := 1;
  ph_drop_total numeric := 0;
  plant_failures integer;
  fish_failures integer;
  plant_new_vitality integer;
  fish_new_vitality integer;
  plant_new_streak integer;
  fish_new_streak integer;
  fish_new_hunger numeric;
  condition_ratio numeric;
  temp_ok boolean;
  ph_ok boolean;
  light_ok boolean;
  co2_ok boolean;
  oxygen_ok boolean;
  hunger_ok boolean;
begin
  select *
  into aquarium_record
  from public.aquariums
  where id = target_aquarium_id
    and user_id = target_user_id
  for update;

  if aquarium_record.id is null then
    return;
  end if;

  water_drop_seed := 5 + floor(random() * 7)::integer;
  water_drop :=
    (water_drop_seed + greatest(aquarium_record.feed_uses_this_cycle, 0))
    * (1 - public.get_filter_reduction(aquarium_record.filter_level));

  co2_output := public.get_diffuser_output(aquarium_record.diffuser_level);

  select coalesce(sum(c.co2_need), 0)
  into total_plant_co2_need
  from public.owned_plants p
  join public.plant_species_catalog c on c.id = p.species_id
  where p.user_id = target_user_id
    and p.aquarium_id = target_aquarium_id;

  if total_plant_co2_need > 0 then
    co2_coverage := least(1, co2_output / total_plant_co2_need);
  end if;

  for plant_record in
    select
      p.id,
      p.vitality_points,
      p.good_cycle_streak,
      p.longevity_cycles_left,
      c.temperature_min,
      c.temperature_max,
      c.ph_min,
      c.ph_max,
      c.light_min,
      c.light_max,
      c.oxygen_generation
    from public.owned_plants p
    join public.plant_species_catalog c on c.id = p.species_id
    where p.user_id = target_user_id
      and p.aquarium_id = target_aquarium_id
    order by p.created_at
  loop
    temp_ok := aquarium_record.temperature_target between plant_record.temperature_min and plant_record.temperature_max;
    ph_ok := aquarium_record.ph_level between plant_record.ph_min and plant_record.ph_max;
    light_ok := aquarium_record.light_hours > 0
      and aquarium_record.light_hours between plant_record.light_min and plant_record.light_max;
    co2_ok := co2_coverage >= 1;

    plant_failures :=
      case when temp_ok then 0 else 1 end +
      case when ph_ok then 0 else 1 end +
      case when light_ok then 0 else 1 end +
      case when co2_ok then 0 else 1 end;

    if plant_failures = 0 then
      plant_new_streak := plant_record.good_cycle_streak + 1;
      plant_new_vitality := case when plant_new_streak >= 2 then 10 else plant_record.vitality_points end;
    else
      plant_new_streak := 0;
      plant_new_vitality := greatest(0, plant_record.vitality_points - plant_failures);
    end if;

    update public.owned_plants
    set
      vitality_points = plant_new_vitality,
      good_cycle_streak = plant_new_streak,
      longevity_cycles_left = greatest(0, plant_record.longevity_cycles_left - 1),
      updated_at = now()
    where id = plant_record.id;

    ph_drop_total := ph_drop_total + (0.1 + random() * 0.1);

    if aquarium_record.light_hours = 0 then
      condition_ratio := 0;
    else
      condition_ratio := greatest(
        0,
        least(
          1,
          (
            (case when temp_ok then 1 else 0 end) +
            (case when ph_ok then 1 else 0 end) +
            (case when light_ok then 1 else 0 end) +
            co2_coverage
          ) / 4.0
        )
      );
    end if;

    oxygen_output := oxygen_output + (plant_record.oxygen_generation * condition_ratio);
  end loop;

  select coalesce(sum(c.oxygen_need), 0)
  into total_fish_oxygen_need
  from public.owned_fish f
  join public.fish_species_catalog c on c.id = f.species_id
  where f.user_id = target_user_id
    and f.aquarium_id = target_aquarium_id;

  if total_fish_oxygen_need > 0 then
    oxygen_coverage := least(1, oxygen_output / total_fish_oxygen_need);
  end if;

  for fish_record in
    select
      f.id,
      f.hunger,
      f.vitality_points,
      f.good_cycle_streak,
      f.longevity_cycles_left,
      c.temperature_min,
      c.temperature_max,
      c.ph_min,
      c.ph_max
    from public.owned_fish f
    join public.fish_species_catalog c on c.id = f.species_id
    where f.user_id = target_user_id
      and f.aquarium_id = target_aquarium_id
    order by f.created_at
  loop
    fish_new_hunger := greatest(0, fish_record.hunger - (9 + floor(random() * 12)::integer));
    temp_ok := aquarium_record.temperature_target between fish_record.temperature_min and fish_record.temperature_max;
    ph_ok := aquarium_record.ph_level between fish_record.ph_min and fish_record.ph_max;
    hunger_ok := fish_new_hunger > 0;
    oxygen_ok := oxygen_coverage >= 1;

    fish_failures :=
      case when temp_ok then 0 else 1 end +
      case when ph_ok then 0 else 1 end +
      case when hunger_ok then 0 else 1 end +
      case when oxygen_ok then 0 else 1 end;

    if fish_failures = 0 then
      fish_new_streak := fish_record.good_cycle_streak + 1;
      fish_new_vitality := case when fish_new_streak >= 2 then 10 else fish_record.vitality_points end;
    else
      fish_new_streak := 0;
      fish_new_vitality := greatest(0, fish_record.vitality_points - fish_failures);
    end if;

    update public.owned_fish
    set
      hunger = fish_new_hunger,
      vitality_points = fish_new_vitality,
      good_cycle_streak = fish_new_streak,
      longevity_cycles_left = greatest(0, fish_record.longevity_cycles_left - 1),
      updated_at = now()
    where id = fish_record.id;
  end loop;

  for fry_record in
    select
      b.id,
      b.species_id,
      b.count,
      b.cycles_remaining,
      c.lifespan_cycles,
      c.species
    from public.fry_batches b
    join public.fish_species_catalog c on c.id = b.species_id
    where b.user_id = target_user_id
      and b.aquarium_id = target_aquarium_id
    order by b.created_at
  loop
    if fry_record.cycles_remaining > 1 then
      update public.fry_batches
      set
        cycles_remaining = fry_record.cycles_remaining - 1,
        updated_at = now()
      where id = fry_record.id;
    else
      for hatch_index in 1..greatest(fry_record.count, 1) loop
        insert into public.owned_fish (
          user_id,
          aquarium_id,
          species_id,
          nickname,
          hunger,
          vitality_points,
          good_cycle_streak,
          longevity_cycles_left,
          updated_at
        )
        values (
          target_user_id,
          target_aquarium_id,
          fry_record.species_id,
          fry_record.species || ' juvenile',
          78,
          9,
          0,
          fry_record.lifespan_cycles,
          now()
        );
      end loop;

      delete from public.fry_batches
      where id = fry_record.id;

      perform public.append_journal_log_entry(
        target_user_id,
        greatest(fry_record.count, 1) || ' alevin(s) de ' || fry_record.species || ' eclosent dans le bac.',
        target_aquarium_id
      );
    end if;
  end loop;

  delete from public.owned_plants
  where user_id = target_user_id
    and aquarium_id = target_aquarium_id
    and (vitality_points <= 0 or longevity_cycles_left <= 0);

  delete from public.owned_fish
  where user_id = target_user_id
    and aquarium_id = target_aquarium_id
    and (vitality_points <= 0 or longevity_cycles_left <= 0);

  update public.aquariums
  set
    water_quality = greatest(0, least(100, water_quality - water_drop)),
    ph_level = greatest(5.5, least(8.5, ph_level - ph_drop_total)),
    co2_level = public.get_diffuser_output(diffuser_level),
    feed_uses_this_cycle = 0,
    updated_at = now()
  where id = target_aquarium_id;
end;
$$;

create or replace function public.sync_offline_cycles_for_user()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  cycle_anchor record;
  aquarium_record record;
  cycles_due integer;
  cycle_index integer;
  next_cycle_number integer;
  next_auto_cycle_at timestamptz;
begin
  if current_user_id is null then
    raise exception 'Authentification requise';
  end if;

  select id, cycle_number, last_auto_cycle_at
  into cycle_anchor
  from public.aquariums
  where user_id = current_user_id
  order by slot_index
  limit 1
  for update;

  if cycle_anchor.id is null then
    return;
  end if;

  cycles_due := floor(greatest(extract(epoch from (now() - cycle_anchor.last_auto_cycle_at)), 0) / 14400)::integer;

  if cycles_due <= 0 then
    return;
  end if;

  for cycle_index in 1..cycles_due loop
    for aquarium_record in
      select id
      from public.aquariums
      where user_id = current_user_id
      order by slot_index
    loop
      perform public.apply_single_cycle_to_aquarium(current_user_id, aquarium_record.id);
    end loop;
  end loop;

  next_cycle_number := coalesce(cycle_anchor.cycle_number, 1) + cycles_due;
  next_auto_cycle_at := cycle_anchor.last_auto_cycle_at + make_interval(hours => cycles_due * 4);

  update public.aquariums
  set
    cycle_number = next_cycle_number,
    minutes_remaining = 120,
    last_auto_cycle_at = next_auto_cycle_at,
    updated_at = now()
  where user_id = current_user_id;
end;
$$;

create or replace function public.bootstrap_player_core_state()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  cycle_anchor record;
begin
  if current_user_id is null then
    raise exception 'Authentification requise';
  end if;

  insert into public.profiles (user_id, email, player_name, coins, pearls, level, xp, updated_at)
  values (
    current_user_id,
    auth.jwt()->>'email',
    coalesce(nullif(split_part(auth.jwt()->>'email', '@', 1), ''), 'Gardien des recifs'),
    240,
    12,
    1,
    0,
    now()
  )
  on conflict (user_id) do update
  set
    email = coalesce(public.profiles.email, excluded.email),
    player_name = coalesce(public.profiles.player_name, excluded.player_name),
    updated_at = now();

  if not exists (
    select 1
    from public.aquariums
    where user_id = current_user_id
  ) then
    insert into public.aquariums (
      user_id,
      slot_index,
      name,
      water_quality,
      temperature_target,
      light_hours,
      co2_level,
      ph_level,
      lamp_level,
      diffuser_level,
      filter_level,
      feed_uses_this_cycle,
      cycle_number,
      minutes_remaining,
      last_auto_cycle_at
    )
    values (
      current_user_id,
      1,
      'Lagon des lucioles',
      84,
      24,
      2,
      4,
      7,
      1,
      1,
      1,
      0,
      1,
      120,
      now()
    );
  end if;

  update public.aquariums
  set
    lamp_level = greatest(1, least(lamp_level, 5)),
    diffuser_level = greatest(1, least(diffuser_level, 5)),
    filter_level = greatest(1, least(filter_level, 5)),
    light_hours = greatest(0, least(public.get_lamp_max_hours(lamp_level), light_hours)),
    co2_level = public.get_diffuser_output(diffuser_level),
    last_auto_cycle_at = coalesce(last_auto_cycle_at, now()),
    updated_at = now()
  where user_id = current_user_id;

  select cycle_number, minutes_remaining, last_auto_cycle_at
  into cycle_anchor
  from public.aquariums
  where user_id = current_user_id
  order by slot_index
  limit 1;

  update public.aquariums
  set
    cycle_number = coalesce(cycle_anchor.cycle_number, 1),
    minutes_remaining = coalesce(cycle_anchor.minutes_remaining, 120),
    last_auto_cycle_at = coalesce(cycle_anchor.last_auto_cycle_at, now()),
    updated_at = now()
  where user_id = current_user_id;

  perform public.sync_offline_cycles_for_user();
  perform public.refresh_daily_missions_for_user(current_user_id);

  return public.get_player_core_state_by_user(current_user_id);
end;
$$;

create or replace function public.get_player_core_state()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Authentification requise';
  end if;

  perform public.bootstrap_player_core_state();
  return public.get_player_core_state_by_user(current_user_id);
end;
$$;

create or replace function public.advance_cycle_server(target_aquarium_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  target_profile public.profiles%rowtype;
  target_aquarium public.aquariums%rowtype;
  cycle_anchor record;
  aquarium_record record;
  pearl_cost integer := 3;
begin
  if current_user_id is null then
    raise exception 'Authentification requise';
  end if;

  perform public.bootstrap_player_core_state();

  select *
  into target_profile
  from public.profiles
  where user_id = current_user_id
  for update;

  select *
  into target_aquarium
  from public.aquariums
  where id = target_aquarium_id
    and user_id = current_user_id
  for update;

  if target_aquarium.id is null then
    raise exception 'Aquarium introuvable ou non autorise';
  end if;

  select id, cycle_number
  into cycle_anchor
  from public.aquariums
  where user_id = current_user_id
  order by slot_index
  limit 1
  for update;

  if not coalesce(target_profile.onboarding_completed, false)
     and coalesce(target_profile.onboarding_step, 0) = 8 then
    pearl_cost := 0;
  end if;

  if target_profile.pearls < pearl_cost then
    raise exception 'Perles insuffisantes pour passer le cycle';
  end if;

  if pearl_cost > 0 then
    update public.profiles
    set
      pearls = pearls - pearl_cost,
      updated_at = now()
    where user_id = current_user_id;
  else
    update public.profiles
    set updated_at = now()
    where user_id = current_user_id;
  end if;

  for aquarium_record in
    select id
    from public.aquariums
    where user_id = current_user_id
    order by slot_index
  loop
    perform public.apply_single_cycle_to_aquarium(current_user_id, aquarium_record.id);
  end loop;

  update public.aquariums
  set
    cycle_number = coalesce(cycle_anchor.cycle_number, 1) + 1,
    minutes_remaining = 120,
    last_auto_cycle_at = now(),
    updated_at = now()
  where user_id = current_user_id;

  if not coalesce(target_profile.onboarding_completed, false)
     and coalesce(target_profile.onboarding_step, 0) = 8 then
    update public.aquariums
    set
      ph_level = greatest(5.5, ph_level - 1.0),
      updated_at = now()
    where id = target_aquarium_id
      and user_id = current_user_id;
  end if;

  perform public.append_journal_log_entry(current_user_id, 'Le cycle suivant commence immediatement.', target_aquarium_id);

  return public.get_player_core_state_by_user(current_user_id);
end;
$$;

create or replace function public.buy_aquarium_slot_server()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  target_profile public.profiles%rowtype;
  cycle_anchor record;
  aquarium_count integer;
  next_slot integer;
  pearl_cost integer;
begin
  if current_user_id is null then
    raise exception 'Authentification requise';
  end if;

  perform public.bootstrap_player_core_state();

  select *
  into target_profile
  from public.profiles
  where user_id = current_user_id
  for update;

  select count(*)
  into aquarium_count
  from public.aquariums
  where user_id = current_user_id;

  select cycle_number, minutes_remaining, last_auto_cycle_at
  into cycle_anchor
  from public.aquariums
  where user_id = current_user_id
  order by slot_index
  limit 1;

  if aquarium_count >= 4 then
    raise exception 'Tu as atteint le nombre maximum d''aquariums';
  end if;

  next_slot := aquarium_count + 1;
  pearl_cost := case aquarium_count
    when 1 then 18
    when 2 then 28
    when 3 then 40
    else 0
  end;

  if target_profile.pearls < pearl_cost then
    raise exception 'Perles insuffisantes pour debloquer un nouvel aquarium';
  end if;

  update public.profiles
  set
    pearls = pearls - pearl_cost,
    updated_at = now()
  where user_id = current_user_id;

  insert into public.aquariums (
    user_id,
    slot_index,
    name,
    water_quality,
    temperature_target,
    light_hours,
    co2_level,
    ph_level,
    lamp_level,
    diffuser_level,
    filter_level,
    feed_uses_this_cycle,
    cycle_number,
    minutes_remaining,
    last_auto_cycle_at
  )
  values (
    current_user_id,
    next_slot,
    'Aquarium ' || next_slot,
    84,
    24,
    2,
    4,
    7,
    1,
    1,
    1,
    0,
    coalesce(cycle_anchor.cycle_number, 1),
    coalesce(cycle_anchor.minutes_remaining, 120),
    coalesce(cycle_anchor.last_auto_cycle_at, now())
  );

  perform public.append_journal_log_entry(current_user_id, 'Un nouvel aquarium vient d''etre debloque.', null);
  perform public.append_community_feed_entry(current_user_id, 'Port communautaire', 'Un nouveau bassin rejoint le domaine du joueur.', null);

  return public.get_player_core_state_by_user(current_user_id);
end;
$$;

create or replace function public.breed_fish_server(target_aquarium_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  aquarium_record public.aquariums%rowtype;
  breeder_count integer;
  support_bonus integer;
  success_chance numeric;
  batch_count integer;
  parent_species_id text;
begin
  if current_user_id is null then
    raise exception 'Authentification requise';
  end if;

  perform public.bootstrap_player_core_state();
  perform public.ensure_aquarium_minutes(target_aquarium_id, 25);

  select *
  into aquarium_record
  from public.aquariums
  where id = target_aquarium_id
    and user_id = current_user_id
  for update;

  if aquarium_record.id is null then
    raise exception 'Aquarium introuvable ou non autorise';
  end if;

  select count(*)
  into breeder_count
  from public.owned_fish f
  where f.user_id = current_user_id
    and f.aquarium_id = target_aquarium_id
    and f.vitality_points >= 7
    and f.hunger >= 24;

  if breeder_count < 2 or aquarium_record.water_quality < 62 then
    raise exception 'Il faut au moins deux poissons adultes en bon confort';
  end if;

  perform public.spend_user_cycle_minutes(current_user_id, 25);

  select coalesce(sum(c.comfort_bonus), 0)
  into support_bonus
  from public.owned_plants p
  join public.plant_species_catalog c on c.id = p.species_id
  where p.user_id = current_user_id
    and p.aquarium_id = target_aquarium_id;

  success_chance := least(
    0.85,
    0.20
    + (greatest(aquarium_record.water_quality - 60, 0) / 180.0)
    + (least(support_bonus, 24) / 100.0)
    + (public.get_filter_reduction(aquarium_record.filter_level) * 0.6)
  );

  if random() <= success_chance then
    select f.species_id
    into parent_species_id
    from public.owned_fish f
    where f.user_id = current_user_id
      and f.aquarium_id = target_aquarium_id
    order by f.created_at
    limit 1;

    batch_count := least(3, 1 + floor(least(support_bonus, 20) / 9.0)::integer + case when random() < 0.35 then 1 else 0 end);

    insert into public.fry_batches (
      user_id,
      aquarium_id,
      species_id,
      count,
      cycles_remaining,
      updated_at
    )
    values (
      current_user_id,
      target_aquarium_id,
      parent_species_id,
      greatest(batch_count, 1),
      2,
      now()
    );

    perform public.grant_profile_xp(current_user_id, 24);
    perform public.append_journal_log_entry(current_user_id, 'Une nouvelle portee evoluera au prochain cycle.', target_aquarium_id);
    perform public.append_community_feed_entry(current_user_id, 'Port communautaire', 'Une nouvelle portee est surveillee dans ce bassin.', target_aquarium_id);
  else
    perform public.append_journal_log_entry(current_user_id, 'La saison n''est pas encore assez favorable.', target_aquarium_id);
  end if;

  perform public.increment_mission_tracker(current_user_id, 'breedCount', 1);

  return public.get_player_core_state_by_user(current_user_id);
end;
$$;

drop function if exists public.buy_server_item(text, text, uuid);

create or replace function public.buy_server_item(target_item_category text, target_item_key text, target_aquarium_id uuid default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  target_profile public.profiles%rowtype;
  target_aquarium public.aquariums%rowtype;
  fish_row public.fish_species_catalog%rowtype;
  plant_row public.plant_species_catalog%rowtype;
  utility_row public.utility_shop_catalog%rowtype;
  effective_cost integer;
  owned_plant_count integer := 0;
  has_ph_up boolean := false;
  has_ph_down boolean := false;
  food_inventory_quantity integer := 0;
begin
  if current_user_id is null then
    raise exception 'Authentification requise';
  end if;

  perform public.bootstrap_player_core_state();

  select *
  into target_profile
  from public.profiles
  where user_id = current_user_id
  for update;

  case target_item_category
    when 'fish' then
      select *
      into fish_row
      from public.fish_species_catalog
      where id = target_item_key;

      if fish_row.id is null then
        raise exception 'Espece de poisson introuvable';
      end if;

      effective_cost := fish_row.cost;

      if target_profile.coins < effective_cost then
        raise exception 'Coquillages insuffisants';
      end if;

      update public.profiles
      set
        coins = coins - effective_cost,
        updated_at = now()
      where user_id = current_user_id;

      if target_aquarium_id is not null then
        select *
        into target_aquarium
        from public.aquariums
        where id = target_aquarium_id
          and user_id = current_user_id;

        if target_aquarium.id is null then
          raise exception 'Aquarium introuvable ou non autorise';
        end if;
      end if;

      insert into public.owned_fish (
        user_id,
        aquarium_id,
        species_id,
        nickname,
        hunger,
        vitality_points,
        good_cycle_streak,
        longevity_cycles_left
      )
      values (
        current_user_id,
        target_aquarium_id,
        fish_row.id,
        fish_row.species,
        100,
        10,
        0,
        fish_row.lifespan_cycles
      );

      perform public.increment_mission_tracker(current_user_id, 'purchaseCount', 1);
      perform public.increment_mission_tracker(current_user_id, 'adoptionCount', 1);
      perform public.grant_profile_xp(current_user_id, 15);
      perform public.append_journal_log_entry(current_user_id, fish_row.species || ' rejoint l''aquarium.', target_aquarium_id);
      perform public.append_community_feed_entry(current_user_id, 'Toi', 'a adopte un ' || lower(fish_row.species) || '.', target_aquarium_id);

    when 'plant' then
      select *
      into plant_row
      from public.plant_species_catalog
      where id = target_item_key;

      if plant_row.id is null then
        raise exception 'Espece de plante introuvable';
      end if;

      select count(*)
      into owned_plant_count
      from public.owned_plants
      where user_id = current_user_id;

      effective_cost := plant_row.cost;
      if not coalesce(target_profile.onboarding_completed, false)
         and coalesce(target_profile.onboarding_step, 0) = 2
         and owned_plant_count < 2 then
        effective_cost := 0;
      end if;

      if target_profile.coins < effective_cost then
        raise exception 'Coquillages insuffisants';
      end if;

      update public.profiles
      set
        coins = coins - effective_cost,
        updated_at = now()
      where user_id = current_user_id;

      insert into public.owned_plants (
        user_id,
        species_id,
        nickname,
        depth,
        x_percent,
        vitality_points,
        good_cycle_streak,
        longevity_cycles_left
      )
      values (
        current_user_id,
        plant_row.id,
        plant_row.species,
        2,
        50,
        10,
        0,
        plant_row.lifespan_cycles
      );

      perform public.increment_mission_tracker(current_user_id, 'purchaseCount', 1);
      perform public.grant_profile_xp(current_user_id, 10);
      perform public.append_journal_log_entry(current_user_id, 'Achat realise: ' || plant_row.species || '.', null);

    when 'utility', 'equipment' then
      select *
      into utility_row
      from public.utility_shop_catalog
      where id = target_item_key
        and category = target_item_category;

      if utility_row.id is null then
        raise exception 'Objet de boutique introuvable';
      end if;

      effective_cost := utility_row.cost;
      if not coalesce(target_profile.onboarding_completed, false) then
        if coalesce(target_profile.onboarding_step, 0) = 1 and target_item_key = 'co2-upgrade-2' then
          effective_cost := 0;
        elsif coalesce(target_profile.onboarding_step, 0) = 6 and target_item_key = 'food-pack' then
          select coalesce(quantity, 0)
          into food_inventory_quantity
          from public.utility_inventory
          where user_id = current_user_id
            and item_key = 'food';

          if food_inventory_quantity <= 0 then
            effective_cost := 0;
          end if;
        elsif coalesce(target_profile.onboarding_step, 0) = 10 then
          select exists(
            select 1
            from public.utility_inventory
            where user_id = current_user_id
              and item_key = 'ph-up'
              and quantity > 0
          )
          into has_ph_up;

          select exists(
            select 1
            from public.utility_inventory
            where user_id = current_user_id
              and item_key = 'ph-down'
              and quantity > 0
          )
          into has_ph_down;

          if target_item_key = 'ph-up-tabs' and not has_ph_up then
            effective_cost := 0;
          elsif target_item_key = 'ph-down-tabs' and not has_ph_down then
            effective_cost := 0;
          end if;
        end if;
      end if;

      if target_profile.coins < effective_cost then
        raise exception 'Coquillages insuffisants';
      end if;

      update public.profiles
      set
        coins = coins - effective_cost,
        updated_at = now()
      where user_id = current_user_id;

      if utility_row.category = 'utility' then
        insert into public.utility_inventory (user_id, item_key, quantity, updated_at)
        values (current_user_id, utility_row.inventory_key, utility_row.amount, now())
        on conflict (user_id, item_key) do update
        set
          quantity = public.utility_inventory.quantity + excluded.quantity,
          updated_at = now();
      else
        if target_aquarium_id is null then
          raise exception 'Choisis un aquarium pour installer cet equipement';
        end if;

        select *
        into target_aquarium
        from public.aquariums
        where id = target_aquarium_id
          and user_id = current_user_id
        for update;

        if target_aquarium.id is null then
          raise exception 'Aquarium introuvable ou non autorise';
        end if;

        case utility_row.equipment_type
          when 'lamp' then
            if utility_row.target_level <> target_aquarium.lamp_level + 1 then
              raise exception 'Cette lampe ne correspond pas au prochain palier';
            end if;

            update public.aquariums
            set
              lamp_level = utility_row.target_level,
              light_hours = greatest(0, least(public.get_lamp_max_hours(utility_row.target_level), light_hours)),
              updated_at = now()
            where id = target_aquarium_id;

          when 'co2' then
            if utility_row.target_level <> target_aquarium.diffuser_level + 1 then
              raise exception 'Ce diffuseur ne correspond pas au prochain palier';
            end if;

            update public.aquariums
            set
              diffuser_level = utility_row.target_level,
              co2_level = public.get_diffuser_output(utility_row.target_level),
              updated_at = now()
            where id = target_aquarium_id;

          when 'filter' then
            if utility_row.target_level <> target_aquarium.filter_level + 1 then
              raise exception 'Ce filtre ne correspond pas au prochain palier';
            end if;

            update public.aquariums
            set
              filter_level = utility_row.target_level,
              updated_at = now()
            where id = target_aquarium_id;

          else
            raise exception 'Type d''equipement non gere';
        end case;
      end if;

      perform public.increment_mission_tracker(current_user_id, 'purchaseCount', 1);
      perform public.grant_profile_xp(current_user_id, 10);
      perform public.append_journal_log_entry(current_user_id, 'Achat realise: ' || utility_row.display_name || '.', target_aquarium_id);

    else
      raise exception 'Categorie de boutique non prise en charge';
  end case;

  return public.get_player_core_state_by_user(current_user_id);
end;
$$;

drop function if exists public.use_inventory_utility_server(text, uuid);

create or replace function public.use_inventory_utility_server(target_item_key text, target_aquarium_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  inventory_row public.utility_inventory%rowtype;
  aquarium_record public.aquariums%rowtype;
  target_profile public.profiles%rowtype;
  delta numeric;
  fish_count integer;
begin
  if current_user_id is null then
    raise exception 'Authentification requise';
  end if;

  perform public.bootstrap_player_core_state();
  perform public.ensure_aquarium_minutes(target_aquarium_id, 5);

  select *
  into aquarium_record
  from public.aquariums
  where id = target_aquarium_id
    and user_id = current_user_id
  for update;

  select *
  into target_profile
  from public.profiles
  where user_id = current_user_id
  for update;

  select *
  into inventory_row
  from public.utility_inventory
  where user_id = current_user_id
    and item_key = use_inventory_utility_server.target_item_key
  for update;

  if inventory_row.user_id is null or inventory_row.quantity <= 0 then
    raise exception 'Aucun utilitaire disponible pour cette action';
  end if;

  case target_item_key
    when 'food' then
      select count(*)
      into fish_count
      from public.owned_fish
      where user_id = current_user_id
        and aquarium_id = target_aquarium_id;

      if fish_count <= 0 then
        raise exception 'Aucun poisson a nourrir dans ce bac';
      end if;

      update public.owned_fish
      set
        hunger = least(100, hunger + 22),
        updated_at = now()
      where user_id = current_user_id
        and aquarium_id = target_aquarium_id;

      perform public.spend_user_cycle_minutes(current_user_id, 5);

      update public.aquariums
      set
        feed_uses_this_cycle = feed_uses_this_cycle + 1,
        updated_at = now()
      where id = target_aquarium_id;

      perform public.grant_profile_xp(current_user_id, 14);
      perform public.append_journal_log_entry(current_user_id, 'La nourriture tombe dans le bac.', target_aquarium_id);
      perform public.append_community_feed_entry(current_user_id, 'Toi', 'vient de nourrir tout son aquarium.', target_aquarium_id);

    when 'water' then
      perform public.spend_user_cycle_minutes(current_user_id, 5);

      update public.aquariums
      set
        water_quality = least(100, water_quality + 18),
        updated_at = now()
      where id = target_aquarium_id;

      perform public.append_journal_log_entry(current_user_id, 'Le changement d''eau a stabilise le bac.', target_aquarium_id);

    when 'ph-up' then
      perform public.spend_user_cycle_minutes(current_user_id, 5);
      if not coalesce(target_profile.onboarding_completed, false)
         and coalesce(target_profile.onboarding_step, 0) = 11 then
        update public.aquariums
        set
          ph_level = 7.1,
          updated_at = now()
        where id = target_aquarium_id;
      else
        delta := 0.6 + random() * 0.2;
        update public.aquariums
        set
          ph_level = least(8.5, ph_level + delta),
          updated_at = now()
        where id = target_aquarium_id;
      end if;

      perform public.append_journal_log_entry(current_user_id, 'Le pH remonte legerement.', target_aquarium_id);

    when 'ph-down' then
      delta := 0.6 + random() * 0.2;
      perform public.spend_user_cycle_minutes(current_user_id, 5);

      update public.aquariums
      set
        ph_level = greatest(5.5, ph_level - delta),
        updated_at = now()
      where id = target_aquarium_id;

      perform public.append_journal_log_entry(current_user_id, 'Le pH baisse legerement.', target_aquarium_id);

    else
      raise exception 'Utilitaire non gere';
  end case;

  update public.utility_inventory
  set
    quantity = quantity - 1,
    updated_at = now()
  where user_id = current_user_id
    and item_key = use_inventory_utility_server.target_item_key;

  delete from public.utility_inventory
  where user_id = current_user_id
    and item_key = use_inventory_utility_server.target_item_key
    and quantity <= 0;

  return public.get_player_core_state_by_user(current_user_id);
end;
$$;

create or replace function public.clean_aquarium_server(target_aquarium_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Authentification requise';
  end if;

  perform public.bootstrap_player_core_state();
  perform public.ensure_aquarium_minutes(target_aquarium_id, 5);
  perform public.spend_user_cycle_minutes(current_user_id, 5);

  update public.aquariums
  set
    water_quality = least(100, water_quality + 18),
    updated_at = now()
  where id = target_aquarium_id
    and user_id = current_user_id;

  perform public.increment_mission_tracker(current_user_id, 'cleanCount', 1);
  perform public.grant_profile_xp(current_user_id, 10);
  perform public.append_journal_log_entry(current_user_id, 'Le changement d''eau a stabilise le bac.', target_aquarium_id);

  return public.get_player_core_state_by_user(current_user_id);
end;
$$;

create or replace function public.update_aquarium_setting_server(target_aquarium_id uuid, setting_key text, setting_value numeric)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  aquarium_record public.aquariums%rowtype;
  next_temperature numeric;
  next_light integer;
begin
  if current_user_id is null then
    raise exception 'Authentification requise';
  end if;

  perform public.bootstrap_player_core_state();
  perform public.ensure_aquarium_minutes(target_aquarium_id, 5);

  select *
  into aquarium_record
  from public.aquariums
  where id = target_aquarium_id
    and user_id = current_user_id
  for update;

  if aquarium_record.id is null then
    raise exception 'Aquarium introuvable ou non autorise';
  end if;

  case setting_key
    when 'temperature' then
      next_temperature := greatest(20, least(30, setting_value));

      if next_temperature = aquarium_record.temperature_target then
        return public.get_player_core_state_by_user(current_user_id);
      end if;

      perform public.spend_user_cycle_minutes(current_user_id, 5);

      update public.aquariums
      set
        temperature_target = next_temperature,
        updated_at = now()
      where id = target_aquarium_id;

      perform public.append_journal_log_entry(
        current_user_id,
        'Nouvelle temperature cible: ' || replace(to_char(next_temperature, 'FM999990D0'), '.', ',') || ' C.',
        target_aquarium_id
      );

    when 'light' then
      next_light := greatest(0, least(public.get_lamp_max_hours(aquarium_record.lamp_level), floor(setting_value)::integer));

      if next_light = aquarium_record.light_hours then
        return public.get_player_core_state_by_user(current_user_id);
      end if;

      perform public.spend_user_cycle_minutes(current_user_id, 5);

      update public.aquariums
      set
        light_hours = next_light,
        updated_at = now()
      where id = target_aquarium_id;

      perform public.append_journal_log_entry(current_user_id, 'Nouvelle exposition lumineuse: ' || next_light || ' h.', target_aquarium_id);

    else
      raise exception 'Reglage non gere';
  end case;

  return public.get_player_core_state_by_user(current_user_id);
end;
$$;

create or replace function public.toggle_fish_placement_server(target_fish_id uuid, target_aquarium_id uuid default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  fish_record public.owned_fish%rowtype;
  aquarium_record public.aquariums%rowtype;
  effective_aquarium_id uuid;
begin
  if current_user_id is null then
    raise exception 'Authentification requise';
  end if;

  perform public.bootstrap_player_core_state();

  select *
  into fish_record
  from public.owned_fish
  where id = target_fish_id
    and user_id = current_user_id
  for update;

  if fish_record.id is null then
    raise exception 'Poisson introuvable ou non autorise';
  end if;

  if fish_record.aquarium_id is null then
    effective_aquarium_id := target_aquarium_id;
  elsif target_aquarium_id is not null and target_aquarium_id <> fish_record.aquarium_id then
    effective_aquarium_id := target_aquarium_id;
  else
    effective_aquarium_id := fish_record.aquarium_id;
  end if;

  if effective_aquarium_id is not null then
    perform public.ensure_aquarium_minutes(effective_aquarium_id, 5);
    perform public.spend_user_cycle_minutes(current_user_id, 5);
  end if;

  if fish_record.aquarium_id is null then
    if target_aquarium_id is null then
      raise exception 'Choisis un aquarium pour placer ce poisson';
    end if;

    select *
    into aquarium_record
    from public.aquariums
    where id = target_aquarium_id
      and user_id = current_user_id
    for update;

    if aquarium_record.id is null then
      raise exception 'Aquarium introuvable ou non autorise';
    end if;

    update public.owned_fish
    set
      aquarium_id = target_aquarium_id,
      updated_at = now()
    where id = target_fish_id;

    perform public.append_journal_log_entry(current_user_id, fish_record.nickname || ' rejoint l''aquarium.', target_aquarium_id);

  elsif target_aquarium_id is not null and target_aquarium_id <> fish_record.aquarium_id then
    select *
    into aquarium_record
    from public.aquariums
    where id = target_aquarium_id
      and user_id = current_user_id
    for update;

    if aquarium_record.id is null then
      raise exception 'Aquarium introuvable ou non autorise';
    end if;

    update public.owned_fish
    set
      aquarium_id = target_aquarium_id,
      updated_at = now()
    where id = target_fish_id;

    perform public.append_journal_log_entry(current_user_id, fish_record.nickname || ' change de bassin.', target_aquarium_id);

  else
    update public.owned_fish
    set
      aquarium_id = null,
      updated_at = now()
    where id = target_fish_id;

    perform public.append_journal_log_entry(current_user_id, fish_record.nickname || ' retourne en reserve.', fish_record.aquarium_id);
  end if;

  return public.get_player_core_state_by_user(current_user_id);
end;
$$;

create or replace function public.sell_owned_fish_server(target_fish_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  fish_record public.owned_fish%rowtype;
  species_record public.fish_species_catalog%rowtype;
  refund_coins integer := 0;
begin
  if current_user_id is null then
    raise exception 'Authentification requise';
  end if;

  perform public.bootstrap_player_core_state();

  select *
  into fish_record
  from public.owned_fish
  where id = target_fish_id
    and user_id = current_user_id
  for update;

  if fish_record.id is null then
    raise exception 'Poisson introuvable ou non autorise';
  end if;

  select *
  into species_record
  from public.fish_species_catalog
  where id = fish_record.species_id;

  refund_coins := greatest(0, floor(coalesce(species_record.cost, 0) * 0.6)::integer);

  delete from public.owned_fish
  where id = target_fish_id
    and user_id = current_user_id;

  update public.profiles
  set
    coins = coins + refund_coins,
    updated_at = now()
  where user_id = current_user_id;

  perform public.append_journal_log_entry(current_user_id, fish_record.nickname || ' a ete vendu.', fish_record.aquarium_id);

  return public.get_player_core_state_by_user(current_user_id);
end;
$$;

create or replace function public.sync_profile_snapshot_server(
  target_player_name text,
  target_coins integer,
  target_pearls integer,
  target_level integer,
  target_xp integer,
  target_aquarium_id uuid default null,
  target_aquarium_name text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Authentification requise';
  end if;

  perform public.bootstrap_player_core_state();

  update public.profiles
  set
    player_name = coalesce(nullif(trim(target_player_name), ''), player_name),
    coins = greatest(0, coalesce(target_coins, coins)),
    pearls = greatest(0, coalesce(target_pearls, pearls)),
    level = greatest(1, coalesce(target_level, level)),
    xp = greatest(0, coalesce(target_xp, xp)),
    updated_at = now()
  where user_id = current_user_id;

  if target_aquarium_id is not null and nullif(trim(coalesce(target_aquarium_name, '')), '') is not null then
    update public.aquariums
    set
      name = left(trim(target_aquarium_name), 48),
      updated_at = now()
    where id = target_aquarium_id
      and user_id = current_user_id;
  end if;
end;
$$;

create or replace function public.update_onboarding_state_server(
  target_step integer default null,
  target_completed boolean default null,
  target_reward_claimed boolean default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Authentification requise';
  end if;

  perform public.bootstrap_player_core_state();

  update public.profiles
  set
    onboarding_step = greatest(
      coalesce(onboarding_step, 0),
      least(
        coalesce(target_step, onboarding_step, 0),
        case
          when coalesce(onboarding_reward_claimed, false) then 13
          else coalesce(onboarding_step, 0) + 1
        end
      )
    ),
    onboarding_completed =
      case
        when coalesce(target_completed, false) and coalesce(onboarding_reward_claimed, false) then true
        else onboarding_completed
      end,
    onboarding_reward_claimed = onboarding_reward_claimed,
    updated_at = now()
  where user_id = current_user_id;

  return public.get_player_core_state_by_user(current_user_id);
end;
$$;

create or replace function public.claim_onboarding_reward_server()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  target_profile public.profiles%rowtype;
begin
  if current_user_id is null then
    raise exception 'Authentification requise';
  end if;

  perform public.bootstrap_player_core_state();

  select *
  into target_profile
  from public.profiles
  where user_id = current_user_id
  for update;

  if coalesce(target_profile.onboarding_reward_claimed, false) then
    return public.get_player_core_state_by_user(current_user_id);
  end if;

  if coalesce(target_profile.onboarding_step, 0) < 11 then
    raise exception 'Le tutoriel n''est pas encore termine';
  end if;

  update public.profiles
  set
    coins = coins + 200,
    pearls = pearls + 10,
    onboarding_step = greatest(coalesce(onboarding_step, 0), 12),
    onboarding_reward_claimed = true,
    updated_at = now()
  where user_id = current_user_id;

  perform public.append_journal_log_entry(
    current_user_id,
    'Fin du tutoriel: 200 coquillages et 10 perles ont ete ajoutes.',
    null
  );

  return public.get_player_core_state_by_user(current_user_id);
end;
$$;

drop function if exists public.toggle_plant_placement_server(uuid, uuid, integer);

create or replace function public.toggle_plant_placement_server(
  target_plant_id uuid,
  target_aquarium_id uuid default null,
  target_depth integer default 2,
  target_x_percent numeric default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  plant_record public.owned_plants%rowtype;
  aquarium_record public.aquariums%rowtype;
  normalized_depth integer := case when target_depth = 1 then 1 else 2 end;
  normalized_x numeric := greatest(6, least(94, coalesce(target_x_percent, 50)));
begin
  if current_user_id is null then
    raise exception 'Authentification requise';
  end if;

  perform public.bootstrap_player_core_state();

  select *
  into plant_record
  from public.owned_plants
  where id = target_plant_id
    and user_id = current_user_id
  for update;

  if plant_record.id is null then
    raise exception 'Plante introuvable ou non autorisee';
  end if;

  if plant_record.aquarium_id is null then
    if target_aquarium_id is null then
      raise exception 'Choisis un aquarium pour planter cet element';
    end if;

    perform public.ensure_aquarium_minutes(target_aquarium_id, 5);
    perform public.spend_user_cycle_minutes(current_user_id, 5);

    select *
    into aquarium_record
    from public.aquariums
    where id = target_aquarium_id
      and user_id = current_user_id
    for update;

    if aquarium_record.id is null then
      raise exception 'Aquarium introuvable ou non autorise';
    end if;

    update public.owned_plants
    set
      aquarium_id = target_aquarium_id,
      depth = normalized_depth,
      x_percent = normalized_x,
      updated_at = now()
    where id = target_plant_id;

    perform public.grant_profile_xp(current_user_id, 18);
    perform public.append_journal_log_entry(current_user_id, plant_record.nickname || ' a ete plantee dans le bac.', target_aquarium_id);
    perform public.append_community_feed_entry(current_user_id, 'Toi', 'vient de planter ' || coalesce(plant_record.nickname, 'une plante') || ' dans l''aquarium principal.', target_aquarium_id);

  elsif target_aquarium_id is not null and target_aquarium_id <> plant_record.aquarium_id then
    perform public.ensure_aquarium_minutes(target_aquarium_id, 5);
    perform public.spend_user_cycle_minutes(current_user_id, 5);

    select *
    into aquarium_record
    from public.aquariums
    where id = target_aquarium_id
      and user_id = current_user_id
    for update;

    if aquarium_record.id is null then
      raise exception 'Aquarium introuvable ou non autorise';
    end if;

    update public.owned_plants
    set
      aquarium_id = target_aquarium_id,
      depth = normalized_depth,
      x_percent = normalized_x,
      updated_at = now()
    where id = target_plant_id;

    perform public.append_journal_log_entry(current_user_id, plant_record.nickname || ' change de bassin.', target_aquarium_id);

  elsif target_aquarium_id is not null and target_aquarium_id = plant_record.aquarium_id then
    perform public.ensure_aquarium_minutes(target_aquarium_id, 5);
    perform public.spend_user_cycle_minutes(current_user_id, 5);

    update public.owned_plants
    set
      depth = normalized_depth,
      x_percent = normalized_x,
      updated_at = now()
    where id = target_plant_id;

    perform public.append_journal_log_entry(current_user_id, plant_record.nickname || ' a ete deplacee dans le bac.', target_aquarium_id);

  else
    perform public.ensure_aquarium_minutes(plant_record.aquarium_id, 5);
    perform public.spend_user_cycle_minutes(current_user_id, 5);

    update public.owned_plants
    set
      aquarium_id = null,
      updated_at = now()
    where id = target_plant_id;

    perform public.append_journal_log_entry(current_user_id, plant_record.nickname || ' retourne en reserve.', plant_record.aquarium_id);
  end if;

  return public.get_player_core_state_by_user(current_user_id);
end;
$$;

create or replace function public.sell_owned_plant_server(target_plant_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  plant_record public.owned_plants%rowtype;
  species_record public.plant_species_catalog%rowtype;
  refund_coins integer := 0;
begin
  if current_user_id is null then
    raise exception 'Authentification requise';
  end if;

  perform public.bootstrap_player_core_state();

  select *
  into plant_record
  from public.owned_plants
  where id = target_plant_id
    and user_id = current_user_id
  for update;

  if plant_record.id is null then
    raise exception 'Plante introuvable ou non autorisee';
  end if;

  select *
  into species_record
  from public.plant_species_catalog
  where id = plant_record.species_id;

  refund_coins := greatest(0, floor(coalesce(species_record.cost, 0) * 0.6)::integer);

  delete from public.owned_plants
  where id = target_plant_id
    and user_id = current_user_id;

  update public.profiles
  set
    coins = coins + refund_coins,
    updated_at = now()
  where user_id = current_user_id;

  perform public.append_journal_log_entry(current_user_id, plant_record.nickname || ' a ete vendue.', plant_record.aquarium_id);

  return public.get_player_core_state_by_user(current_user_id);
end;
$$;

create or replace function public.claim_daily_reward_server()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  target_profile public.profiles%rowtype;
  today_date date := timezone('Europe/Paris', now())::date;
  reward_coins integer;
  reward_pearls integer := 4;
begin
  if current_user_id is null then
    raise exception 'Authentification requise';
  end if;

  perform public.bootstrap_player_core_state();
  perform public.refresh_daily_missions_for_user(current_user_id);

  select *
  into target_profile
  from public.profiles
  where user_id = current_user_id
  for update;

  if target_profile.last_reward_at = today_date then
    raise exception 'La recompense du jour a deja ete recuperée';
  end if;

  reward_coins := 80 + greatest(1, coalesce(target_profile.level, 1)) * 12;

  update public.profiles
  set
    coins = coins + reward_coins,
    pearls = pearls + reward_pearls,
    last_reward_at = today_date,
    updated_at = now()
  where user_id = current_user_id;

  insert into public.utility_inventory (user_id, item_key, quantity, updated_at)
  values (current_user_id, 'food', 3, now())
  on conflict (user_id, item_key) do update
  set
    quantity = public.utility_inventory.quantity + excluded.quantity,
    updated_at = now();

  perform public.increment_mission_tracker(current_user_id, 'dailyRewardCount', 1);
  perform public.grant_profile_xp(current_user_id, 20);
  perform public.append_journal_log_entry(
    current_user_id,
    'Recompense quotidienne obtenue: ' || reward_coins || ' coquillages, ' || reward_pearls || ' perles.',
    null
  );

  return public.get_player_core_state_by_user(current_user_id);
end;
$$;

create or replace function public.claim_mission_server(target_mission_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  target_profile public.profiles%rowtype;
  mission_row public.mission_catalog%rowtype;
  mission_progress integer;
begin
  if current_user_id is null then
    raise exception 'Authentification requise';
  end if;

  perform public.bootstrap_player_core_state();
  perform public.refresh_daily_missions_for_user(current_user_id);

  select *
  into target_profile
  from public.profiles
  where user_id = current_user_id
  for update;

  if not coalesce(target_profile.mission_selected_ids, '[]'::jsonb) ? target_mission_id then
    raise exception 'Mission introuvable pour aujourd''hui';
  end if;

  if coalesce(target_profile.mission_claimed_ids, '[]'::jsonb) ? target_mission_id then
    raise exception 'Mission deja recuperee';
  end if;

  select *
  into mission_row
  from public.mission_catalog
  where id = target_mission_id;

  if mission_row.id is null then
    raise exception 'Mission inconnue';
  end if;

  mission_progress := coalesce((target_profile.mission_trackers->>mission_row.tracker)::integer, 0);
  if mission_progress < mission_row.goal then
    raise exception 'Mission non terminee';
  end if;

  update public.profiles
  set
    coins = coins + mission_row.reward_coins,
    pearls = pearls + mission_row.reward_pearls,
    mission_claimed_ids = coalesce(mission_claimed_ids, '[]'::jsonb) || jsonb_build_array(target_mission_id),
    updated_at = now()
  where user_id = current_user_id;

  perform public.grant_profile_xp(current_user_id, 16);
  perform public.append_journal_log_entry(current_user_id, 'Mission terminee: ' || mission_row.label || '.', null);

  return public.get_player_core_state_by_user(current_user_id);
end;
$$;

create or replace function public.rename_player_server(target_player_name text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  cleaned_name text := left(trim(coalesce(target_player_name, '')), 26);
begin
  if current_user_id is null then
    raise exception 'Authentification requise';
  end if;

  if cleaned_name = '' then
    raise exception 'Nom joueur invalide';
  end if;

  perform public.bootstrap_player_core_state();

  if exists (
    select 1
    from public.profiles
    where user_id <> current_user_id
      and lower(player_name) = lower(cleaned_name)
  ) then
    raise exception 'Ce pseudo est deja utilise';
  end if;

  update public.profiles
  set
    player_name = cleaned_name,
    updated_at = now()
  where user_id = current_user_id;

  perform public.append_community_feed_entry(current_user_id, 'Port communautaire', cleaned_name || ' vient de hisser son fanion sur le recif.', null);

  return public.get_player_core_state_by_user(current_user_id);
end;
$$;

create or replace function public.rename_aquarium_server(target_aquarium_id uuid, target_name text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  cleaned_name text := left(trim(coalesce(target_name, '')), 28);
begin
  if current_user_id is null then
    raise exception 'Authentification requise';
  end if;

  if cleaned_name = '' then
    raise exception 'Nom aquarium invalide';
  end if;

  perform public.bootstrap_player_core_state();

  update public.aquariums
  set
    name = cleaned_name,
    updated_at = now()
  where id = target_aquarium_id
    and user_id = current_user_id;

  if not found then
    raise exception 'Aquarium introuvable ou non autorise';
  end if;

  perform public.append_journal_log_entry(current_user_id, 'Le nom de l''aquarium a ete mis a jour.', target_aquarium_id);

  return public.get_player_core_state_by_user(current_user_id);
end;
$$;

create or replace function public.visit_community_server(target_profile_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  base_reward integer := 26;
  hash_value integer := abs(hashtext(coalesce(target_profile_id, 'community')));
  bonus_food integer := case when mod(hash_value, 3) = 0 then 1 else 0 end;
  bonus_coins integer := case when mod(hash_value, 3) = 1 then 14 else 0 end;
  bonus_pearls integer := case when mod(hash_value, 3) = 2 then 2 else 0 end;
begin
  if current_user_id is null then
    raise exception 'Authentification requise';
  end if;

  perform public.bootstrap_player_core_state();
  perform public.increment_mission_tracker(current_user_id, 'visitCount', 1);

  update public.profiles
  set
    coins = coins + base_reward + bonus_coins,
    pearls = pearls + bonus_pearls,
    updated_at = now()
  where user_id = current_user_id;

  if bonus_food > 0 then
    insert into public.utility_inventory (user_id, item_key, quantity, updated_at)
    values (current_user_id, 'food', bonus_food, now())
    on conflict (user_id, item_key) do update
    set
      quantity = public.utility_inventory.quantity + excluded.quantity,
      updated_at = now();
  end if;

  perform public.grant_profile_xp(current_user_id, 11);
  perform public.append_journal_log_entry(current_user_id, 'Visite terminee. Recompense communautaire recue.', null);
  perform public.append_community_feed_entry(current_user_id, coalesce(target_profile_id, 'Voisin du port'), 'a remercie le joueur pour une visite chaleureuse.', null);

  return public.get_player_core_state_by_user(current_user_id);
end;
$$;

create or replace function public.run_speed_competition_server(target_aquarium_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  target_profile public.profiles%rowtype;
  selected_fish record;
  player_score numeric;
  rank integer;
  reward_pearls integer := 0;
  reward_coins integer := 0;
begin
  if current_user_id is null then
    raise exception 'Authentification requise';
  end if;

  perform public.bootstrap_player_core_state();
  perform public.ensure_aquarium_minutes(target_aquarium_id, 40);
  perform public.spend_user_cycle_minutes(current_user_id, 40);

  select *
  into target_profile
  from public.profiles
  where user_id = current_user_id
  for update;

  if target_profile.pearls < 2 then
    raise exception 'Il faut 2 perles pour cette competition';
  end if;

  select
    f.id,
    f.nickname,
    greatest(0, least(100, f.hunger)) as hunger,
    f.vitality_points,
    c.adult_size_cm
  into selected_fish
  from public.owned_fish f
  join public.fish_species_catalog c on c.id = f.species_id
  where f.user_id = current_user_id
    and f.aquarium_id = target_aquarium_id
  order by (c.adult_size_cm * 6 + f.vitality_points * 5 + f.hunger * 0.2) desc, f.created_at
  limit 1;

  if selected_fish.id is null then
    raise exception 'Aucun poisson disponible pour cette competition';
  end if;

  player_score := selected_fish.adult_size_cm * 6 + selected_fish.vitality_points * 5 + selected_fish.hunger * 0.2 + random() * 16;
  rank := 1
    + case when player_score < 92 then 1 else 0 end
    + case when player_score < 118 then 1 else 0 end
    + case when player_score < 138 then 1 else 0 end
    + case when player_score < 156 then 1 else 0 end;

  reward_pearls := case rank when 1 then 12 when 2 then 7 when 3 then 4 when 4 then 2 else 0 end;
  reward_coins := case rank when 1 then 56 when 2 then 34 when 3 then 20 when 4 then 8 else 0 end;

  update public.profiles
  set
    pearls = pearls - 2 + reward_pearls,
    coins = coins + reward_coins,
    competition_history = coalesce(competition_history, '[]'::jsonb) || jsonb_build_array(
      jsonb_build_object(
        'type', 'speed',
        'aquariumId', target_aquarium_id,
        'rank', rank,
        'score', round(player_score),
        'at', now()
      )
    ),
    updated_at = now()
  where user_id = current_user_id;

  update public.owned_fish
  set
    hunger = greatest(0, hunger - 8),
    updated_at = now()
  where id = selected_fish.id;

  perform public.append_journal_log_entry(
    current_user_id,
    selected_fish.nickname || ' termine ' || rank || case when rank = 1 then 'er' else 'e' end || ' en course de vitesse.',
    target_aquarium_id
  );
  perform public.append_community_feed_entry(
    current_user_id,
    'Port communautaire',
    selected_fish.nickname || ' brille en course de vitesse dans ce bassin.',
    target_aquarium_id
  );

  return public.get_player_core_state_by_user(current_user_id);
end;
$$;

create or replace function public.run_reflex_competition_server(target_aquarium_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  target_profile public.profiles%rowtype;
  selected_fish record;
  selected_plant record;
  player_score numeric;
  rank integer;
  reward_pearls integer := 0;
  reward_coins integer := 0;
begin
  if current_user_id is null then
    raise exception 'Authentification requise';
  end if;

  perform public.bootstrap_player_core_state();
  perform public.ensure_aquarium_minutes(target_aquarium_id, 20);
  perform public.spend_user_cycle_minutes(current_user_id, 20);

  select *
  into target_profile
  from public.profiles
  where user_id = current_user_id
  for update;

  if target_profile.pearls < 2 then
    raise exception 'Il faut 2 perles pour cette competition';
  end if;

  select
    f.id,
    f.nickname,
    greatest(0, least(100, f.hunger)) as hunger,
    f.vitality_points,
    c.adult_size_cm
  into selected_fish
  from public.owned_fish f
  join public.fish_species_catalog c on c.id = f.species_id
  where f.user_id = current_user_id
    and f.aquarium_id = target_aquarium_id
  order by ((14 - c.adult_size_cm) * 5 + f.vitality_points * 4 + f.hunger * 0.1) desc, f.created_at
  limit 1;

  select
    p.id,
    c.oxygen_generation,
    c.comfort_bonus
  into selected_plant
  from public.owned_plants p
  join public.plant_species_catalog c on c.id = p.species_id
  where p.user_id = current_user_id
    and p.aquarium_id = target_aquarium_id
  order by (c.oxygen_generation * 10 + c.comfort_bonus * 4) desc, p.created_at
  limit 1;

  if selected_fish.id is null or selected_plant.id is null then
    raise exception 'Il faut au moins un poisson et une plante pour cette competition';
  end if;

  player_score := ((14 - selected_fish.adult_size_cm) * 5) + selected_fish.vitality_points * 4 + selected_fish.hunger * 0.1 + random() * 14;
  rank := 1
    + case when player_score < 86 then 1 else 0 end
    + case when player_score < 108 then 1 else 0 end
    + case when player_score < 126 then 1 else 0 end
    + case when player_score < 142 then 1 else 0 end;

  reward_pearls := case rank when 1 then 10 when 2 then 6 when 3 then 3 when 4 then 1 else 0 end;
  reward_coins := case rank when 1 then 44 when 2 then 26 when 3 then 14 else 0 end;

  update public.profiles
  set
    pearls = pearls - 2 + reward_pearls,
    coins = coins + reward_coins,
    competition_history = coalesce(competition_history, '[]'::jsonb) || jsonb_build_array(
      jsonb_build_object(
        'type', 'reflex',
        'aquariumId', target_aquarium_id,
        'rank', rank,
        'score', round(player_score),
        'at', now()
      )
    ),
    updated_at = now()
  where user_id = current_user_id;

  update public.owned_fish
  set
    hunger = greatest(0, hunger - 6),
    updated_at = now()
  where id = selected_fish.id;

  perform public.append_journal_log_entry(
    current_user_id,
    'Competition Evite-plante terminee: duo classe ' || rank || case when rank = 1 then 'er' else 'e' end || '.',
    target_aquarium_id
  );
  perform public.append_community_feed_entry(
    current_user_id,
    'Port communautaire',
    'Un duo marque des points en competition Evite-plante.',
    target_aquarium_id
  );

  return public.get_player_core_state_by_user(current_user_id);
end;
$$;

create or replace function public.enter_beauty_contest_server(target_aquarium_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  target_profile public.profiles%rowtype;
  week_key text := public.get_week_key_paris();
  beauty_score numeric := 0;
  fish_count integer := 0;
  plant_count integer := 0;
  avg_vitality numeric := 0;
  aquarium_quality numeric := 0;
  rank integer;
  reward_pearls integer := 0;
  reward_coins integer := 0;
begin
  if current_user_id is null then
    raise exception 'Authentification requise';
  end if;

  perform public.bootstrap_player_core_state();
  perform public.ensure_aquarium_minutes(target_aquarium_id, 10);
  perform public.spend_user_cycle_minutes(current_user_id, 10);

  select *
  into target_profile
  from public.profiles
  where user_id = current_user_id
  for update;

  if coalesce(target_profile.weekly_contest_entries, '{}'::jsonb)->>target_aquarium_id::text = week_key then
    raise exception 'Cet aquarium participe deja au concours de la semaine';
  end if;

  select coalesce(count(*), 0), coalesce(avg(vitality_points), 0)
  into fish_count, avg_vitality
  from public.owned_fish
  where user_id = current_user_id
    and aquarium_id = target_aquarium_id;

  select coalesce(count(*), 0)
  into plant_count
  from public.owned_plants
  where user_id = current_user_id
    and aquarium_id = target_aquarium_id;

  select water_quality
  into aquarium_quality
  from public.aquariums
  where id = target_aquarium_id
    and user_id = current_user_id;

  beauty_score := aquarium_quality * 0.55 + fish_count * 8 + plant_count * 10 + avg_vitality * 2 + random() * 18;
  rank := 1
    + case when beauty_score < 92 then 1 else 0 end
    + case when beauty_score < 122 then 1 else 0 end
    + case when beauty_score < 148 then 1 else 0 end
    + case when beauty_score < 172 then 1 else 0 end;

  reward_pearls := case rank when 1 then 16 when 2 then 10 when 3 then 6 when 4 then 3 when 5 then 3 else 0 end;
  reward_coins := case rank when 1 then 90 when 2 then 60 when 3 then 36 when 4 then 18 when 5 then 18 else 0 end;

  update public.profiles
  set
    pearls = pearls + reward_pearls,
    coins = coins + reward_coins,
    weekly_contest_entries = jsonb_set(
      coalesce(weekly_contest_entries, '{}'::jsonb),
      array[target_aquarium_id::text],
      to_jsonb(week_key),
      true
    ),
    competition_history = coalesce(competition_history, '[]'::jsonb) || jsonb_build_array(
      jsonb_build_object(
        'type', 'beauty',
        'aquariumId', target_aquarium_id,
        'rank', rank,
        'score', round(beauty_score),
        'weekKey', week_key,
        'at', now()
      )
    ),
    updated_at = now()
  where user_id = current_user_id;

  perform public.append_journal_log_entry(
    current_user_id,
    'Concours beaute: aquarium classe ' || rank || case when rank = 1 then 'er' else 'e' end || '.',
    target_aquarium_id
  );
  perform public.append_community_feed_entry(
    current_user_id,
    'Port communautaire',
    'Cet aquarium entre au concours beaute hebdomadaire.',
    target_aquarium_id
  );

  return public.get_player_core_state_by_user(current_user_id);
end;
$$;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "game_saves_select_own" on public.game_saves;
create policy "game_saves_select_own"
on public.game_saves
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "game_saves_insert_own" on public.game_saves;
create policy "game_saves_insert_own"
on public.game_saves
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "game_saves_update_own" on public.game_saves;
create policy "game_saves_update_own"
on public.game_saves
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "aquariums_select_own" on public.aquariums;
create policy "aquariums_select_own"
on public.aquariums
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "aquariums_insert_own" on public.aquariums;
create policy "aquariums_insert_own"
on public.aquariums
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "aquariums_update_own" on public.aquariums;
create policy "aquariums_update_own"
on public.aquariums
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "utility_inventory_select_own" on public.utility_inventory;
create policy "utility_inventory_select_own"
on public.utility_inventory
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "utility_inventory_insert_own" on public.utility_inventory;
create policy "utility_inventory_insert_own"
on public.utility_inventory
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "utility_inventory_update_own" on public.utility_inventory;
create policy "utility_inventory_update_own"
on public.utility_inventory
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "owned_fish_select_own" on public.owned_fish;
create policy "owned_fish_select_own"
on public.owned_fish
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "owned_fish_insert_own" on public.owned_fish;
create policy "owned_fish_insert_own"
on public.owned_fish
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "owned_fish_update_own" on public.owned_fish;
create policy "owned_fish_update_own"
on public.owned_fish
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "owned_plants_select_own" on public.owned_plants;
create policy "owned_plants_select_own"
on public.owned_plants
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "owned_plants_insert_own" on public.owned_plants;
create policy "owned_plants_insert_own"
on public.owned_plants
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "owned_plants_update_own" on public.owned_plants;
create policy "owned_plants_update_own"
on public.owned_plants
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "fry_batches_select_own" on public.fry_batches;
create policy "fry_batches_select_own"
on public.fry_batches
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "fry_batches_insert_own" on public.fry_batches;
create policy "fry_batches_insert_own"
on public.fry_batches
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "fry_batches_update_own" on public.fry_batches;
create policy "fry_batches_update_own"
on public.fry_batches
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "community_feed_entries_select_own" on public.community_feed_entries;
create policy "community_feed_entries_select_own"
on public.community_feed_entries
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "community_feed_entries_insert_own" on public.community_feed_entries;
create policy "community_feed_entries_insert_own"
on public.community_feed_entries
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "journal_log_entries_select_own" on public.journal_log_entries;
create policy "journal_log_entries_select_own"
on public.journal_log_entries
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "journal_log_entries_insert_own" on public.journal_log_entries;
create policy "journal_log_entries_insert_own"
on public.journal_log_entries
for insert
to authenticated
with check ((select auth.uid()) = user_id);

grant execute on function public.bootstrap_player_core_state() to authenticated;
grant execute on function public.get_player_core_state() to authenticated;
grant execute on function public.get_login_email_for_player_name(text) to anon;
grant execute on function public.get_login_email_for_player_name(text) to authenticated;
grant execute on function public.advance_cycle_server(uuid) to authenticated;
grant execute on function public.buy_aquarium_slot_server() to authenticated;
grant execute on function public.breed_fish_server(uuid) to authenticated;
grant execute on function public.buy_server_item(text, text, uuid) to authenticated;
grant execute on function public.clean_aquarium_server(uuid) to authenticated;
grant execute on function public.use_inventory_utility_server(text, uuid) to authenticated;
grant execute on function public.update_aquarium_setting_server(uuid, text, numeric) to authenticated;
grant execute on function public.toggle_fish_placement_server(uuid, uuid) to authenticated;
grant execute on function public.sell_owned_fish_server(uuid) to authenticated;
grant execute on function public.toggle_plant_placement_server(uuid, uuid, integer, numeric) to authenticated;
grant execute on function public.sell_owned_plant_server(uuid) to authenticated;
grant execute on function public.claim_daily_reward_server() to authenticated;
grant execute on function public.claim_mission_server(text) to authenticated;
grant execute on function public.rename_player_server(text) to authenticated;
grant execute on function public.rename_aquarium_server(uuid, text) to authenticated;
grant execute on function public.visit_community_server(text) to authenticated;
grant execute on function public.run_speed_competition_server(uuid) to authenticated;
grant execute on function public.run_reflex_competition_server(uuid) to authenticated;
grant execute on function public.enter_beauty_contest_server(uuid) to authenticated;
grant execute on function public.sync_profile_snapshot_server(text, integer, integer, integer, integer, uuid, text) to authenticated;
grant execute on function public.update_onboarding_state_server(integer, boolean, boolean) to authenticated;
grant execute on function public.claim_onboarding_reward_server() to authenticated;
grant execute on function public.sync_offline_cycles_for_user() to authenticated;
