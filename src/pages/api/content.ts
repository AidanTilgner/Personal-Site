import { backend } from "../../utils/axios";
import type { APIRoute } from "astro";
import type { Block } from "../../../types/blocks";

export const get: APIRoute = async ({ request }) => {
  try {
    const searchParams = new URLSearchParams(request.url);
    const query = searchParams.get("query");

    const { data } = await backend.get<{ data: Block[] }>(
      `/content/blocks?query=${query}`
    );

    return new Response(
      JSON.stringify({
        message: "Successfully retrieved blocks!",
        data: data.data,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        message: "Internal server error",
        data: null,
      }),
      { status: 500 }
    );
  }
};
