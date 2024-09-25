# Sun Lab Access System

Setting up supabase for this project

You need to create a supabase account and then create a new project.

1. Then you need to add the supabase url to the .env file
2. You need to add the supabase key to the .env file
3. Then go to your dashboard and then to authentication:
   3.1 You will see providers option in the left side bar
   3.2 Then go to email provider and then add the email provider
   3.3 And set the confirm email option to false
4. Now we need to add some tables to supabase
   4.1 Go to sql editor
   4.2 And paste this query

   ```
   CREATE TABLE users (
     id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
     name TEXT,
     email TEXT UNIQUE,
     role TEXT CHECK (role IN ('student', 'faculty', 'staff', 'janitor')),
     status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
   );

   CREATE TABLE access_logs (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     user_id UUID REFERENCES users(id),
     timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
     action TEXT
   );
   ```

5. Now just run npm install and then npm run dev
