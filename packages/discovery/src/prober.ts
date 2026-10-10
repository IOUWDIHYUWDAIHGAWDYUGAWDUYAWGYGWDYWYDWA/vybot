import type { ProbeResult } from './types';

const PROBE_PATHS = ['/', '/api', '/api/v1', '/v1', '/v2', '/health', '/status', '/me', '/self', '/info'];
const TIMEOUT_MS = 5_000;

/**
 * Safely probe an unknown API to discover its structure.
 * Only performs GET requests — never modifies data.
 */
export class APIProber {
  /**
   * Probe a base URL with safe GET requests.
   * @param baseUrl - The API root URL to probe
   * @param fetchFn - A fetch function (may be proxied with credentials)
   */
  async probe(baseUrl: string, fetchFn: typeof fetch = fetch): Promise<ProbeResult> {
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const respondedEndpoints: ProbeResult['respondedEndpoints'] = [];
    const apiHints: string[] = [];
    let rateLimitInfo: ProbeResult['rateLimitInfo'] = null;
    let detectedAuth = 'unknown';

    for (const path of PROBE_PATHS) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

        const res = await fetchFn(`${cleanBase}${path}`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });
        clearTimeout(timer);

        // Extract rate limit headers
        const rlRemaining = res.headers.get('x-ratelimit-remaining');
        const rlReset = res.headers.get('x-ratelimit-reset');
        if (rlRemaining) {
          rateLimitInfo = {
            remaining: parseInt(rlRemaining, 10),
            resetAt: rlReset ?? undefined,
          };
        }

        // Detect auth pattern from 401/403 responses
        if (res.status === 401 || res.status === 403) {
          const wwwAuth = res.headers.get('www-authenticate') ?? '';
          if (wwwAuth.toLowerCase().includes('bearer')) detectedAuth = 'Bearer token required';
          else detectedAuth = 'Authentication required (type unknown)';
        }

        // Stop on rate limit
        if (res.status === 429) {
          apiHints.push('Rate limiting detected — stopping probe');
          break;
        }

        const contentType = res.headers.get('content-type') ?? '';
        let bodyPreview = '';
        try {
          const text = await res.text();
          bodyPreview = text.slice(0, 500);
          if (contentType.includes('json')) apiHints.push('JSON API');
          if (text.includes('"swagger"') || text.includes('"openapi"')) apiHints.push('OpenAPI spec found');
          if (text.includes('"pagination"') || text.includes('"next_cursor"')) apiHints.push('Pagination support detected');
        } catch { /* empty */ }

        respondedEndpoints.push({
          path,
          status: res.status,
          contentType,
          bodyPreview,
        });
      } catch {
        // Timeout or network error — skip this path
      }
    }

    if (respondedEndpoints.some((e) => e.contentType.includes('json'))) {
      apiHints.push('REST API');
    }

    return { baseUrl: cleanBase, respondedEndpoints, detectedAuth, rateLimitInfo, apiHints };
  }
}
