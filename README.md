# PowerSync Local-Only Example

This is an app set up to switch between a local-only and PowerSync schema. A user can consume a 'free' version which persists data locally. Once they 'Sign Up' PowerSync will switch on and register them as a Supabase user.

1) [done] generate tmp user_id UUID locally
2) [done] assign all records with that value
3) [WIP in `local-cust-table` branch] Query/store data to the `local_customers` or `customers` table depending whether PowerSync is off or on 
4) [ ] When PowerSync is switched on, register the user in supabase, in the response you get the UUID
5) [ ] replace all the local records with this new UUID
6) [ ] Copy the data over into synced (`customers`) table

### Development Setup Instructions
1. Clone this repo
2. `pn install`
3. Copy .env.local.template into .env.local and insert your environment variables and PowerSync development token
4. `pn dev`

Built using [React + TypeScript + Vite](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)