import nodemailer from 'nodemailer';

// export const sendEmailOtp = async (email: string, otp: string) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });

//     const info = await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Dentora Verification Code',
//       html: `
//         <h2>Your verification code is:</h2>
//         <h1>${otp}</h1>
//         <p>This code expires in 5 minutes.</p>
//       `,
//     });

//     console.log(info);
//   } catch (err) {
//     console.error('Email Error:', err);
//     throw err;
//   }
// };

export const sendEmailOtp = async (email: string, otp: string) => {
  console.log('Creating transporter...');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  console.log('Verifying SMTP...');
  await transporter.verify();
  console.log('SMTP Verified');

  console.log('Sending email...');
  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Dentora Verification Code',
    html: `<h1>${otp}</h1>`,
  });

  console.log('Email sent:', info.messageId);
};
