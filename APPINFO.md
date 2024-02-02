# APPINFO.md - Info about the app, frens

## Overview

The MyMCIT NextJS app (hopefully) is built to ensure fast loading times. I've done a bad job on responsive design, and the UI/UX I am sure can be improved. 

I have used `getStaticProps` extensively for data fetching and optimizing the user experience. However, note that I have not leveraged `postgres`'s amazing DB-side functions in order to make data processing even more efficient. Perhaps this is a good TODO.

### Optimized Data Fetching with `getStaticProps`

I extensively use `getStaticProps` in MyMCIT to pre-render pages at build time. This method fetches data required for rendering a page and passes it as props. It's particularly beneficial for pages where data changes infrequently.

- **Revalidation Strategy**: I've set an initial revalidation time (`revalidate: 86400`) of 1 day to be somewhat fresh, but not burden the server or database with constant requests. But given the infrequency of review submissions, I'd be totally cool with extending this period to a week or even a month to further reduce server load without significantly impacting user experience.
- Note that I use `on-demand ISR` in `create-review.tsx`, which triggers an on-demand revalidation that propagates to all users very, very fast whenever a given user creates a new review. In that way, we can have the best of both worlds -- infrequent calls, but calls when we need them. 

### Responsive Design Considerations

Eh, I rushed the responsive design part. It's not very good. :) Surely you can make it better.

- **Use of `useMediaQuery` Hook**: This hook from MUI checks against the theme's breakpoints to dynamically adjust the layout and content presentation according to the screen size.
- **Dynamic Column Hiding**: In the `DataGrid` component, I hid certain columns on smaller screens to ensure the table remains readable and user-friendly.

```jsx
const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
```

### Filtering System

MyMCIT implements a filtering system allowing users to toggle between core courses, electives, and courses with no reviews. 

- **Consideration for Simplification**: The `noReviews` filter, while offering granularity, maybe isn't really needed.

### Theming with Official Colors

Penn's official colors, UPenn Blue (`#011F5B`) and UPenn Red (`#990000`), are used across MyMCIT. 

### Styling Approach for MUI DataGrid

The `DataGrid` component employs custom inline styling. Maybe there's a better way to do it, I dunno.

```jsx
<div style={{ height: "100%", width: "100%" }}>
  <style>{`
    .MuiDataGrid-row:hover {
      cursor: pointer;
    }
  `}</style>
</div>
```

# Folder Structure
You'll note that I have chosen the `src` setup for a NextJS 14 project, which is optional. I find it easier to have just a dedicated `src` folder. 

File structure is very, very important in a NextJS app, and deviating it can create lots of problems, so buyer beware. Especially important is the `pages` folder, and the `pages/api` folder. Any `.ts` files created in the `api` folder will be API endpoints.

Any `.tsx` files put in the `pages` folder will be pages. `index.tsx` will default to the `/` route. Any other naming convention, e.g. `about.tsx`, will default to the `/about` route.

Folders other than the `api` folder in the `pages` folder will be treated as nested routes. For example, `pages/about/index.tsx` will default to the `/about` route. `pages/about/team.tsx` will default to the `/about/team` route.

Don't put non-pages in the `pages` folder. It will break the app.

I also have a `models` folder where you can continue adding models as needed. 

The `components` folder is where you can add components.

The `lib` folder is where you can add utility functions. This is mostly important for `supabase.ts`, which instantiates the Supabase client. I actually instantiate 2 Supabase clients in the file, one for `public`, non-logged-in users, and one for Google OAuth `authenticated` users. This is important because I have also set RLS policies on the Supabase Postgres DB where only `authenticated` users can do DB `INSERT`.

### Supabase Sidebar

```ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const authSupabase = (authHeader: string) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });
};
```

You'll note that for `authSupabase` I need to pass in the `authHeader` as a string. This is because I use `supabase.auth.session()` to get the `access_token` and `refresh_token` from the `supabase.auth.session()` object. I then pass the `access_token` to `authSupabase` to create a new Supabase client that is authenticated. 

### semesters.ts

I have a `semesters.ts` file in the `lib` folder that contains an array of all the semesters. I use this to populate the `semester` dropdown in `create-review.tsx`.

I do some janky time-based logic to determine the current semester. I'm sure there's a better way to do this.

```ts
export function getSemesters() {
  const startYear = 2019;
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const seasons = ["Spring", "Summer", "Fall"];
  const semesters = [];

  for (let y = startYear; y <= currentYear; y++) {
    for (let s = 0; s < seasons.length; s++) {
      if (y === currentYear) {
        if (
          (s === 0 && currentMonth >= 0) || // Include Spring semester if we are in Jan-May
          (s === 1 && currentMonth >= 4) || // Include Summer semester if we are in May-August
          (s === 2 && currentMonth >= 7)
        ) {
          // Include Fall semester if we are in Aug-Dec
          semesters.push(`${seasons[s]} ${y}`);
        }
      } else {
        semesters.push(`${seasons[s]} ${y}`); // For past years, add all semesters
      }
    }
  }

  return semesters;
}

```

### Moving on

The `public` folder is where you can add static assets, like images.

For the root project folder, only put files that are needed for the app to run, like `package.json`, `next.config.js`, `tsconfig.json`, etc. And of course, config files like `.gitignore` and `.env.local`.

If you're familiar with Vercel, you'll know that production env variables are set in the Vercel dashboard. However, for local development, you'll need to create a `.env.local` file in the root project folder. This file is ignored by git, so you'll need to create it yourself.

# API endpoints

## courses.ts API endpoint

The `courses.ts` API endpoint is used to fetch all courses from the database. I actually don't use it in any pages I believe, since with Postgres you can do table joins in one API call, but I left it in there for you in case you'll need it at some point. Oh wait, I think I use it to fetch the courses to display in `create-review.tsx`. I'm getting old.

## course-summaries.ts API endpoint

The `course-summaries.ts` API endpoint is used to fetch all course summaries from the database. It is used in the `index.tsx` page.

## courses.ts API endpoint

The `courses.ts` API endpoint is used to fetch all courses from the database. I actually don't use it in any pages I believe, since with Postgres you can do table joins in one API call, but I left it in there for you in case you'll need it at some point.

## create-review.ts API endpoint

The `create-review.ts` API endpoint is used to create a new review. It is used in the `create-review.tsx` page.

## IMPORTANT: revalidate.ts API endpoint

The `revalidate.ts` API endpoint is used to trigger a revalidation of the `course-summaries.ts` API endpoint. It is used in the `create-review.tsx` page.

This is really cool! It's required for on-demand ISR, which is a way to trigger a revalidation of a page when a user creates a new review. This way, we can have the best of both worlds -- infrequent calls, but calls when we need them.

But this is an API route, you say. How is it not abused by bots? Well, there's something called `ON_DEMAND_ISR_TOKEN` I've left in the `.env.template`. This is just some gibberish I made up, but it's used to authenticate the request. If you don't have the token, you can't trigger the revalidation.

```jsx
  // confirm this is a valid req by checking the secret token
  if (req.query.secret !== process.env.ON_DEMAND_ISR_TOKEN) {
    return res.status(401).json({ message: "Invalid token" });
  }
```

## reviews.ts API endpoint

The `reviews.ts` API endpoint is used to fetch all reviews from the database. It is used in the `reviews/index.tsx` page.

## user-reviews.ts API endpoint

The `user-reviews.ts` API endpoint is used to fetch all reviews from the database for a given user. It is used in the `reviews/my-reviews.tsx` page.


# Other Pages (than `pages/index.tsx`)

## [course_code].tsx

This is the dynamic route for a given course. For example, clicking on the CIT-591 course row on the homepage will route to `courses/CIT-591.tsx`.

There's a lot of stuff going on here, so Imma give a more to-the-point breakdown:

### Course Reviews Page[course_code].tsx Overview

The Course Reviews page, defined in `[course_code].tsx`, dynamically renders information about a specific course, including its name, code, and associated reviews. This filIte utilizes NextJS's `getStaticPaths` and `getStaticProps` for data fetching and rendering optimization, making the page highly efficient and SEO-friendly.

### Data Fetching and Preparation

#### Static Paths Generation

```typescript
export const getStaticPaths: GetStaticPaths = async () => {
  const { data: courses, error } = await supabase.from("Courses").select("course_code");
  const paths = courses.map(course => ({ params: { course_code: course.course_code } }));
  return { paths, fallback: false };
};
```

- **Purpose**: Generates paths for all courses, allowing NextJS to pre-render static pages for each course at build time.

#### Static Props Fetching

```typescript
export const getStaticProps = async (context: GetStaticPropsContext<{ course_code: string }>) => {
  // Fetch course data, summaries, and reviews based on course_code
};
```

- **Purpose**: Fetches detailed course information, summaries, and reviews, enabling server-side rendering of comprehensive course data. Meaning, loads fast, no need for lots of calls everyday.

### Rendering and Styling

#### Reviews Display

```typescript
if (!reviews.length) {
  return <Typography variant="h6" align="center" mt={5}>No reviews are available for this course.</Typography>;
}
```

- **Empty State**: Displays a message when no reviews are available for the course.

### ReviewCard Component

```typescript
{reviews.map((review, index) => (
  <ReviewCard review={review} key={review.id} course={course} />
))}
```

- **Purpose**: Reuses the `ReviewCard` component for each review, making use of DRY. I basically use this thingy everywhere.

## Create Review Page

The `create-review.tsx` component is a form page in the Next.js application where users can submit reviews for courses. It utilizes static generation for fetching course data and state management for handling form inputs and submissions. 

### Static Generation with `getStaticProps`

```tsx
export const getStaticProps: GetStaticProps = async () => {
  // Fetch courses data and sort alphabetically by course_code
};
```

- **Purpose**: Fetches all courses at build time for static generation, ensuring the form is populated with the latest course information without needing to fetch data on every request.

### Authentication Check and Redirect

```tsx
useEffect(() => {
  // Check for user session and redirect if not authenticated
}, [router]);
```

- **Purpose**: Ensures that only authenticated users can access the form, redirecting unauthenticated users to the homepage.
- **Improvement Suggestion**: Maybe we should use `next-auth`? I dunno.

### Snackbars for Notifications

```tsx
<Snackbar open={openSnackbar} autoHideDuration={4000}>
  <Alert>Successfully submitted new review!</Alert>
</Snackbar>
```

- **Purpose**: Uses snackbars to inform the user of the form submission outcome.
- **Improvement Suggestion**: Snackbars suck. I think perhaps we should use `toastify` or something.

## my-reviews.tsx

The `user-reviews.tsx` component is designed for displaying a user's submitted reviews on various courses. It leverages React's hooks for state management (is this a good idea?) and side effects, and integrates with Supabase for authentication and data fetching. 

### Authentication and Data Fetching

Upon component mounting, an effect hook is utilized to verify user authentication and subsequently fetch the user's reviews.

```javascript
useEffect(() => {
  const fetchReviews = async () => {
    // Authentication check and data fetching logic
  };

  fetchReviews();
}, []);
```

### Review Display

I reuse the `ReviewCard` component to display each review, passing in the review data and the associated course data as props.

```javascript
{reviews.map((review, index) => (
  <ReviewCard key={index} review={review} course={review.course} />
))}
```
