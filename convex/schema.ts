import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  inquiries: defineTable({
    name: v.string(),
    email: v.string(),
    business: v.optional(v.string()),
    package: v.optional(v.string()),
    message: v.string(),
    status: v.string(),
    createdAt: v.number(),
  }),
  chatSessions: defineTable({
    sessionId: v.string(),
    createdAt: v.number(),
    lastActive: v.number(),
    visitorName: v.optional(v.string()),
    visitorEmail: v.optional(v.string()),
    isLead: v.boolean(),
  }).index("by_session", ["sessionId"]),
  chatMessages: defineTable({
    sessionId: v.string(),
    role: v.string(), // "user" | "assistant"
    content: v.string(),
    createdAt: v.number(),
  }).index("by_session", ["sessionId"]),
});

export default schema;
