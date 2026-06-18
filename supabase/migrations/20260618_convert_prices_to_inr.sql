alter table public.products
add column if not exists currency text;

update public.products
set
  price = round(price * 83),
  compare_at_price = case
    when compare_at_price is null then null
    else round(compare_at_price * 83)
  end,
  currency = 'INR'
where currency is null;

alter table public.products
alter column currency set default 'INR';

alter table public.products
alter column currency set not null;
