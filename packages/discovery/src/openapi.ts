import YAML from 'yaml';
import type { ParsedAPI, ParsedEndpoint } from './types';

/**
 * Parse an OpenAPI 3.x specification (YAML or JSON string, or object).
 */
export function parseOpenAPISpec(spec: string | object): ParsedAPI {
  let doc: any;
  if (typeof spec === 'string') {
    // Try JSON first, fall back to YAML
    try {
      doc = JSON.parse(spec);
    } catch {
      doc = YAML.parse(spec);
    }
  } else {
    doc = spec;
  }

  const title = doc.info?.title ?? 'Unknown API';
  const version = doc.info?.version ?? '0.0.0';

  // Resolve base URL
  let baseUrl = '';
  if (doc.servers?.length > 0) {
    baseUrl = doc.servers[0].url ?? '';
  }

  const endpoints: ParsedEndpoint[] = [];

  if (doc.paths) {
    for (const [path, methods] of Object.entries(doc.paths as Record<string, any>)) {
      for (const [method, operation] of Object.entries(methods as Record<string, any>)) {
        if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
          const params = (operation.parameters ?? []).map((p: any) => ({
            name: p.name,
            in: p.in,
            required: p.required ?? false,
            type: p.schema?.type ?? 'string',
            description: p.description ?? '',
          }));

          endpoints.push({
            method: method.toUpperCase(),
            path,
            operationId: operation.operationId,
            summary: operation.summary ?? operation.description ?? '',
            parameters: params,
            requestBody: operation.requestBody?.content?.['application/json']?.schema,
            responseSchema: operation.responses?.['200']?.content?.['application/json']?.schema,
          });
        }
      }
    }
  }

  return { title, version, baseUrl, endpoints };
}
