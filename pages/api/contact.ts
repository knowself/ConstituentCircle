import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (!process.env.SMTP_USER || !process.env.CONTACT_EMAIL_TO) {
    console.error('Missing required environment variables');
    return res.status(500).json({ message: 'Server configuration error' });
  }

  const mailOptions = {
    to: process.env.CONTACT_EMAIL_TO,
    from: process.env.CONTACT_EMAIL_FROM || process.env.SMTP_USER,
    subject: `New Constituent Circle Contact Form from ${name}`,
    text: `
Name: ${name}
Email: ${email}
Message: ${message}
    `,
    html: `
<h3>New Contact Form Submission</h3>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Failed to send message' });
  }
}