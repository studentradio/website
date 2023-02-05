/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

const data = {
  '/sra-chart-16-october': {
    name: 'JAM Radio',
    src: 'https://chart-api.s.workers.dev/audio/Jam%20Radio%20Chart%20Show%20-%2016.10.2022.mp3'
  },
  '/chart-show-update-27th-november': {
    name: 'URY',
    src: 'https://chart-api.s.workers.dev/audio/SRA%20Chart%20Show%20-%2027_11_2022%2014_00.mp3'
  },
  '/chart-show-update-30th-october': {
    name: 'Liverpool Guild Student Media',
    src: 'https://chart-api.s.workers.dev/audio/LGSM%20Chart%20Show%20Recording.mp3'
  },
  '/chart-show-update-23rd-october': {
    name: 'University Radio Falmer',
    src: 'https://chart-api.s.workers.dev/audio/URF%20SRA%20CHART%2023_10_22.m4a'
  },
  '/chart-show-update-20th-november': {
    name: 'Utter Radio',
    src: 'https://chart-api.s.workers.dev/audio/Utter%20Radio%20Chart%20show%20recording%2020_11_22.mp3'
  }
};
export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/audio')) {
      const object = await env.CHART.get(
        decodeURIComponent(url.pathname.split('/audio/')[1])
      );

      if (object === null) {
        return new Response(
          'Object Not Found: ' + url.pathname.split('/audio')[1],
          { status: 404 }
        );
      }

      const headers = new Headers({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      object.writeHttpMetadata(headers);
      headers.set('etag', object.httpEtag);

      return new Response(object.body, {
        headers
      });
    }
    return Response.json(data?.[url.pathname] ?? null);
  }
};
