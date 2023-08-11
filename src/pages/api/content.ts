import { backend } from "../../utils/axios";
import type { APIRoute } from "astro";
import type { Block } from "../../../types/blocks";

export const post: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const conversation = body.conversation;
    const socket_id = request.headers.get("x-socket-id");

    const { data } = await backend.post<{ data: Block[] }>(
      `/content/blocks`,
      {
        conversation,
      },
      {
        headers: {
          "x-socket-id": socket_id,
        },
      },
    );

    return new Response(
      JSON.stringify({
        message: "Successfully retrieved blocks!",
        data: data.data,
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        message: "Internal server error",
        data: null,
      }),
      { status: 500 },
    );
  }
};
