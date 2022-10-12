import type { APIRoute } from "astro";

export const post: APIRoute = async ({ request }) => {
  try {
    console.log("Got a request!", request);
    const toSend = {
      message: "Success!",
    };
    return {
      body: JSON.stringify(toSend),
    };
  } catch (err) {
    const toSend = {
      body: {
        message: "Error!",
        error: err,
      },
    };
    return {
      body: JSON.stringify(toSend),
    };
  }
};
