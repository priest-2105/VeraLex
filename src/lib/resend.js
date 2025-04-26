import { Resend } from 'resend';

const resendApiKey = import.meta.env.VITE_RESEND_API_KEY;

if (!resendApiKey) {
  console.warn("Resend API Key is not configured for client-side use. Email sending might fail or should be handled server-side.");
}

// Note: Initializing Resend client-side exposes your API key.
// It's generally recommended to handle email sending via a backend API.
export const resend = resendApiKey ? new Resend(resendApiKey) : null; 