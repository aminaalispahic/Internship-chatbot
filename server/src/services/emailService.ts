import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOTPEmail(to: string, otp: string) {
  await transporter.sendMail({
    from: `"App" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verifikacijski kod",
    html: `<h2>Tvoj kod: <strong>${otp}</strong></h2><p>Ističe za 10 minuta.</p>`,
  });
}