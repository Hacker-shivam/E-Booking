const SibApiV3Sdk = require("sib-api-v3-sdk");
require("dotenv").config();

// Setup Brevo client
const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

// ------------------ Booking Email ------------------
const sendBookingEmail = async (userEmail, userName, eventTitle) => {
    try {
        await tranEmailApi.sendTransacEmail({
            sender: {
                email: process.env.EMAIL_USER, // verified email in Brevo
                name: "BookMySeat"
            },
            to: [{ email: userEmail }],
            subject: `Booking Confirmed: ${eventTitle}`,
            htmlContent: `
                <h2>Hi ${userName}!</h2>
                <p>Your booking for the event <strong>${eventTitle}</strong> is successfully confirmed.</p>
                <p>Thank you for choosing Eventora.</p>
            `
        });

        console.log("✅ Booking email sent to", userEmail);
    } catch (error) {
        console.error("❌ Error sending booking email:", error.response?.body || error.message);
    }
};

// ------------------ OTP Email ------------------
const sendOTPEmail = async (userEmail, otp, type) => {
    try {
        const title =
            type === "account_verification"
                ? "Verify your Eventora Account"
                : "Eventora Booking Verification";

        const msg =
            type === "account_verification"
                ? "Please use the following OTP to verify your new Eventora account."
                : "Please use the following OTP to verify and confirm your event booking.";

        await tranEmailApi.sendTransacEmail({
            sender: {
                email: process.env.EMAIL_USER,
                name: "BookMySeat"
            },
            to: [{ email: userEmail }],
            subject: title,
            htmlContent: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <h2 style="color: #111;">${title}</h2>
                    <p style="color: #555; font-size: 16px;">${msg}</p>
                    <div style="margin: 20px auto; padding: 15px; font-size: 24px; font-weight: bold; background: #f4f4f4; width: max-content; letter-spacing: 5px;">
                        ${otp}
                    </div>
                    <p style="color: #999; font-size: 12px;">
                        This code expires in 5 minutes. If you didn't request this, please ignore this email.
                    </p>
                </div>
            `
        });

        console.log(`✅ OTP sent to ${userEmail} for ${type}`);
    } catch (error) {
        console.error("❌ Error sending OTP email:", error.response?.body || error.message);
    }
};

module.exports = { sendBookingEmail, sendOTPEmail };