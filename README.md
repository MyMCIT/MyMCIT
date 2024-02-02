# MyMCIT Project README

Welcome to the MyMCIT project repository. This document guides you through setting up and running the project, which utilizes a modern tech stack including NextJS for the frontend, Supabase for backend services, Material-UI (MUI) for UI components, Google OAuth for authentication, and Vercel for deployment.

## Why This Tech Stack?

**NextJS + Supabase**: Offers a scalable, serverless backend with a React frontend framework that supports Static Site Generation (SSG) and Incremental Static Regeneration (ISR), enabling faster page loads and reducing database and API hits.

**MUI Components**: Provides a comprehensive suite of pre-designed React components for faster UI development with a consistent design language.

**Google OAuth**: Facilitates secure and convenient user authentication, and Supabase offers a nice integration with Google OAuth, making setup easy.

**Vercel**: Seamlessly integrates with NextJS for easy deployment, offering global CDN, edge functions, and more to ensure MyMCIT is fast and reliable.

### Advantages of PostgreSQL Over Firebase for MyMCIT

In the context of MyMCIT, a web application for students to read and write reviews of courses, PostgreSQL, as provided by Supabase, offers several advantages over Firebase's Firestore:

- **Complex Queries**: PostgreSQL supports complex SQL queries. This is crucial for filtering, sorting, and aggregating course reviews based on various parameters such as professor, semester, and ratings. For instance:
   - Aggregating average ratings for courses per semester or professor.
   - Complex filtering to find courses that meet specific criteria, like difficulty level or workload, which can be done more efficiently with SQL.

- **Relational Data**: The relational nature of PostgreSQL is beneficial for structuring data that inherently relates to each other, such as courses, professors, and reviews. This allows for:
   - Efficiently querying related data through JOIN operations. For example, fetching all reviews for a specific course along with professor information in a single query.
   - Maintaining data integrity through foreign keys, ensuring reviews are always linked to the correct course and professor.

- **Transactional Support**: PostgreSQL supports transactions, enabling complex operations involving multiple steps to be executed safely. This is particularly useful for operations like batch updating reviews or modifying user permissions, where it's crucial that either all operations succeed or none at all, to maintain data consistency.

- **Advanced Indexing**: PostgreSQL offers a variety of indexing techniques, such as B-tree, GiST, and GIN indexes. This allows for:
   - Faster search capabilities for text-based reviews, improving the responsiveness of search features within the app.
   - Efficient indexing of array fields, which can be used for tagging courses or reviews, enhancing the app's filtering capabilities.

## Setting Up the Project

### Prerequisites

- Node.js installed (LTS version recommended). The initial version was built with `LTS/hydrogen` (`v18.18.0`).
- Login credentials to the Supabase account with the project DB.
- Google Cloud Platform account for setting up OAuth.

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repository/mymcit.git
   cd mymcit
   ```

2. **Install dependencies**: Note that this project uses `npm` for dependency management.
   ```bash
   npm install
   ```

3. **Set up environment variables**:
    - Copy the `.env.template` file to `.env.local`.
    - Fill in the environment variables with the MyMCIT Supabase and Google OAuth credentials.

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   This starts the application on `http://localhost:3000`.

### Production

1. **Build the application**:
   ```bash
   npm run build
   ```
   Check for any pre-rendering errors that might prevent deployment.

2. **Start the production server**:
   ```bash
   npm start
   ```

## Before Committing

Ensure you run `npm run build` *every time before you merge with `main`* to check for any build errors and address pre-rendering issues. This step is crucial for maintaining a deployable state of the project.

## Supabase Setup

Please read the `SUPABASE.md` file for instructions on setting up the Supabase project.

## App Info

Please read the more comprehensive file, `APPINFO.md`, for more information about the app's architecture, data model, and more.

## Contributing

We welcome contributions! Please read the `CONTRIBUTING.md` file for guidelines on how to contribute to this project. Let's make something great together.

Thank you for joining the MyMCIT project. Let's build something amazing.

