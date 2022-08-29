import type { APIRoute  } from 'astro';
import Astro from 'astro';

export const get: APIRoute = ({ params, request }) =>  {
  return {
    body: JSON.stringify({
      path: new URL(request.url).pathname,
      params,
      result: params.n * params.n,
    })
  };
}