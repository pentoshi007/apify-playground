/**
 * Apify API Service
 * Handles all communication with the Apify platform API
 */

interface ApifyActor {
  id: string;
  name: string;
  title: string;
  description: string;
  username: string;
  currentVersionNumber: string;
  stats: {
    totalRuns: number;
  };
}

interface ApifyActorInput {
  type: string;
  title?: string;
  description?: string;
  default?: string | number | boolean;
  example?: string | number | boolean;
  enum?: string[];
}

interface ApifyActorSchema {
  properties: Record<string, ApifyActorInput>;
  required?: string[];
}

interface ApifyRunResult {
  id: string;
  status: string;
  startedAt: string;
  finishedAt?: string;
  stats: {
    inputBodyLen: number;
    itemsCount: number;
    requestsCount: number;
  };
  defaultDatasetId: string;
  defaultKeyValueStoreId: string;
}

interface ApifyBuild {
  id: string;
  status: string;
  startedAt: string;
  finishedAt?: string;
  buildNumber: string;
  tag?: string;
  actorVersion: string;
}

interface ApifyActorDetails {
  id: string;
  name: string;
  inputSchema?: ApifyActorSchema;
  defaultRunOptions?: {
    input?: Record<string, unknown>;
  };
  [key: string]: unknown;
}

export class ApifyApiService {
  private baseUrl = import.meta.env.DEV ? '/api/apify' : 'https://api.apify.com/v2';
  private apiKey: string;

  constructor(apiKey: string) {
    // Validate API key format
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
      throw new Error('Invalid API key provided');
    }
    
    // Warn if not using HTTPS in production
    if (!import.meta.env.DEV && window.location.protocol !== 'https:') {
      console.warn('⚠️ API key should only be used over HTTPS in production');
    }
    
    this.apiKey = apiKey.trim();
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Log only in development mode for security
    if (import.meta.env.DEV) {

    }
    
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': 'Apify-Actor-Playground/1.0',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API request failed with status ${response.status}`;
      
      // Handle specific HTTP status codes
      switch (response.status) {
        case 401:
          errorMessage = 'Invalid API key or authentication failed';
          break;
        case 403:
          errorMessage = 'Access forbidden - check your API key permissions';
          break;
        case 429:
          errorMessage = 'Rate limit exceeded - please try again later';
          break;
        case 500:
          errorMessage = 'Apify server error - please try again later';
          break;
        default:
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error?.message || errorMessage;
          } catch {
            // If JSON parsing fails, use the text as error message
            errorMessage = errorText || errorMessage;
          }
      }

      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Validate the API key by making a simple request to the user endpoint
   */
  async validateApiKey(): Promise<boolean> {
    try {
      await this.makeRequest('/users/me');
      return true;
    } catch (error) {
      console.error('API key validation failed:', error);
      return false;
    }
  }

  /**
   * Fetch all actors for the authenticated user
   */
  async getActors(): Promise<ApifyActor[]> {
    try {
      const response = await this.makeRequest<{ data: { items: ApifyActor[] } }>('/acts?my=1&limit=100');
      return response.data.items.map(actor => ({
        id: actor.id,
        name: actor.name,
        title: actor.title || actor.name,
        description: actor.description || 'No description available',
        username: actor.username,
        currentVersionNumber: actor.currentVersionNumber || '1.0.0',
        stats: actor.stats || { totalRuns: 0 }
      }));
    } catch (error) {
      console.error('Failed to fetch actors:', error);
      throw new Error(`Failed to fetch actors: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get the input schema for a specific actor
   */
  async getActorSchema(actorId: string): Promise<ApifyActorSchema> {
    try {
      // Get the full actor object which should include the input schema
      const response = await this.makeRequest<{ data: ApifyActorDetails }>(`/acts/${actorId}`);
      const actor = response.data;
      
      // Debug logging - show actor schema

      
      // Extract input schema from the actor object
      if (actor.inputSchema) {
        return actor.inputSchema;
      } else if (actor.defaultRunOptions?.input) {
        // If no explicit input schema, try to infer from default input
        const defaultInput = actor.defaultRunOptions.input;
        const properties: Record<string, ApifyActorInput> = {};
        
        // Create a basic schema from the default input structure
        Object.keys(defaultInput).forEach(key => {
          const value = defaultInput[key];
          properties[key] = {
            type: typeof value,
            title: key.charAt(0).toUpperCase() + key.slice(1),
            default: typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' ? value : undefined
          };
        });
        
        return {
          properties,
          required: []
        };
      } else {
        // Return empty schema if no input schema is available
        return {
          properties: {},
          required: []
        };
      }
    } catch (error) {
      console.error(`Failed to fetch schema for actor ${actorId}:`, error);
      throw new Error(`Failed to fetch actor schema: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get available builds for an actor
   */
  async getActorBuilds(actorId: string): Promise<ApifyBuild[]> {
    try {
      const response = await this.makeRequest<{ data: { items: ApifyBuild[] } }>(`/acts/${actorId}/builds?desc=1&limit=10`);
      return response.data.items;
    } catch (error) {
      console.error(`Failed to fetch builds for actor ${actorId}:`, error);
      return [];
    }
  }

  /**
   * Run an actor with the given input
   */
  async runActor(actorId: string, input: Record<string, unknown>): Promise<ApifyRunResult> {
    try {
      // Debug logging
      if (import.meta.env.DEV) {

      }
      
      // First, try to get available builds to find a suitable build tag
      const builds = await this.getActorBuilds(actorId);
      let buildTag = 'latest'; // Default to latest
      
      if (builds.length > 0) {
        // Find the most recent successful build
        const successfulBuild = builds.find(build => build.status === 'SUCCEEDED');
        if (successfulBuild) {
          // Use the build tag if available, otherwise use the build number
          buildTag = successfulBuild.tag || successfulBuild.buildNumber || 'latest';

        } else {
          console.warn(`⚠️ No successful builds found for actor ${actorId}, trying with latest`);
        }
      }
      
      // Prepare the input payload - Apify API expects the input data directly as the POST body

      
      // Try to run with the determined build tag
      const response = await this.makeRequest<{ data: ApifyRunResult }>(`/acts/${actorId}/runs?build=${buildTag}`, {
        method: 'POST',
        body: JSON.stringify(input),
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to run actor ${actorId}:`, error);
      
      // If the error is about build not found, provide a more helpful error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('Build with tag') && errorMessage.includes('was not found')) {
        throw new Error(`Actor cannot be run because no suitable build is available. The actor may need to be built first. Original error: ${errorMessage}`);
      }
      
      throw new Error(`Failed to run actor: ${errorMessage}`);
    }
  }

  /**
   * Wait for a run to complete and return the final status
   */
  async waitForRun(actorId: string, runId: string, maxWaitTime = 300000): Promise<ApifyRunResult> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      try {
        const response = await this.makeRequest<{ data: ApifyRunResult }>(`/acts/${actorId}/runs/${runId}`);
        const run = response.data;
        
        if (run.status === 'SUCCEEDED' || run.status === 'FAILED' || run.status === 'ABORTED' || run.status === 'TIMED-OUT') {
          return run;
        }
        
        // Wait 2 seconds before checking again
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Error checking run status:`, error);
        throw error;
      }
    }
    
    throw new Error('Run timed out');
  }

  /**
   * Get the dataset items from a completed run
   */
  async getRunResults(datasetId: string): Promise<unknown[]> {
    try {
      const datasetInfo = await this.makeRequest<any>(`/datasets/${datasetId}`);
      const itemCount = datasetInfo?.data?.itemCount ?? datasetInfo?.itemCount ?? 0;
      
      if (itemCount === 0) {
        return [];
      }
      
      const response = await this.makeRequest<any>(`/datasets/${datasetId}/items?format=json&clean=true`);
      
      let items: unknown[] = [];
      if (response?.data?.items) {
        items = response.data.items;
      } else if (response?.items) {
        items = response.items;
      } else if (Array.isArray(response)) {
        items = response;
      } else if (response) {
        items = [response];
      }
      
      return items;
      
    } catch (error) {
      console.error(`❌ Failed to fetch results for dataset ${datasetId}:`, error);
      
      const fallbackEndpoints = [
        `/datasets/${datasetId}/items`,
        `/datasets/${datasetId}/items?format=json`,
        `/datasets/${datasetId}/download?format=json`
      ];
      
      for (const endpoint of fallbackEndpoints) {
        try {
          const fallbackResponse = await this.makeRequest<any>(endpoint);
          
          if (fallbackResponse?.data?.items) {
            return fallbackResponse.data.items;
          } else if (fallbackResponse?.items) {
            return fallbackResponse.items;
          } else if (Array.isArray(fallbackResponse)) {
            return fallbackResponse;
          } else if (fallbackResponse) {
            return [fallbackResponse];
          }
        } catch {
          continue;
        }
      }
      
      return [];
    }
  }
}

// Helper function to create API service instance
export const createApifyService = (apiKey: string) => new ApifyApiService(apiKey);