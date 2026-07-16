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
  try {
    console.log('Creating transporter...');
    console.log('EMAIL_USER =', process.env.EMAIL_USER);
    console.log(
      'EMAIL_PASSWORD =',
      process.env.EMAIL_PASSWORD ? 'Exists' : 'Missing',
    );
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    console.log('Verifying SMTP...');
    await transporter.verify();
    console.log('SMTP verified');

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Dentora Verification Code',
      html: `<h1>${otp}</h1>`,
    });

    console.log(info);
  } catch (err) {
    console.error('SMTP ERROR:', err);
    throw err;
  }
};
