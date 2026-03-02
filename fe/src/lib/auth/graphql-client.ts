const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  } else {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }
};

export const clearAuthToken = () => {
  authToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
};

export const getAuthToken = (): string | null => {
  if (authToken) return authToken;
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

type GraphQLError = {
  message: string;
  extensions?: {
    code?: string;
  };
};

type GraphQLResponse<T> = {
  data?: T;
  errors?: GraphQLError[];
};

export class GraphQLClientError extends Error {
  constructor(
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = 'GraphQLClientError';
  }
}

export const graphqlClient = async <T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> => {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new GraphQLClientError(
        `Network error: ${response.status} ${response.statusText}`,
      );
    }

    const result: GraphQLResponse<T> = await response.json();

    if (result.errors?.length) {
      const error = result.errors[0];
      throw new GraphQLClientError(error.message, error.extensions?.code);
    }

    if (!result.data) {
      throw new GraphQLClientError('No data returned from server');
    }

    return result.data;
  } catch (error) {
    if (error instanceof GraphQLClientError) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new GraphQLClientError(
        'Unable to connect to server. Please check your connection.',
      );
    }

    throw new GraphQLClientError(
      (error as Error).message || 'An unexpected error occurred',
    );
  }
};
