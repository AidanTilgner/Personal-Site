import {onyxInstance} from "./axiosInstance"

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
    const res = await onyxInstance.post("/api/services/email-v1.0.0/send-email", {
      to,
      subject,
      text,
      html,
    });

    console.log("Sent email: ", res.data);

    return res;
  } catch (err) {
    console.error("Error sending email: ", err);
    return err;
  }
}
