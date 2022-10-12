import Mailgun from "mailgun.js";
import FormData from "form-data";

const { MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_USER } = import.meta.env;

const mailgun = new Mailgun(FormData);

const mg = mailgun.client({ username: "api", key: MAILGUN_API_KEY });

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) => {
  try {
    const data = {
      from: `Portfolio <${MAILGUN_USER}>`,
      to,
      subject,
      text,
      html,
    };

    await mg.messages.create(MAILGUN_DOMAIN, data);

    return true;
  } catch (err) {
    console.error("Error sending email", err);
  }
};
