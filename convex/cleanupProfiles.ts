import { mutation } from "./_generated/server";
import { v } from "convex/values";

export default mutation({  // Change to default export
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    // Get all profiles
    const profiles = await ctx.db.query("profiles").collect();
    let count = 0;
    
    // Update each profile to ensure correct field structure
    for (const profile of profiles) {
      // Check if the problematic field exists
      if ('created_at' in profile) {
        // Create a new object without the created_at field
        const { created_at, ...cleanProfile } = profile;
        
        // Update the document
        await ctx.db.replace(profile._id, cleanProfile);
        count++;
      }
    }
    
    return `Cleaned up ${count} profiles`;
  },
});