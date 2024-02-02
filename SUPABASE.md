## Retrieving Supabase Credentials

To integrate Supabase with MyMCIT, you'll need to retrieve several key pieces of information from your Supabase project: the **Supabase URL** and **Supabase Anon Key**. Here's how to get them:

### Step 1: Create a Supabase Project

If you haven't already, go to [Supabase](https://supabase.io/) and sign up or log in. Once logged in:

1. Click on "New Project".
2. Fill in the project details like project name, database password, and select the region closest to your user base for optimal performance.
3. Click "Create New Project". It might take a few minutes for the MyMCIT Supabase project to be ready.

### Step 2: Retrieve the Supabase MyMCIT Project Credentials

Once the Supabase MyMCIT project is set up:

1. Navigate to the project dashboard.
2. On the left sidebar, click on "Settings" > "API".
3. Here, you'll find your **Project URL** (Supabase URL) and **anon public** (Supabase Anon Key).

### Step 3: Configure the MyMCIT NextJS App

With the Supabase credentials at hand, you'll need to add them to the MyMCIT application's environment variables:

1. Create a `.env.local` file in the root of your NextJS project if it doesn't already exist.
2. Add the following lines to the `.env.local` file, replacing `<YOUR_SUPABASE_URL>` and `<YOUR_SUPABASE_ANON_KEY>` with your actual Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=<YOUR_SUPABASE_URL>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_KEY>
   ```

### Security Note

- The **Supabase Anon Key** is intended for use in client-side code and has limited permissions based on your Supabase policies.
- Never expose sensitive keys or credentials in the MyMCIT application's front-end that could compromise the security or integrity of your Supabase database.

## Implementing Row-Level Security (RLS) in Supabase

After setting up the Supabase project and integrating it with the MyMCIT application, it's crucial to configure Row-Level Security (RLS) for your database tables. RLS adds a robust layer of security, ensuring that users can only access data that they are explicitly permitted to see or modify.

### Why RLS Matters

- **Data Protection**: RLS helps protect sensitive data by enforcing access controls at the database level. Without RLS, your data could be at risk of unauthorized access.
- **Fine-grained Access Control**: It allows for detailed and nuanced access control policies, making it ideal for applications where user permissions vary significantly.
- **Compliance**: For applications handling personal or sensitive user data, RLS can be a critical component in achieving compliance with data protection regulations.

### Setting Up RLS Policies

1. **Enable RLS for Each Table**: Navigate to your Supabase project's dashboard, go to the "Table Editor", select your table, and toggle on "Enable RLS".

2. **Define Policies for Public Reads**: For tables where you want to allow all users to read data (e.g., course reviews), you can define a policy that allows public access for reads. Example policy:

   ```sql
   create policy "Public can view reviews" on reviews for select using (true);
   ```

   This policy allows any user to read data from the `reviews` table.

3. **Restrict Writes to Authenticated Users**: For operations that modify data (insert, update, delete), you should restrict access to authenticated users or users with specific roles. Example policy for authenticated users:

   ```sql
   create policy "Authenticated users can insert reviews" on reviews for insert with check (auth.uid() is not null);
   ```

   This policy ensures that only authenticated users can insert new records into the `reviews` table. The `auth.uid()` function checks if there's a currently authenticated user.

4. **Custom Policies for Advanced Scenarios**: Depending on your application's requirements, you might need more complex policies. For example, allowing users to edit or delete only their own reviews:

   ```sql
   create policy "Users can edit their reviews" on reviews for update using (auth.uid() = user_id);
   create policy "Users can delete their reviews" on reviews for delete using (auth.uid() = user_id);
   ```

   These policies use the `using` clause to check that the `user_id` column of a review matches the ID of the currently authenticated user.

### Testing and Validation

After defining RLS policies, test them thoroughly to ensure they work as expected. Supabase provides a "Policy Tester" in the dashboard, which can be invaluable for debugging and verifying that your policies enforce the desired access controls.

### Best Practices

- **Default to Deny**: Start with a restrictive approach where no access is allowed, then incrementally add policies that grant specific permissions.
- **Regular Audits**: Regularly review and audit your RLS policies, especially after making changes to your application's features or user roles.
- **Use Supabase Auth**: Leverage Supabase's built-in authentication to simplify managing user identities and roles, making it easier to enforce RLS policies.

