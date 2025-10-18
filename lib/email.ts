import { EmailTemplate } from "@/components/email-template";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : undefined;

export const sendEmail = async ({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) => {
  try {
    if (!resend) {
      throw new Error("RESEND_API_KEY is not set");
    }
    const { data, error } = await resend.emails.send({
      from: `Francois <${process.env.RESEND_FROM_EMAIL}>`,
      to: [to],
      subject: subject,
      react: EmailTemplate({ text: text }),
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    return error;
  }
};
