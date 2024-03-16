# Local Supabase Setup Guide for MyMCIT

This guide walks you through setting up a local Supabase database for the MyMCIT project, including database seeding and authentication setup.

Running into any issues? Refer to the [Troubleshooting](#troubleshooting) section at the end of this document.

## Prerequisites

- Install the Supabase CLI. For macOS, use `brew install supabase/tap/supabase`. See the [Supabase CLI documentation](https://supabase.com/docs/guides/cli/getting-started) for installation instructions on other operating systems.
- Install Docker from [Docker's official website](https://docs.docker.com/get-docker/) if it's not already installed on your machine.
- Install PostgreSQL. For macOS, use `brew install postgresql`. See the [PostgreSQL documentation](https://www.postgresql.org/download/) for installation instructions on other operating systems.

## Setting Up Your Local Database

1. Open your GitHub repository in the IDE of your choice.
2. Open a terminal and run `supabase init` to initialize your local Supabase project at the root.
3. Start the local Supabase instance by running `supabase start` at the root to start pulling the necessary images from supabase/postgres via Docker.
4. You'll need to import the database schema, roles, and data. These are provided in the `.sql` files: `schema.sql`, `roles.sql`, and `data.sql`. Run the following commands in your project terminal, using the password `postgres` each time you are prompted:
    ```shell
    psql -h localhost -p 54322 -U postgres -d postgres -f schema.sql
    psql -h localhost -p 54322 -U postgres -d postgres -f roles.sql
    psql -h localhost -p 54322 -U postgres -d postgres -f data.sql
    ```
5. Once done, your local Docker Supabase database will be populated with the schema, roles, and data. Run `npm run dev` to start your project.

**Note:** This setup creates an isolated local database. Users without Supabase production environment variables will not interact with the production database.

## Configuring Authentication

To set up authentication with Google OAuth, follow these steps:

1. Locate the `supabase/config.toml` file in your project directory.
2. Update the `# Use an external OAuth provider` section with the following details:
    ```toml
    [auth.external.google]
    enabled = true
    client_id = "env(GOOGLE_CLIENT_ID)"
    secret = "env(GOOGLE_CLIENT_SECRET)"
    redirect_uri = "http://localhost:54321/auth/v1/callback"
    ```
3. Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to your local `.env` file. These values can be obtained from the Google Cloud console. You can ask the MOSA team to provide you with the values. If the MOSA team cannot provide values to you due to MOSA procedures, don't worry: follow these instructions to set up your own Google OAuth setup for local testing: [Google Cloud OAuth Setup](https://support.google.com/cloud/answer/6158849?hl=en#zippy=%2Cpublic-and-internal-applications%2Cstep-configure-your-app-to-use-the-new-secret%2Cstep-create-a-new-client-secret).

4. Update your `config.toml` file, including the following URLs in the `additional_redirect_urls` field to permit post-authentication redirects:
    ```toml
    additional_redirect_urls = ["https://localhost:3000", "http://localhost:54321"]
    ```
5. Run `supabase stop && supabase start` to restart your local Supabase instance in order to use the updated configs.

This configuration allows you to use Google OAuth locally with Supabase's built-in authentication table.

## .env Local File Setup

Here is an example of what your `.env` file should contain for local development:

```plaintext
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from the local Supabase start console log>
ON_DEMAND_ISR_TOKEN=<whatever secret you want to come up with>
POSTGRES_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
GOOGLE_CLIENT_ID=<from Google Cloud settings>
GOOGLE_CLIENT_SECRET=<from Google Cloud settings>
```

In case the above `NEXT_PUBLIC_SUPABASE_URL` does not work, try instead:
```plaintext
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
```

This setup ensures your local environment is correctly configured to work with Supabase and Google OAuth authentication. For more information on setting your On-Demand ISR token, see the [ISR Vercel Documentation](https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration).

Feel free to reach out if you need any help setting this up. Happy coding!

## Troubleshooting

### Docker/Supabase Issues

If you encounter an issue when running `supabase start`, try the following:  

1. On your Docker Desktop, go to the 'Settings' section
2. Navigate to the 'Choose file sharing implementation for your containers' setting
3. Select the 'gRPC FUSE' option
4. Disable 'Use Virtualization framework' if it's previously enabled
5. Restart Docker Desktop and re-run `supabase start`

Note: This is a known bug with Docker/Supabase and may be fixed in future updates. Please refer to this [GitHub thread](https://github.com/supabase/cli/issues/1083#issuecomment-1691431279) for more information. Learn more about the [Docker Desktop settings](https://docs.docker.com/desktop/settings/mac/).
