import type { APIRoute } from "astro";
import { chatInstance } from "@/helpers/axiosInstance";

export const post: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { message, session_id } = body;
    console.log("Message: ", message);
    console.log("Session ID: ", session_id);

    const response = await chatInstance
      .post("/chat", {
        message,
        session_id,
      })
      .then((res) => res.data)
      .catch((err) => err.response.data);

    const toSend = {
      ...response,
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
