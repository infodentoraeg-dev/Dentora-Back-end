import nodemailer from 'nodemailer';

export const sendEmailOtp = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Dentora Verification Code',
    html: `
      <h2>Your verification code is:</h2>
      <h1>${otp}</h1>
      <p>This code expires in 5 minutes.</p>
    `,
  });
};
