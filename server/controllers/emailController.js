// emailController.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmailOtp = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"Chat-App Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Your Chat-App OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 30px;">
            <h2 style="color: #2b2e4a; text-align: center;">Welcome to <span style="color: #4a90e2;">Chat-App</span>!</h2>
            <p style="font-size: 16px; color: #444444; text-align: center;">
              Chat. Connect. Collaborate — Without Limits.
            </p>
            
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />

            <p style="font-size: 16px; color: #333333;">
              Hi there,
            </p>

            <p style="font-size: 16px; color: #333333;">
              Thank you for signing up with <strong>Chat-App</strong>. Please use the OTP below to verify your email address and complete your registration.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #4a90e2;">${otp}</span>
              <p style="font-size: 14px; color: #888888;">(Valid for 10 minutes)</p>
            </div>

            <p style="font-size: 16px; color: #333333;">
              🔒 End-to-End Encryption — Your messages are secure and private.<br />
              ⚡ Real-Time Messaging — Communicate without delays.<br />
              🛡️ Privacy First — You’re always in control of your data.
            </p>

            <p style="font-size: 14px; color: #999999; margin-top: 30px;">
              If you did not request this code, please ignore this email.
            </p>

            <p style="font-size: 14px; color: #999999; text-align: center; margin-top: 20px;">
              — The Chat-App Team
            </p>
          </div>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    return { success: false, error: error.message };
  }
};
