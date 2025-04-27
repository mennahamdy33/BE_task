export default function generateVerificationEmailHtml(
  name: string,
  verificationLink: string,
): string {
  return `
      <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
        <h2>Hello, ${name}!</h2>
        <p>Thank you for registering. Please click the link below to verify your email address:</p>
        <p><a href="${verificationLink}" target="_blank" style="color: #007bff;">Verify Email</a></p>
        <p>If you did not create an account, please ignore this email.</p>
      </div>
    `;
}
