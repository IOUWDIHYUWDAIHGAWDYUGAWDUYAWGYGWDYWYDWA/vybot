export class VyBotError extends Error {
  constructor(message: string, public readonly code: string = 'VYBOT_ERROR', public readonly statusCode: number = 500) {
    super(message);
    this.name = 'VyBotError';
  }
}

export class RateLimitExhaustedError extends VyBotError {
  constructor(public readonly retryAfter: Date, message: string = 'All AI providers have exhausted their rate limits') {
    super(message, 'RATE_LIMIT_EXHAUSTED', 429);
    this.name = 'RateLimitExhaustedError';
  }
}

export class ProviderError extends VyBotError {
  constructor(public readonly provider: string, public readonly providerStatusCode: number, message: string) {
    super(`Provider [${provider}] failed with status ${providerStatusCode}: ${message}`, 'PROVIDER_ERROR', 502);
    this.name = 'ProviderError';
  }
}

export class ConnectionError extends VyBotError {
  constructor(public readonly connectionId: string, message: string) {
    super(`Connection [${connectionId}] error: ${message}`, 'CONNECTION_ERROR', 400);
    this.name = 'ConnectionError';
  }
}

export class TaskExecutionError extends VyBotError {
  constructor(public readonly taskId: string, public readonly cause?: Error) {
    super(`Task [${taskId}] execution failed: ${cause ? cause.message : 'Unknown error'}`, 'TASK_EXECUTION_ERROR', 500);
    this.name = 'TaskExecutionError';
  }
}

export class CredentialError extends VyBotError {
  constructor(message: string = 'Invalid or missing credentials') {
    super(message, 'CREDENTIAL_ERROR', 401);
    this.name = 'CredentialError';
  }
}
