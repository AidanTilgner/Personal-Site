import type { APIRoute } from "astro";
import { sendEmail } from "@/helpers/email";

export const post: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    const { MAIL_TO } = import.meta.env;

    sendEmail({
      to: MAIL_TO,
      subject: `New message from "${name}"`,
      text: message,
      html: `
        <i>This message is from <a href="https://aidantilgner.dev" target="_blank">aidantilgner.dev</a></i>
        <hr style="border-coler" />
        <br />
        <p>
          ${message}
        </p>
        <br />
        <hr />
        <p>Reply to ${name} at <a href="mailto:${email}">${email}</a></p>
      `,
    });

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
