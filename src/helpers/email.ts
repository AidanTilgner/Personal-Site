import nodemailer from "nodemailer";

const { MAILGUN_USER, MAILGUN_PASSWORD, MAILGUN_FROM } = import.meta.env;

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

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
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
}
