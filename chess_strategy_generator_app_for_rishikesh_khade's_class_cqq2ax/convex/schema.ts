import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  tricks: defineTable({
    title: v.string(),
    description: v.string(),
    moves: v.string(),
    userId: v.id("users"),
    level: v.string(),
  }).index("by_user", ["userId"]),
  
  profiles: defineTable({
    userId: v.id("users"),
    name: v.string(),
    bio: v.string(),
    chessLevel: v.string(),
    imageUrl: v.optional(v.string()),
  }).index("by_user", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
