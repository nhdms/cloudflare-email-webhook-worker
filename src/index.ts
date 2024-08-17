/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { extract } from "letterparser";

async function gatherResponse(response: any) {
  const { headers } = response;
  const contentType = headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return JSON.stringify(await response.json());
  } else if (contentType.includes("application/text")) {
    return response.text();
  } else if (contentType.includes("text/html")) {
    return response.text();
  } else {
    return response.text();
  }
}

async function email(message: any, env: any, ctx?: any): Promise<void> {
  const url = env.WEBHOOK_URL;
  if (!url) throw new Error('Missing WEBHOOK_URL');

  let headers = {
    'Content-Type': 'application/json',
  }

  try {
    headers = Object.assign(headers, JSON.parse(env.EXTRA_HEADERS)) // json
  } catch (e) { }

  try {
    // Parse email
    const { from, to } = message;
    const subject = message.headers.get('subject') || '(no subject)';
    // BugFix: Replace "UTF-8" with "utf-8" to prevent letterparser from throwing an error for some messages.
    const rawEmail = (await new Response(message.raw).text()).replace(/utf-8/gi, 'utf-8');
    const email = extract(rawEmail);

    // Send webhook
    const init = {
      body: JSON.stringify({
        from,
        to,
        subject,
        email,
      }),
      method: "POST",
      headers: headers,
    };
    const response = await fetch(url, init);
    const results = await gatherResponse(response);
    console.log('processed ', results)
  } catch (error: any) {
    throw new Error(`Failed to post error to webhook. ${url} due to ${error.message}`);
  }
}

export default {
  email
};