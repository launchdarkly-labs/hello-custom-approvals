# Hello Custom Approvals

This repo contains a sample app used to demonstrate LaunchDarkly's Custom Approvals integration.

## Setup

1. Run `npm install`
2. Run `cp .env.sample .env` to create a new `.env` file from the sample.
3. Specify a new `SECRET_KEY` in the app. It can by any string you want. This will be used as your API key that you'll use to configure the Custom Approvals integration in LaunchDarkly.
4. Make sure you have [ngrok](https://ngrok.com/) installed locally.

## Running the app

1. Run `npm run dev`
2. In a new tab run `ngrok http 3000 --region=us --subdomain=<YOUR_NGROK_SUBDOMAIN>`
3. Configure your LaunchDarkly environment's approval settings with the **Custom Approvals** approval system. Use the `SECRET_KEY` from above as the `API Token` and your ngrok URL as the **Custom approval service base URL**.
