import { QueryCtx, MutationCtx } from "./_generated/server";

export async function canAccessResource(
  ctx: QueryCtx | MutationCtx,
  table: string,
  resourceId: string,
  userId: string
) {
  switch (table) {
    case "representatives":
      return await isRepresentative(ctx, userId);
    case "constituents":
      return await isConstituent(ctx, userId);
    case "communications":
      return await canAccessCommunication(ctx, resourceId, userId);
    // Add other resource checks as needed
    default:
      return false;
  }
}

async function isRepresentative(ctx: QueryCtx | MutationCtx, userId: string) {
  const profile = await ctx.db
    .query("profiles")
    .filter(q => q.eq(q.field("id"), userId))
    .first();
  return profile?.role === "representative";
}

async function isConstituent(ctx: QueryCtx | MutationCtx, userId: string) {
  const profile = await ctx.db
    .query("profiles")
    .filter(q => q.eq(q.field("id"), userId))
    .first();
  return profile?.role === "constituent";
}

async function canAccessCommunication(
  ctx: QueryCtx | MutationCtx,
  communicationId: string,
  userId: string
) {
  const communication = await ctx.db.get(communicationId);
  if (!communication) return false;

  return communication.representative_id === userId || 
         communication.constituent_id === userId;
}