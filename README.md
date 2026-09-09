<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/4dc90b3d-ee3d-4f0e-9cf6-66d6e92b57c5

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Payment and security requirements

The browser must not hold payment-provider secrets or settle balances. The client now:

- requires an authenticated buyer and a configured server-side escrow provider;
- never credits seller balances or confirms settlement from the browser;
- keeps deal chat open until the user explicitly presses the close button;
- relies on authenticated Firestore rules for users, orders and messages.

Configure the escrow provider through server-side deployment secrets. Do not put API keys,
HCB passwords, webhook secrets or admin credentials in `localStorage`, Firebase configuration,
or frontend environment variables. A real integration also requires the provider's signed
webhook to release or refund funds on the server.
