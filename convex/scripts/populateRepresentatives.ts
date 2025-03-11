import { mutation } from "../_generated/server";

export const addGovernmentRepresentatives = mutation({
  args: {},
  handler: async (ctx) => {
    const currentDate = new Date().toISOString();
    
    // Federal Level - Senate
    await ctx.db.insert("profiles", {
      name: "Sarah Mitchell",
      email: "mitchell.senate@gov.example.com",
      role: "representative",
      governmentLevel: "federal",
      position: "Senator",
      jurisdiction: "Texas",
      party: "Independent",
      termStart: Date.now(),
      termEnd: Date.now() + (6 * 365 * 24 * 60 * 60 * 1000), // 6 years
      createdAt: Date.now(),
      created_at: currentDate,
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
      termStart: Date.now(),
      termEnd: Date.now() + (6 * 365 * 24 * 60 * 60 * 1000),
      createdAt: Date.now(),
      created_at: currentDate,
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
      termStart: Date.now(),
      termEnd: Date.now() + (2 * 365 * 24 * 60 * 60 * 1000), // 2 years
      createdAt: Date.now(),
      created_at: currentDate,
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
      termStart: Date.now(),
      termEnd: Date.now() + (4 * 365 * 24 * 60 * 60 * 1000), // 4 years
      createdAt: Date.now(),
      created_at: currentDate,
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
      termStart: Date.now(),
      termEnd: Date.now() + (4 * 365 * 24 * 60 * 60 * 1000),
      createdAt: Date.now(),
      created_at: currentDate,
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
      termStart: Date.now(),
      termEnd: Date.now() + (4 * 365 * 24 * 60 * 60 * 1000),
      createdAt: Date.now(),
      created_at: currentDate,
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
      termStart: Date.now(),
      termEnd: Date.now() + (4 * 365 * 24 * 60 * 60 * 1000),
      createdAt: Date.now(),
      created_at: currentDate,
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
      termStart: Date.now(),
      termEnd: Date.now() + (4 * 365 * 24 * 60 * 60 * 1000),
      createdAt: Date.now(),
      created_at: currentDate,
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
      termStart: Date.now(),
      termEnd: Date.now() + (2 * 365 * 24 * 60 * 60 * 1000),
      createdAt: Date.now(),
      created_at: currentDate,
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
      termStart: Date.now(),
      termEnd: Date.now() + (4 * 365 * 24 * 60 * 60 * 1000),
      createdAt: Date.now(),
      created_at: currentDate,
      displayname: "Trustee Patricia Martinez",
      metadata: {
        firstName: "Patricia",
        lastName: "Martinez",
        employmentType: "elected"
      },
      district: "District IV"
    });

    return "Representatives added successfully";
  },
});