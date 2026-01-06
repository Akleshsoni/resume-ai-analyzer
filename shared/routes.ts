import { z } from 'zod';
import { insertAnalysisSchema, analyses } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  analyze: {
    method: 'POST' as const,
    path: '/api/analyze',
    // We expect multipart/form-data, but Zod schema here validates the extracted fields 
    // or we can use a simpler schema for the body if we handle parsing manually.
    // However, usually we send text if we parsed it on client, or file if on server.
    // Let's assume server-side parsing. The input schema here describes the non-file fields.
    input: z.object({
      jobDescription: z.string(),
    }), 
    responses: {
      200: z.custom<typeof analyses.$inferSelect>(),
      400: errorSchemas.validation,
      500: errorSchemas.internal,
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type AnalysisResponse = z.infer<typeof api.analyze.responses[200]>;
