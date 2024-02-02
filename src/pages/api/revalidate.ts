export default async function handler(req: any, res: any) {
  // confirm this is a valid req by checking the secret token
  if (req.query.secret !== process.env.ON_DEMAND_ISR_TOKEN) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    // console log the request
    console.log("Request: ", req.query);
    console.log("Revalidated reviews page");
    await res.revalidate("/");
    console.log("Revalidated home page");

    // get specific course_code from request query and use it to revalidate the specific course page.
    if (req.query.course) {
      await res.revalidate(`/courses/${req.query.course}`);
      console.log("Revalidated course page: ", req.query.course);
    }

    return res.json({ revalidated: true });
  } catch (err) {
    // give a description error message
    console.error(err);
    return res.status(500).send("Error revalidating");
  }
}
