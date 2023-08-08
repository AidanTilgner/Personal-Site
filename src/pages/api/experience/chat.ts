import type { APIRoute } from "astro";

export const post: APIRoute = async ({}) => {
  return new Response(
    JSON.stringify({
      message: "Successfully retrieved chat data!",
    })
  );
};
