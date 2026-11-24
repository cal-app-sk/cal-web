# CAL – web

- `index.html` – verejná stránka zdieľanej akcie (`?e=<id akcie>`). Zobrazí len **verejné** akcie, údaje vydáva funkcia `public_event` v Supabase.
- `app/` – webová verzia appky CAL (PWA), ktorú si dáš na plochu iPhonu.

Súbory sa sem nasadzujú automaticky skriptom `scripts/web-deploy.sh` z repozitára appky.
