// Explicit test-mode switch for the checkout payment step.
// Default: TRUE (prototype path) until Lemon Squeezy KYC/account review completes.
// To activate real payments later, set NEXT_PUBLIC_PAYMENT_TEST_MODE=false in Vercel
// env vars — no code changes required, the real Lemon Squeezy branch below is untouched
// and remains fully intact.
export const PAYMENT_TEST_MODE = process.env.NEXT_PUBLIC_PAYMENT_TEST_MODE !== "false";