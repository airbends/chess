import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {
    level: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let tricks = await ctx.db.query("tricks").order("desc").collect();
    
    const tricksWithProfiles = await Promise.all(
      tricks.map(async (trick) => {
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_user", (q) => q.eq("userId", trick.userId))
          .unique();
        return { ...trick, profile };
      })
    );

    // Group tricks by difficulty level
    const groupedTricks = tricksWithProfiles.reduce((acc, trick) => {
      const level = trick.level || "uncategorized";
      if (!acc[level]) {
        acc[level] = [];
      }
      acc[level].push(trick);
      return acc;
    }, {} as Record<string, typeof tricksWithProfiles>);

    // Filter by level if provided
    if (args.level) {
      return { [args.level]: groupedTricks[args.level] || [] };
    }

    return groupedTricks;
  },
});

export const listUserTricks = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const tricks = await ctx.db
      .query("tricks")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();
    return { tricks, profile };
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    moves: v.string(),
    level: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    await ctx.db.insert("tricks", {
      title: args.title,
      description: args.description,
      moves: args.moves,
      level: args.level,
      userId,
    });
  },
});

export const remove = mutation({
  args: { trickId: v.id("tricks") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const trick = await ctx.db.get(args.trickId);
    if (!trick || trick.userId !== userId) {
      throw new Error("Not authorized to delete this trick");
    }
    
    await ctx.db.delete(args.trickId);
  },
});
