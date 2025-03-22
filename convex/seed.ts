import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const seed = mutation({
  handler: async (ctx) => {
    // Create users
    const adminUser = await ctx.db.insert('users', {
      email: 'joe@derivativegenius.com',
      name: 'Admin User',
      createdAt: Date.now(),
      role: 'company_admin',
      displayname: 'Admin User'
    });

    const repUser = await ctx.db.insert('users', {
      email: 'rep@constituentcircle.com',
      name: 'Jane Smith',
      createdAt: Date.now(),
      role: 'representative',
      displayname: 'Jane Smith'
    });

    const constituentUser = await ctx.db.insert('users', {
      email: 'constituent@example.com',
      name: 'John Doe',
      createdAt: Date.now(),
      role: 'constituent',
      displayname: 'John Doe'
    });

    const internUser = await ctx.db.insert('users', {
      email: 'intern@campaign.com',
      name: 'Intern User',
      createdAt: Date.now(),
      role: 'campaign_staff',
      displayname: 'Intern User'
    });

    const seasonalUser = await ctx.db.insert('users', {
      email: 'seasonal@campaign.com',
      name: 'Seasonal Worker',
      createdAt: Date.now(),
      role: 'campaign_staff',
      displayname: 'Seasonal Worker'
    });

    const onloanUser = await ctx.db.insert('users', {
      email: 'onloan@campaign.com',
      name: 'On Loan Staff',
      createdAt: Date.now(),
      role: 'campaign_staff',
      displayname: 'On Loan Staff'
    });

    // Create profiles
    await ctx.db.insert('profiles', {
      email: 'joe@derivativegenius.com',
      role: 'company_admin',
      displayname: 'Admin User',
      governmentLevel: 'Federal',
      jurisdiction: 'National',
      metadata: {
        firstName: 'Admin',
        lastName: 'User',
        employmentType: 'permanent'
      },
      createdAt: Date.now(),
      userId: adminUser
    });

    await ctx.db.insert('profiles', {
      email: 'rep@constituentcircle.com',
      role: 'representative',
      displayname: 'Jane Smith',
      governmentLevel: 'State',
      jurisdiction: 'State',
      metadata: {
        firstName: 'Jane',
        lastName: 'Smith',
        employmentType: 'elected'
      },
      createdAt: Date.now(),
      userId: repUser
    });

    await ctx.db.insert('profiles', {
      email: 'constituent@example.com',
      role: 'constituent',
      displayname: 'John Doe',
      governmentLevel: 'Local',
      jurisdiction: 'Municipal',
      metadata: {
        firstName: 'John',
        lastName: 'Doe',
        employmentType: 'citizen'
      },
      createdAt: Date.now(),
      userId: constituentUser
    });

    await ctx.db.insert('profiles', {
      email: 'intern@campaign.com',
      role: 'campaign_staff',
      displayname: 'Intern User',
      governmentLevel: 'Local',
      jurisdiction: 'Municipal',
      metadata: {
        firstName: 'Intern',
        lastName: 'User',
        employmentType: 'intern'
      },
      createdAt: Date.now(),
      userId: internUser
    });

    await ctx.db.insert('profiles', {
      email: 'seasonal@campaign.com',
      role: 'campaign_staff',
      displayname: 'Seasonal Worker',
      governmentLevel: 'Local',
      jurisdiction: 'Municipal',
      metadata: {
        firstName: 'Seasonal',
        lastName: 'Worker',
        employmentType: 'seasonal'
      },
      createdAt: Date.now(),
      userId: seasonalUser
    });

    await ctx.db.insert('profiles', {
      email: 'onloan@campaign.com',
      role: 'campaign_staff',
      displayname: 'On Loan Staff',
      governmentLevel: 'Local',
      jurisdiction: 'Municipal',
      metadata: {
        firstName: 'On Loan',
        lastName: 'Staff',
        employmentType: 'onloan'
      },
      createdAt: Date.now(),
      userId: onloanUser
    });

    // Create representative
    const representative = await ctx.db.insert('representatives', {
      email: 'rep@constituentcircle.com',
      fullName: 'Jane Smith',
      district: 'District 5',
      officeType: 'State Representative',
      party: 'Independent',
      termStart: Date.now(),
      termEnd: Date.now() + 365 * 24 * 60 * 60 * 1000, // One year from now
      createdAt: Date.now(),
      userId: repUser
    });

    // Create constituent with enhanced fields
    const constituent = await ctx.db.insert('constituents', {
      email: 'constituent@example.com',
      fullName: 'John Doe',
      // Location details
      town: 'Springfield Township',
      city: 'Springfield',
      state: 'IL',
      county: 'Sangamon County',
      district: 'District 5',
      // Enhanced preferences
      preferences: {
        contact_preference: 'email',
        interests: ['education', 'healthcare', 'infrastructure', 'environment'],
        notification_frequency: 'daily',
        subscribed_topics: ['budget', 'elections', 'local_issues']
      },
      // Engagement tracking
      status: 'active',
      lastEngagementAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
      messageCount: 5,
      // Metadata
      metadata: {
        phone: '555-123-4567',
        address: '123 Main St, Springfield, IL 62701',
        ageRange: '35-44',
        registrationDate: Date.now() - 30 * 24 * 60 * 60 * 1000 // 30 days ago
      },
      createdAt: Date.now(),
      userId: constituentUser
    });

    // Create additional constituents for testing
    const constituent2 = await ctx.db.insert('constituents', {
      email: 'sarah@example.com',
      fullName: 'Sarah Johnson',
      town: 'Springfield Township',
      city: 'Springfield',
      state: 'IL',
      county: 'Sangamon County',
      district: 'District 5',
      preferences: {
        contact_preference: 'phone',
        interests: ['education', 'public_safety', 'taxes'],
        notification_frequency: 'weekly',
        subscribed_topics: ['education_reform', 'public_safety']
      },
      status: 'active',
      lastEngagementAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
      messageCount: 3,
      metadata: {
        phone: '555-987-6543',
        address: '456 Oak St, Springfield, IL 62704',
        ageRange: '25-34',
        registrationDate: Date.now() - 45 * 24 * 60 * 60 * 1000
      },
      createdAt: Date.now(),
      userId: await ctx.db.insert('users', {
        email: 'sarah@example.com',
        name: 'Sarah Johnson',
        createdAt: Date.now(),
        role: 'constituent',
        displayname: 'Sarah Johnson'
      })
    });

    const constituent3 = await ctx.db.insert('constituents', {
      email: 'michael@example.com',
      fullName: 'Michael Williams',
      town: 'Lincoln Township',
      city: 'Lincoln',
      state: 'IL',
      county: 'Logan County',
      district: 'District 5',
      preferences: {
        contact_preference: 'in-app',
        interests: ['transportation', 'economy', 'veterans'],
        notification_frequency: 'asap',
        subscribed_topics: ['infrastructure', 'jobs', 'veterans_affairs']
      },
      status: 'active',
      lastEngagementAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
      messageCount: 8,
      metadata: {
        phone: '555-456-7890',
        address: '789 Elm St, Lincoln, IL 62656',
        ageRange: '45-54',
        registrationDate: Date.now() - 60 * 24 * 60 * 60 * 1000
      },
      createdAt: Date.now(),
      userId: await ctx.db.insert('users', {
        email: 'michael@example.com',
        name: 'Michael Williams',
        createdAt: Date.now(),
        role: 'constituent',
        displayname: 'Michael Williams'
      })
    });

    // Create groups
    const educationGroup = await ctx.db.insert('groups', {
      name: 'Education Committee',
      description: 'Group focused on education policy',
      type: 'committee',
      settings: {
        visibility: 'public'
      },
      metadata: {
        priority: 'high',
        meeting_schedule: 'monthly'
      },
      createdAt: Date.now(),
      representativeId: representative
    });

    const healthcareGroup = await ctx.db.insert('groups', {
      name: 'Healthcare Advocates',
      description: 'Citizens interested in healthcare reform',
      type: 'interest',
      settings: {
        visibility: 'public'
      },
      metadata: {
        priority: 'medium',
        meeting_schedule: 'quarterly'
      },
      createdAt: Date.now(),
      representativeId: representative
    });

    // Add group members
    await ctx.db.insert('groupMembers', {
      groupId: educationGroup,
      constituentId: constituent,
      role: 'member',
      joinedAt: Date.now()
    });

    await ctx.db.insert('groupMembers', {
      groupId: healthcareGroup,
      constituentId: constituent,
      role: 'coordinator',
      joinedAt: Date.now()
    });

    // Add new constituents to groups
    await ctx.db.insert('groupMembers', {
      groupId: educationGroup,
      constituentId: constituent2,
      role: 'member',
      joinedAt: Date.now()
    });

    await ctx.db.insert('groupMembers', {
      groupId: healthcareGroup,
      constituentId: constituent3,
      role: 'member',
      joinedAt: Date.now()
    });

    // Create communications
    await ctx.db.insert('communications', {
      representativeId: representative,
      constituentId: constituent,
      messageType: 'newsletter',
      content: 'Monthly update on district activities and upcoming town halls',
      channel: 'email',
      status: 'sent',
      sentAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
      createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000
    });

    await ctx.db.insert('communications', {
      representativeId: representative,
      constituentId: constituent,
      messageType: 'response',
      content: 'Thank you for your inquiry about the new education bill. I appreciate your feedback.',
      channel: 'email',
      status: 'sent',
      sentAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
      createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000
    });

    await ctx.db.insert('communications', {
      representativeId: representative,
      constituentId: constituent,
      messageType: 'inquiry',
      content: 'I would like to know your position on the upcoming healthcare vote.',
      channel: 'web',
      status: 'received',
      sentAt: Date.now() - 24 * 60 * 60 * 1000,
      createdAt: Date.now() - 24 * 60 * 60 * 1000
    });

    // Additional communications for new constituents
    await ctx.db.insert('communications', {
      representativeId: representative,
      constituentId: constituent2,
      messageType: 'inquiry',
      content: 'When is the next town hall meeting scheduled?',
      channel: 'web',
      status: 'received',
      sentAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
      createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000
    });

    await ctx.db.insert('communications', {
      representativeId: representative,
      constituentId: constituent3,
      messageType: 'feedback',
      content: 'I appreciate your support on the veterans benefits bill. Thank you for your service.',
      channel: 'email',
      status: 'sent',
      sentAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
      createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000
    });

    // Create analytics
    await ctx.db.insert('analytics', {
      period: 'monthly',
      metrics: {
        messages_sent: 45,
        response_rate: 0.87,
        avg_response_time: '8h'
      },
      engagement: {
        open_rate: 0.65,
        click_rate: 0.22,
        unsubscribe_rate: 0.01
      },
      demographics: {
        age_groups: {},
        locations: {}
      },
      trends: {
        increasing_topics: ['education', 'healthcare'],
        decreasing_topics: ['taxes']
      },
      timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000,
      metadata: {
        source: 'system_generated',
        version: '1.0'
      }
    });
  }
});
