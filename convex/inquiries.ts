import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    business: v.optional(v.string()),
    package: v.optional(v.string()),
    message: v.string(),
  },
  returns: v.id("inquiries"),
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("inquiries", {
      ...args,
      status: "new",
      createdAt: Date.now(),
    });
    return id;
  },
});

export const list = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("inquiries"),
      _creationTime: v.number(),
      name: v.string(),
      email: v.string(),
      business: v.optional(v.string()),
      package: v.optional(v.string()),
      message: v.string(),
      status: v.string(),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx) => {
    return await ctx.db.query("inquiries").order("desc").collect();
  },
});
