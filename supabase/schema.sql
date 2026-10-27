-- Schéma des tables Tommy Studio (projet Supabase mfmspsopsehyxkhqabfy, partagé avec une autre application :
-- ne toucher qu'aux objets site_* ci-dessous). Reflète la production au 27/10/2026.
-- Les données sont sauvegardées chaque jour par /api/cron/sauvegarde (export JSON envoyé par email).

create table public.site_projects (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique,              -- sha256 du lien privé de modification
  edit_token_enc text,                          -- lien privé chiffré (AES-256-GCM, TOKEN_ENCRYPTION_KEY)
  slug text unique check (slug ~ '^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$'),
  status text not null default 'draft' check (status in ('draft', 'paid', 'live', 'offline')),
  plan text,
  options text[] not null default '{}',
  data jsonb not null default '{}',             -- brouillon du site (SiteDraft, src/site-engine/sanitize.ts)
  contact_name text,
  contact_email text,
  stripe_session_id text unique,
  amount_cents integer,
  paid_at timestamptz,
  published_at timestamptz,
  last_reminder_at timestamptz,
  publish_requested_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index site_projects_status_created_idx on public.site_projects (status, created_at);

create table public.site_assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.site_projects (id) on delete cascade,
  path text not null unique,                    -- chemin dans le bucket site-media : <project_id>/<aléatoire>.<ext>
  kind text not null default 'photo' check (kind in ('photo', 'logo')),
  position integer not null default 0,
  width integer,
  height integer,
  size_bytes integer,
  created_at timestamptz not null default now()
);
create index site_assets_project_idx on public.site_assets (project_id, position);

create or replace function public.site_touch_updated_at()
  returns trigger language plpgsql set search_path to ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger site_projects_updated_at before update on public.site_projects
  for each row execute function public.site_touch_updated_at();

-- Accès uniquement côté serveur (clé secrète) : RLS activé, aucune policy
alter table public.site_projects enable row level security;
alter table public.site_assets enable row level security;

-- Stockage des photos : bucket public, 5 Mo max (le navigateur compresse avant l'envoi)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
