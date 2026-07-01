-- Run this in Supabase SQL Editor (Project > SQL Editor > New Query)

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz default now()
);

insert into categories (name) values
  ('Agricultural Machinery'),
  ('Construction'),
  ('Furniture'),
  ('Automobile & Accessories'),
  ('Raw Materials - Aluminum Profile'),
  ('Raw Materials - Glass'),
  ('Raw Materials - Chemicals');

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text,
  country_of_origin text,
  image_url text,
  price_range text default 'Quote on request',
  status text default 'active', -- active / inactive
  created_at timestamptz default now()
);

create table requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text not null,
  phone text,
  destination_country text not null,
  product_description text not null,
  quantity text,
  budget_range text,
  image_url text,
  notes text,
  status text default 'new', -- new / contacted / closed
  created_at timestamptz default now()
);

create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text default 'new', -- new / contacted / closed
  created_at timestamptz default now()
);

-- AI assistant draft products (admin review queue)
create table product_drafts (
  id uuid primary key default gen_random_uuid(),
  source_type text not null, -- pdf / photo / text
  extracted_data jsonb,      -- {name, description, category, country_of_origin, price_range}
  ai_summary text,
  status text default 'draft', -- draft / approved / rejected
  linked_product_id uuid references products(id),
  created_at timestamptz default now()
);

-- Storage bucket for product images and uploaded source documents
-- Go to Storage in Supabase dashboard and create a public bucket named "tangline-media"
