import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { internal } from './_generated/api';

const http = httpRouter();

http.route({
  path: '/createAdminUser',
  method: 'POST',
  handler: httpAction(async (ctx, req) => {
    console.log('Hit /createAdminUser with:', await req.json());
    const args = await req.json();
    const result = await ctx.runMutation(internal.scripts.createAdminUser, args);
    console.log('Result:', result);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }),
});

export default http;