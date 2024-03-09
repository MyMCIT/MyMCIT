# On-Demand ISR Documentation

## Overview

The MyMCIT NextJS application leverages Incremental Static Regeneration (ISR)  to enhance performance and user experience. While `getStaticProps` is utilized across the application for efficient data fetching and rendering at build time, there are specific scenarios, particularly related to database writes, where on-demand ISR becomes crucial.

## Understanding On-Demand ISR

On-Demand ISR allows you to regenerate static pages on-demand, post-deployment, ensuring that the data displayed to the users is updated following any CRUD (Create, Read, Update, Delete) operations, specifically focusing on CUD (Create, Update, Delete) actions in our context.

### When to Use On-Demand ISR

On-demand ISR should be employed judiciously to balance between performance optimization and data freshness. For the MyMCIT application, you should trigger on-demand ISR only in response to database write operations, for example:

- Creating a new review
- Updating an existing review
- Deleting a review

These operations inherently modify the data that subsequent users should view, necessitating a page regeneration to reflect the latest state.

### Example: Review Operations

When a user performs any action that alters review data (create, update, or delete), on-demand ISR should be invoked to revalidate the specific course reviews page:

- **Creating a Review**: Triggers a revalidation for the course's review page to display the new review.
- **Updating a Review**: Ensures that any edits are immediately visible to all users.
- **Deleting a Review**: Removes the review content from the course page for future visitors.

Please refer to `pages/api/create-review.ts` for a good example of our on-demand ISR is deployed in this app.

Note that `create-review.ts` features a Supabase call writing a new review to the Postgres DB:

```typescript
  const { data, error: insertError } = await supabaseClient
    .from("Reviews")
    .insert([
      {
        course_id: course_id,
        semester: semester,
        difficulty: difficulty,
        workload: workload,
        rating: rating,
        comment: comment,
        user_id: userData.user?.id,
      },
    ]);

  if (insertError) {
    console.log(data);
    console.log(insertError);
    return res.status(500).json({ error: insertError.message });
  }
```

Then note after that DB `INSERT` is completed, on-Demand ISR takes place:

```typescript
// Fetch revalidate API to trigger on-demand ISR
const response = await axios(
    `${apiUrl}/api/revalidate?secret=${process.env.ON_DEMAND_ISR_TOKEN}&course=${course_code}`,
);
```

For this app, we follow the routing convention for courses of `{apiUrl}/courses/{course_code}`. As such, this is the route that needs to be revalidated so the new review is displayed.

## Implementing On-Demand ISR Securely

To securely implement on-demand ISR, follow these guidelines:

- **Revalidation Token**: Use a secure, randomly generated token (refer to CIT 592 principles) that's of sufficient length to prevent brute-force attacks. This token authenticates revalidation requests to safeguard against unauthorized triggers.

```javascript
// In your API route, check the revalidation token
if (req.query.secret !== process.env.ON_DEMAND_ISR_TOKEN) {
  return res.status(401).json({ message: "Invalid token" });
}
```

- Token Management: Store this token securely and ensure it's only known to the server and authorized personnel. Do not expose it in client-side code or public repositories.

## Process Flow

1. **Trigger**: Initiate the revalidation process immediately after a CUD operation is successfully executed.
2. **Validation**: In your revalidation endpoint, authenticate the request using your secure token.
3. **Selective Revalidation**: Precisely target the routes affected by the CUD action to optimize performance. For example, revalidate the course page that corresponds to the review being manipulated.

## NextJS On-Demand ISR Documentation

You can find the official NextJS On-Demand ISR documentation here: https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration. 
