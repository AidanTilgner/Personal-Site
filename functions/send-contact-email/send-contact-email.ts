import { Handler } from "@netlify/functions";
import nodemailer from "nodemailer";
import { config } from "dotenv";

config();

const { MAILGUN_USER, MAILGUN_PASSWORD, MAILGUN_FROM } = process.env;

export const handler: Handler = async (event, context) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: "No body",
    };
  }
  const body = JSON.parse(event.body) as {
    name: string;
    email: string;
    message: string;
  };
  const { message, email, name } = body;
  console.log("Body: ", body);

  const { MAIL_TO = "aidantilgner02@gmail.com" } = process.env;

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

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Success!`,
    }),
  };
};

// create transporter with mailgun credentials
const transporter = nodemailer.createTransport({
  service: "Mailgun",
  auth: {
    user: MAILGUN_USER,
    pass: MAILGUN_PASSWORD,
  },
});

const mailOpts = {
  from: MAILGUN_FROM,
};

const sendEmail = async ({
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
    const info = await transporter.sendMail({
      ...mailOpts,
      to,
      subject,
      text,
      html,
    });
  } catch (err) {
    console.error(err);
  }
};
