import type { APIRoute } from "astro";
import { sendEmail } from "@/helpers/email";

export const post: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    sendEmail({
      to: "aidantilgner02@gmail.com",
      subject: `New message from "${name}"`,
      text: message,
      html: `<strong>${message}</strong>`,
    });

    console.log("Got a request!", body);
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
