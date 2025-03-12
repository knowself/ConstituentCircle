import { mutation } from "./_generated/server";
import { v } from "convex/values";

export default mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    // Step 1: Delete all existing profiles
    const profiles = await ctx.db.query("profiles").collect();
    let deletedCount = 0;
    
    for (const profile of profiles) {
      await ctx.db.delete(profile._id);
      deletedCount++;
    }
    
    const now = Date.now();
    
    // Federal Level - Senate
    await ctx.db.insert("profiles", {
      name: "Sarah Mitchell",
      email: "mitchell.senate@gov.example.com",
      role: "representative",
      governmentLevel: "federal",
      position: "Senator",
      jurisdiction: "Texas",
      party: "Independent",
      termStart: now,
      termEnd: now + (6 * 365 * 24 * 60 * 60 * 1000),
      createdAt: now,
      displayname: "Sen. Sarah Mitchell",
      metadata: {
        firstName: "Sarah",
        lastName: "Mitchell",
        employmentType: "elected"
      },
      district: "Texas"
    });

    await ctx.db.insert("profiles", {
      name: "James Rodriguez",
      email: "rodriguez.senate@gov.example.com",
      role: "representative",
      governmentLevel: "federal",
      position: "Senator",
      jurisdiction: "Texas",
      party: "Independent",
      termStart: now,
      termEnd: now + (6 * 365 * 24 * 60 * 60 * 1000),
      createdAt: now,
      displayname: "Sen. James Rodriguez",
      metadata: {
        firstName: "James",
        lastName: "Rodriguez",
        employmentType: "elected"
      },
      district: "Texas"
    });

    // Federal Level - House
    await ctx.db.insert("profiles", {
      name: "David Chen",
      email: "chen.house@gov.example.com",
      role: "representative",
      governmentLevel: "federal",
      position: "Representative",
      jurisdiction: "TX-32",
      party: "Independent",
      termStart: now,
      termEnd: now + (2 * 365 * 24 * 60 * 60 * 1000),
      createdAt: now,
      displayname: "Rep. David Chen",
      metadata: {
        firstName: "David",
        lastName: "Chen",
        employmentType: "elected"
      },
      district: "TX-32"
    });

    // State Level
    await ctx.db.insert("profiles", {
      name: "Greg Abbott",
      email: "governor@texas.gov.example.com",
      role: "representative",
      governmentLevel: "state",
      position: "Governor",
      jurisdiction: "Texas",
      party: "Independent",
      termStart: now,
      termEnd: now + (4 * 365 * 24 * 60 * 60 * 1000),
      createdAt: now,
      displayname: "Gov. Greg Abbott",
      metadata: {
        firstName: "Greg",
        lastName: "Abbott",
        employmentType: "elected"
      },
      district: "Texas"
    });

    await ctx.db.insert("profiles", {
      name: "Maria Garcia",
      email: "garcia@texas.gov.example.com",
      role: "representative",
      governmentLevel: "state",
      position: "State Senator",
      jurisdiction: "Texas District 15",
      party: "Independent",
      termStart: now,
      termEnd: now + (4 * 365 * 24 * 60 * 60 * 1000),
      createdAt: now,
      displayname: "State Sen. Maria Garcia",
      metadata: {
        firstName: "Maria",
        lastName: "Garcia",
        employmentType: "elected"
      },
      district: "District 15"
    });

    // County Level
    await ctx.db.insert("profiles", {
      name: "Robert Thompson",
      email: "thompson@harris.county.example.com",
      role: "representative",
      governmentLevel: "county",
      position: "County Judge",
      jurisdiction: "Harris County",
      party: "Independent",
      termStart: now,
      termEnd: now + (4 * 365 * 24 * 60 * 60 * 1000),
      createdAt: now,
      displayname: "Judge Robert Thompson",
      metadata: {
        firstName: "Robert",
        lastName: "Thompson",
        employmentType: "elected"
      },
      district: "Harris County"
    });

    await ctx.db.insert("profiles", {
      name: "Lisa Wong",
      email: "wong@harris.county.example.com",
      role: "representative",
      governmentLevel: "county",
      position: "County Commissioner",
      jurisdiction: "Harris County Precinct 2",
      party: "Independent",
      termStart: now,
      termEnd: now + (4 * 365 * 24 * 60 * 60 * 1000),
      createdAt: now,
      displayname: "Commissioner Lisa Wong",
      metadata: {
        firstName: "Lisa",
        lastName: "Wong",
        employmentType: "elected"
      },
      district: "Precinct 2"
    });

    // City Level
    await ctx.db.insert("profiles", {
      name: "Sylvester Turner",
      email: "mayor@houston.gov.example.com",
      role: "representative",
      governmentLevel: "city",
      position: "Mayor",
      jurisdiction: "Houston",
      party: "Independent",
      termStart: now,
      termEnd: now + (4 * 365 * 24 * 60 * 60 * 1000),
      createdAt: now,
      displayname: "Mayor Sylvester Turner",
      metadata: {
        firstName: "Sylvester",
        lastName: "Turner",
        employmentType: "elected"
      },
      district: "Houston"
    });

    await ctx.db.insert("profiles", {
      name: "Michael Lee",
      email: "lee@houston.gov.example.com",
      role: "representative",
      governmentLevel: "city",
      position: "City Council Member",
      jurisdiction: "Houston District C",
      party: "Independent",
      termStart: now,
      termEnd: now + (2 * 365 * 24 * 60 * 60 * 1000),
      createdAt: now,
      displayname: "Council Member Michael Lee",
      metadata: {
        firstName: "Michael",
        lastName: "Lee",
        employmentType: "elected"
      },
      district: "District C"
    });

    // School District
    await ctx.db.insert("profiles", {
      name: "Patricia Martinez",
      email: "martinez@hisd.example.com",
      role: "representative",
      governmentLevel: "school_district",
      position: "School Board Trustee",
      jurisdiction: "Houston ISD District IV",
      party: "Independent",
      termStart: now,
      termEnd: now + (4 * 365 * 24 * 60 * 60 * 1000),
      createdAt: now,
      displayname: "Trustee Patricia Martinez",
      metadata: {
        firstName: "Patricia",
        lastName: "Martinez",
        employmentType: "elected"
      },
      district: "District IV"
    });

    return `Deleted ${deletedCount} profiles and regenerated new ones`;
  },
});