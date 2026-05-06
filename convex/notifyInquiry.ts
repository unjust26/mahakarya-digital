import { v } from "convex/values";
import { action } from "./_generated/server";

declare const process: { env: Record<string, string | undefined> };

const VIKTOR_API_URL = process.env.APP_API_URL!;
const PROJECT_NAME = process.env.APP_PROJECT_NAME!;
const PROJECT_SECRET = process.env.APP_PROJECT_SECRET!;

async function callTool<T>(role: string, args: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(`${VIKTOR_API_URL}/api/viktor-spaces/tools/call`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      project_name: PROJECT_NAME,
      project_secret: PROJECT_SECRET,
      role,
      arguments: args,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }

  const json = await response.json();
  if (!json.success) {
    throw new Error(json.error ?? "Tool call failed");
  }
  return json.result as T;
}

export const notifyNewInquiry = action({
  args: {
    name: v.string(),
    email: v.string(),
    business: v.optional(v.string()),
    package: v.optional(v.string()),
    message: v.string(),
  },
  returns: v.string(),
  handler: async (_ctx, { name, email, business, message, package: pkg }) => {
    const notification = `🔔 *New MahaKarya Digital Inquiry!*\n\n*Name:* ${name}\n*Email:* ${email}${business ? `\n*Business:* ${business}` : ""}${pkg ? `\n*Package:* ${pkg}` : ""}\n*Message:* ${message}\n\n_Please follow up with this client._`;

    try {
      await callTool<{ success: boolean }>("coworker_send_slack_message", {
        channel_id: "C0B0AEH5F6E",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: notification,
            },
          },
        ],
      });
      return "notified";
    } catch (err) {
      console.error("Failed to notify Slack:", err);
      return "notification_failed";
    }
  },
});
