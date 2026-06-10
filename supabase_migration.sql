-- 1. NOTES TABLE STRUCTURE & POLICIES
create table if not exists public.notes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  content text not null,
  favorite boolean default false not null,
  is_archived boolean default false not null,
  deleted_at timestamp with time zone
);

alter table public.notes enable row level security;

-- Drop existing helper policy if recreating to prevent duplicate definitions
drop policy if exists "Allow all actions for creator" on public.notes;
create policy "Allow all actions for creator" on public.notes
  for all using (auth.uid() = user_id);


-- 2. ATTACHMENTS TABLE STRUCTURE & POLICIES
create table if not exists public.attachments (
  id uuid default gen_random_uuid() primary key,
  note_id uuid references public.notes(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  file_name text not null,
  file_path text not null,
  file_type text not null,
  file_size integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.attachments enable row level security;

drop policy if exists "Allow creator on attachments" on public.attachments;
create policy "Allow creator on attachments" on public.attachments
  for all using (auth.uid() = user_id);


-- 3. INTERACTIVE COLLABORATION SHARES SCHEMA
create table if not exists public.note_shares (
  id uuid default gen_random_uuid() primary key,
  note_id uuid references public.notes(id) on delete cascade not null,
  owner_id uuid references auth.users(id) on delete cascade not null,
  collaborator_id uuid references auth.users(id) on delete cascade not null,
  permission text check (permission in ('owner', 'editor')) default 'editor' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(note_id, collaborator_id)
);

alter table public.note_shares enable row level security;

-- Note shares policies
drop policy if exists "Allow owners and collaborators to select shares" on public.note_shares;
create policy "Allow owners and collaborators to select shares"
  on public.note_shares
  for select
  using (auth.uid() = owner_id or auth.uid() = collaborator_id);

drop policy if exists "Allow owners to insert shares" on public.note_shares;
create policy "Allow owners to insert shares"
  on public.note_shares
  for insert
  with check (auth.uid() = owner_id);

drop policy if exists "Allow owners to update shares" on public.note_shares;
create policy "Allow owners to update shares"
  on public.note_shares
  for update
  using (auth.uid() = owner_id);

drop policy if exists "Allow owners to delete shares" on public.note_shares;
create policy "Allow owners to delete shares"
  on public.note_shares
  for delete
  using (auth.uid() = owner_id);


-- 4. COLLABORATOR POLICIES ON NOTES & ATTACHMENTS
-- Grant SELECT access to notes shared with collaborators
drop policy if exists "Allow collaborators to select notes" on public.notes;
create policy "Allow collaborators to select notes"
  on public.notes
  for select
  using (
    exists (
      select 1 from public.note_shares
      where note_shares.note_id = notes.id
      and note_shares.collaborator_id = auth.uid()
    )
  );

-- Grant UPDATE access to notes shared with collaborator as 'editor'
drop policy if exists "Allow editors to update notes" on public.notes;
create policy "Allow editors to update notes"
  on public.notes
  for update
  using (
    exists (
      select 1 from public.note_shares
      where note_shares.note_id = notes.id
      and note_shares.collaborator_id = auth.uid()
      and note_shares.permission = 'editor'
    )
  );

-- Grant SELECT access to attachments of shared notes
drop policy if exists "Allow collaborators to select attachments" on public.attachments;
create policy "Allow collaborators to select attachments"
  on public.attachments
  for select
  using (
    exists (
      select 1 from public.note_shares
      where note_shares.note_id = attachments.note_id
      and note_shares.collaborator_id = auth.uid()
    )
  );

-- Grant INSERT access to attachments of shared notes for editor collaborators
drop policy if exists "Allow editors to insert attachments" on public.attachments;
create policy "Allow editors to insert attachments"
  on public.attachments
  for insert
  with check (
    exists (
      select 1 from public.note_shares
      where note_shares.note_id = note_id
      and note_shares.collaborator_id = auth.uid()
      and note_shares.permission = 'editor'
    )
  );


-- 5. SECURE DATABASE FUNCTIONS (SECURITY DEFINER RPCs)
-- Function to lookup and share a note securely by e-mail address
create or replace function public.share_note_by_email(
  note_id_param uuid,
  email_param text,
  permission_param text
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  target_user_id uuid;
  note_owner_id uuid;
begin
  -- Lookup target collaborator user ID by email
  select id into target_user_id
  from auth.users
  where email = email_param;

  if target_user_id is null then
    raise exception 'No user found with that email address.';
  end if;

  -- Ensure note exists and extract original owner id
  select user_id into note_owner_id
  from public.notes
  where id = note_id_param;

  if note_owner_id is null then
    raise exception 'Note not found.';
  end if;

  -- Ensure they aren't sharing with themselves
  if target_user_id = note_owner_id then
    raise exception 'You cannot share a note with yourself.';
  end if;

  -- Push share record or update permissions with ON CONFLICT resolution
  insert into public.note_shares (note_id, owner_id, collaborator_id, permission)
  values (note_id_param, note_owner_id, target_user_id, permission_param)
  on conflict (note_id, collaborator_id)
  do update set permission = excluded.permission;
end;
$$;

-- Function to safely return note shares including collaborator emails to authorized viewers
create or replace function public.get_note_shares_with_emails(
  note_id_param uuid
)
returns table (
  share_id uuid,
  collaborator_id uuid,
  collaborator_email text,
  permission text,
  created_at timestamp with time zone
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  -- Enforce that ONLY the note's creator or an current collaborator can list shares
  if not exists (
    select 1 from public.notes n
    where n.id = note_id_param and n.user_id = auth.uid()
  ) and not exists (
    select 1 from public.note_shares ns
    where ns.note_id = note_id_param and ns.collaborator_id = auth.uid()
  ) then
    raise exception 'Access denied.';
  end if;

  return query
  select 
    ns.id as share_id,
    ns.collaborator_id,
    u.email::text as collaborator_email,
    ns.permission,
    ns.created_at
  from public.note_shares ns
  join auth.users u on ns.collaborator_id = u.id
  where ns.note_id = note_id_param;
end;
$$;
