import nodemailer from "nodemailer";

async function mailSender(email: string, title: string, body: string) {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_HOST,
      },
    });

    let info = await transporter.sendMail({
      from: "Lumen - LMS",
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
