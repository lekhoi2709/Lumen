import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

async function mailSender(email: string, title: string, body: string) {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER!,
        pass: process.env.MAIL_PASS!,
      },
      tls: {
        rejectUnauthorized: true,
      },
    } as SMTPTransport.Options);

    const info = await transporter.sendMail({
      from: {
        name: "Lumen - LMS",
        address: process.env.MAIL_USER!,
      },
      to: email,
      subject: title,
      html: body,
    });

    return info;
  } catch (error) {
    console.log(error);
  }
}

export default mailSender;
