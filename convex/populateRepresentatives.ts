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
      governmentLevel: "Federal",
      jurisdiction: "State",
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
        metadata: {
          firstName: "Sarah",
          lastName: "Mitchell",
          employmentType: "elected"
        }
      }),
    });

    await ctx.db.insert("profiles", {
      email: "rodriguez.senate@gov.example.com",
      role: "representative",
      governmentLevel: "Federal",
      jurisdiction: "State",
      district: 'Texas',
      createdAt: now,
      displayname: "Sen. James Rodriguez",
      name: "James Rodriguez",
      metadata: {
        firstName: "James",
        lastName: "Rodriguez",
        employmentType: "elected"
      },
      userId: await ctx.db.insert("users", {
        email: "rodriguez.senate@gov.example.com",
        role: "representative",
        name: "James Rodriguez",
        metadata: {
          firstName: "James",
          lastName: "Rodriguez",
          employmentType: "elected"
        },
        createdAt: now
      })
    });

    // Federal Level - House
    await ctx.db.insert("profiles", {
      email: "chen.house@gov.example.com",
      role: "representative",
      governmentLevel: "Federal",
      jurisdiction: "District",
      district: 'TX-32',
      createdAt: now,
      displayname: "Rep. David Chen",
      name: "David Chen",
      metadata: {
        firstName: "David",
        lastName: "Chen",
        employmentType: "elected"
      },
      userId: await ctx.db.insert("users", {
        email: "chen.house@gov.example.com",
        role: "representative",
        name: "David Chen",
        metadata: {
          firstName: "David",
          lastName: "Chen",
          employmentType: "elected"
        },
        createdAt: now
      })
    });

    // State Level
    await ctx.db.insert("profiles", {
      email: "governor@texas.gov.example.com",
      role: "representative",
      governmentLevel: "State",
      jurisdiction: "State",
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
        metadata: {
          firstName: "Greg",
          lastName: "Abbott",
          employmentType: "elected"
        },
        createdAt: now
      })
    });

    await ctx.db.insert("profiles", {
      email: "garcia@texas.gov.example.com",
      role: "representative",
      governmentLevel: "State",
      jurisdiction: "District",
      district: 'District 15',
      createdAt: now,
      displayname: "State Sen. Maria Garcia",
      name: "Maria Garcia",
      metadata: {
        firstName: "Maria",
        lastName: "Garcia",
        employmentType: "elected"
      },
      userId: await ctx.db.insert("users", {
        email: "garcia@texas.gov.example.com",
        role: "representative",
        name: "Maria Garcia",
        metadata: {
          firstName: "Maria",
          lastName: "Garcia",
          employmentType: "elected"
        },
        createdAt: now
      })
    });

    // County Level
    await ctx.db.insert("profiles", {
      email: "thompson@harris.county.example.com",
      role: "representative",
      governmentLevel: "County",
      jurisdiction: "County",
      district: 'Harris County',
      createdAt: now,
      displayname: "Judge Robert Thompson",
      name: "Robert Thompson",
      metadata: {
        firstName: "Robert",
        lastName: "Thompson",
        employmentType: "elected"
      },
      userId: await ctx.db.insert("users", {
        email: "thompson@harris.county.example.com",
        role: "representative",
        name: "Robert Thompson",
        metadata: {
          firstName: "Robert",
          lastName: "Thompson",
          employmentType: "elected"
        },
        createdAt: now
      })
    });

    // County Level
    await ctx.db.insert("profiles", {
      email: "wong@harris.county.example.com",
      role: "representative",
      governmentLevel: "County",
      jurisdiction: "Precinct",
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
        metadata: {
          firstName: "Lisa",
          lastName: "Wong",
          employmentType: "elected"
        },
        createdAt: now
      })
    });

    // City Level entries
    await ctx.db.insert("profiles", {
      email: "mayor@houston.gov.example.com",
      role: "representative",
      governmentLevel: "Municipal",
      jurisdiction: "Municipal",
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
        metadata: {
          firstName: "Sylvester",
          lastName: "Turner",
          employmentType: "elected"
        },
        createdAt: now
      })
    });

    // Michael Lee entry
    await ctx.db.insert("profiles", {
      email: "lee@houston.gov.example.com",
      role: "representative",
      governmentLevel: "Municipal",
      jurisdiction: "District",
      district: 'District C',
      createdAt: now,
      displayname: "Council Member Michael Lee",
      name: "Michael Lee",
      metadata: {
        firstName: "Michael",
        lastName: "Lee",
        employmentType: "elected"
      },
      userId: await ctx.db.insert("users", {
        email: "lee@houston.gov.example.com",
        role: "representative",
        name: "Michael Lee",
        metadata: {
          firstName: "Michael",
          lastName: "Lee",
          employmentType: "elected"
        },
        createdAt: now
      })
    });

    // School District entry
    await ctx.db.insert("profiles", {
      email: "martinez@hisd.example.com",
      role: "representative",
      governmentLevel: "School District",
      jurisdiction: "District",
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