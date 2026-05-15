const { text } = require('express');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,

    pass: process.env.EMAIL_PASS,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Bakend_ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
const sendRegisterEmail = async (userEmail, userName) => {
  const subject = `🚀 Welcome to Interview AI Mock, ${userName}!`;

  const text = `
Hi ${userName},

Welcome to Interview AI Mock 🚀

Your account has been successfully created.

Start preparing smarter and land your dream job.

Best regards,
Interview AI Mock Team
`;

  const html = `
  <div style="font-family: Arial, sans-serif; background-color: #0f172a; padding: 40px 20px;">

    <div style="
      max-width: 620px;
      margin: auto;
      background: #111827;
      border-radius: 18px;
      overflow: hidden;
      border: 1px solid #1f2937;
    ">

      <div style="
        background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4);
        padding: 40px 30px;
        text-align: center;
      ">
        <h1 style="color: white; margin: 0;">
          Interview AI Mock 🚀
        </h1>
      </div>

      <div style="padding: 40px 30px; color: #e5e7eb;">

        <h2 style="color: white;">
          Welcome, ${userName} 👋
        </h2>

        <p style="color: #9ca3af; line-height: 1.7;">
          Your account has been successfully created.
          You’re now ready to prepare smarter with AI-driven interview guidance.
        </p>

      </div>

    </div>

  </div>
  `;

  await sendEmail(userEmail, subject, text, html);
};

const userGeneratedReportEmail = async (userEmail, userName) => {
  const subject = `📊 Your AI Interview Report is Ready, ${userName}!`;

  const text = `
Hi ${userName},

Your AI Interview Report has been successfully generated 🚀

You can now review:
- Technical performance
- Behavioral analysis
- Communication feedback
- AI match score
- Improvement suggestions

Keep practicing and improve your interview skills.

Best regards,
Interview AI Mock Team
`;

  const html = `
  <div style="
    font-family: Arial, sans-serif;
    background-color: #0f172a;
    padding: 40px 20px;
  ">

    <div style="
      max-width: 650px;
      margin: auto;
      background: #111827;
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid #1f2937;
    ">

      <!-- Header -->
      <div style="
        background: linear-gradient(135deg, #2563eb, #7c3aed, #06b6d4);
        padding: 45px 30px;
        text-align: center;
      ">

        <h1 style="
          color: white;
          margin: 0;
          font-size: 32px;
          font-weight: bold;
        ">
          Interview Report Ready 📊
        </h1>

        <p style="
          color: rgba(255,255,255,0.85);
          margin-top: 12px;
          font-size: 16px;
        ">
          AI-powered interview analysis & insights
        </p>

      </div>

      <!-- Body -->
      <div style="padding: 40px 30px;">

        <h2 style="
          color: white;
          font-size: 26px;
          margin-bottom: 12px;
        ">
          Hi ${userName} 👋
        </h2>

        <p style="
          color: #9ca3af;
          font-size: 16px;
          line-height: 1.8;
        ">
          Your personalized AI interview report has been successfully generated.
          Review your strengths, weaknesses, and performance insights to improve your interview preparation.
        </p>

        <!-- Report Summary -->
        <div style="
          background: #1f2937;
          border-radius: 16px;
          padding: 24px;
          margin: 30px 0;
        ">

          <h3 style="
            color: white;
            margin-top: 0;
            margin-bottom: 16px;
          ">
            📌 Report Includes
          </h3>

          <ul style="
            color: #d1d5db;
            line-height: 2;
            padding-left: 20px;
            margin: 0;
          ">
            <li>Technical Interview Evaluation</li>
            <li>Behavioral Communication Analysis</li>
            <li>AI Match Score</li>
            <li>Confidence & Speaking Review</li>
            <li>Improvement Recommendations</li>
            <li>Personalized Learning Suggestions</li>
          </ul>

        </div>

        <!-- CTA -->
        <div style="text-align: center; margin-top: 35px;">

          <a href="#"
             style="
              display: inline-block;
              padding: 15px 30px;
              border-radius: 14px;
              background: linear-gradient(135deg, #2563eb, #7c3aed);
              color: white;
              text-decoration: none;
              font-weight: bold;
              font-size: 16px;
             ">
            View Interview Report
          </a>

        </div>

      </div>

      <!-- Footer -->
      <div style="
        border-top: 1px solid #1f2937;
        padding: 22px;
        text-align: center;
        background: #0b1120;
      ">

        <p style="
          color: #6b7280;
          font-size: 13px;
          margin: 0;
        ">
          © 2026 Interview AI Mock. All rights reserved.
        </p>

      </div>

    </div>

  </div>
  `;

  await sendEmail(userEmail, subject, text, html);
};

module.exports =  { sendRegisterEmail , userGeneratedReportEmail};