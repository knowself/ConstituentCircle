import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const addGovernmentRepresentatives = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    const now = Date.now();
    
    // Federal Level - Senate
    await ctx.db.insert("profiles", {
      email: "mitchell.senate@gov.example.com",
      role: "representative",
      governmentLevel: "federal",
      jurisdiction: "state",
      district: 'Texas',
      createdAt: now,
      displayname: "Sen. Sarah Mitchell",
      name: "Sarah Mitchell",
      metadata: {
        firstName: "Sarah",
        lastName: "Mitchell",
        employmentType: "elected"
      },
      userId: await ctx.db.insert("users", {
        email: "mitchell.senate@gov.example.com",
        role: "representative",
        name: "Sarah Mitchell",
        authProvider: "email",
        metadata: {
          firstName: "Sarah",
          lastName: "Mitchell",
          employmentType: "elected"
        },
        createdAt: now
      }),
    });

    // State Level
    await ctx.db.insert("profiles", {
      email: "governor@texas.gov.example.com",
      role: "representative",
      governmentLevel: "state",
      jurisdiction: "state",
      district: 'Texas',
      createdAt: now,
      displayname: "Gov. Greg Abbott",
      name: "Greg Abbott",
      metadata: {
        firstName: "Greg",
        lastName: "Abbott",
        employmentType: "elected"
      },
      userId: await ctx.db.insert("users", {
        email: "governor@texas.gov.example.com",
        role: "representative",
        name: "Greg Abbott",
        authProvider: "email",
        metadata: {
          firstName: "Greg",
          lastName: "Abbott",
          employmentType: "elected"
        },
        createdAt: now
      })
    });

    // County Level
    await ctx.db.insert("profiles", {
      email: "wong@harris.county.example.com",
      role: "representative",
      governmentLevel: "county",
      jurisdiction: "precinct",
      district: 'Precinct 2',
      createdAt: now,
      displayname: "Commissioner Lisa Wong",
      name: "Lisa Wong",
      metadata: {
        firstName: "Lisa",
        lastName: "Wong",
        employmentType: "elected"
      },
      userId: await ctx.db.insert("users", {
        email: "wong@harris.county.example.com",
        role: "representative",
        name: "Lisa Wong",
        authProvider: "email",
        metadata: {
          firstName: "Lisa",
          lastName: "Wong",
          employmentType: "elected"
        },
        createdAt: now
      })
    });

    // City Level
    await ctx.db.insert("profiles", {
      email: "mayor@houston.gov.example.com",
      role: "representative",
      governmentLevel: "municipal",
      jurisdiction: "municipal",
      district: 'Houston',
      createdAt: now,
      displayname: "Mayor Sylvester Turner",
      name: "Sylvester Turner",
      metadata: {
        firstName: "Sylvester",
        lastName: "Turner",
        employmentType: "elected"
      },
      userId: await ctx.db.insert("users", {
        email: "mayor@houston.gov.example.com",
        role: "representative",
        name: "Sylvester Turner",
        authProvider: "email",
        metadata: {
          firstName: "Sylvester",
          lastName: "Turner",
          employmentType: "elected"
        },
        createdAt: now
      })
    });

    // School District
    await ctx.db.insert("profiles", {
      email: "martinez@hisd.example.com",
      role: "representative",
      governmentLevel: "school_district",
      jurisdiction: "district",
      district: 'District IV',
      createdAt: now,
      displayname: "Trustee Patricia Martinez",
      name: "Patricia Martinez",
      metadata: {
        firstName: "Patricia",
        lastName: "Martinez",
        employmentType: "elected"
      },
      userId: await ctx.db.insert("users", {
        email: "martinez@hisd.example.com",
        role: "representative",
        name: "Patricia Martinez",
        authProvider: "email",
        metadata: {
          firstName: "Patricia",
          lastName: "Martinez",
          employmentType: "elected"
        },
        createdAt: now
      })
    });

    return "Representatives added successfully";
  },
});
