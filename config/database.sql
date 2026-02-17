create type gender_type as enum ('M', 'F')\

 create type entry_type_ledger as enum ('Debit', 'Credit', 'Reversal') 
 
 create type status_transcation as enum ('Pending', 'Success', 'Failure') 
 
 create table users ( id serial primary key, first_name varchar(20) not null, last_name varchar(20) not null, gender gender_type not null, country varchar(30) not null ) create table wallets ( id uuid primary key default gen_random_uuid(), user_id int not null, currency char(3) not null, balance numeric(20,6) not null default 0, version int not null default 0, created_at timestamp default now(), constraint user_constraint foreign key (user_id) references users(id) on delete cascade, unique(user_id, currency) ) 
 
 create table transcations( id uuid primary key default gen_random_uuid(), request_id uuid unique not null, from_wallet uuid not null, to_wallet uuid not null, amount NUMERIC(20,6) NOT NULL, status status_transcation NOT NULL DEFAULT 'Pending', created_at TIMESTAMP DEFAULT NOW(), constraint transcations_to_wallet_id_fk foreign key (to_wallet) references wallets(id) on delete restrict, constraint transcations_from_wallet_id_fk foreign key (from_wallet) references wallets(id) on delete restrict ) 
 
 create table ledger ( id uuid primary key default gen_random_uuid(), wallet_id uuid not null, transcation_id uuid not null, amount numeric(20,6) not null, entry_type entry_type_ledger not null, created_at timestamp default now(), constraint ledger_wallet_id_fk foreign key (wallet_id) references wallets(id) on delete restrict, constraint ledger_transcation_id_fk foreign key (transcation_id) references transcations(id) on delete restrict )