import type { APIInfo, GeneratedTool, ParsedAPI, ProbeResult, DetectionResult } from './types';

/**
 * Generates AI-callable tool definitions from API discovery results.
 */
export class ToolGenerator {
  /**
   * Generate tools from whatever discovery data is available.
   */
  generateTools(
    detection: DetectionResult,
    registry: APIInfo | null,
    parsedSpec?: ParsedAPI,
    probeResult?: ProbeResult,
  ): GeneratedTool[] {
    // Priority: OpenAPI spec > registry > probe results
    if (parsedSpec && parsedSpec.endpoints.length > 0) {
      return this.fromOpenAPISpec(parsedSpec);
    }
    if (registry) {
      return this.fromRegistry(registry);
    }
    if (probeResult) {
      return this.fromProbe(probeResult, detection);
    }
    return [];
  }

  private fromOpenAPISpec(spec: ParsedAPI): GeneratedTool[] {
    return spec.endpoints.map((ep) => {
      const properties: Record<string, any> = {};
      const required: string[] = [];

      for (const param of ep.parameters) {
        properties[param.name] = { type: param.type, description: param.description };
        if (param.required) required.push(param.name);
      }

      // If there's a request body, add a 'body' param
      if (ep.requestBody) {
        properties['body'] = { type: 'object', description: 'Request body' };
      }

      const name = ep.operationId ?? `${ep.method.toLowerCase()}_${ep.path.replace(/[^a-zA-Z0-9]/g, '_')}`;

      return {
        name: name.slice(0, 64),
        description: ep.summary || `${ep.method} ${ep.path}`,
        parameters: { type: 'object' as const, properties, required },
        method: ep.method,
        path: ep.path,
        source: 'openapi' as const,
      };
    });
  }

  private fromRegistry(info: APIInfo): GeneratedTool[] {
    return info.commonEndpoints.map((ep) => {
      // Extract path parameters like {guildId}
      const pathParams = [...ep.path.matchAll(/\{(\w+)\}/g)].map((m) => m[1]!);
      const properties: Record<string, any> = {};
      const required: string[] = [];

      for (const param of pathParams) {
        properties[param] = { type: 'string', description: `The ${param}` };
        required.push(param);
      }

      // POST/PUT/PATCH likely need a body
      if (['POST', 'PUT', 'PATCH'].includes(ep.method)) {
        properties['body'] = { type: 'object', description: 'Request body (JSON)' };
      }

      const name = `${info.platform}_${ep.description.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;

      return {
        name: name.slice(0, 64),
        description: `[${info.displayName}] ${ep.description}`,
        parameters: { type: 'object' as const, properties, required },
        method: ep.method,
        path: ep.path,
        source: 'registry' as const,
      };
    });
  }

  private fromProbe(probe: ProbeResult, detection: DetectionResult): GeneratedTool[] {
    // Generate a generic "call this endpoint" tool for each responding endpoint
    return probe.respondedEndpoints
      .filter((ep) => ep.status >= 200 && ep.status < 400)
      .map((ep) => ({
        name: `probe_${detection.platform}_${ep.path.replace(/[^a-zA-Z0-9]/g, '_')}`,
        description: `Discovered endpoint: GET ${ep.path} (status ${ep.status})`,
        parameters: {
          type: 'object' as const,
          properties: {
            queryParams: { type: 'object', description: 'Optional query parameters' },
          },
          required: [],
        },
        method: 'GET',
        path: ep.path,
        source: 'probe' as const,
      }));
  }
}
