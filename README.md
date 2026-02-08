# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Database
Creates an account on https://supabase.com/ and get the credentials from there.

```
EXPO_PUBLIC_SUPABASE_URL=https://wpjaob.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```
Add this model
```sql
create table trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  created_at timestamp with time zone default now()
);
create table trip_links (
   id uuid primary key default gen_random_uuid(),
   trip_id uuid references trips(id) on delete cascade,
   url text not null,
   description text,
   platform text,
   created_at timestamp with time zone default now()
);

alter table trips enable row level security;
alter table trip_links enable row level security;

create policy "User trips only"
on trips for all
using (auth.uid() = user_id);

create policy "User links only"
on trip_links for all
using (
  auth.uid() = (
    select user_id from trips where trips.id = trip_links.trip_id
  )
);
```
### Troubleshooting
* *400 in supabase:* If the supabase call returns a 400 means the credentials are invalid. You have to be sure the credentials are okay in https://supabase.com/dashboard/project/[YOUR-PROJECT-ID]/auth/users