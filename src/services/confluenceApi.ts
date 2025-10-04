const CONFLUENCE_AUTH = 'Basic c2h1YmhhbS5zaW5naEBzaXJpdXNhaS5jb206QVRBVFQzeEZmR0YwS28zR3F4cXFvTGc1MFhCWVFqazBXcHVwT1JXUjFhdUMzWHpJZnNnQUkxejZSalBRWnhudGlsWHRQMHJjRFdrWThfSWNmSEFUTERjcWFpaVkycWs2dVhKWFllbFN1YkI4QlNRWWxBOU00R1VOdi1Wb1FSSEVRSEg0V0NkZXdRWHU5aDZZUDVQcGxUMW80S2dVQnhkTEZpOU4wZURYZHJfZnBNbTk3aTAycGpzPURFN0JDQjY4';

export interface ConfluencePage {
  id: string;
  type: string;
  status: string;
  title: string;
  _links: {
    webui: string;
    self: string;
  };
}

export interface ConfluencePageDetails {
  id: string;
  type: string;
  status: string;
  title: string;
  body: {
    storage: {
      value: string;
      representation: string;
    };
  };
  version: {
    by: {
      displayName: string;
      email?: string;
    };
    when: string;
    number: number;
  };
  ancestors?: Array<{
    id: string;
    title: string;
  }>;
  _links: {
    webui: string;
  };
}

export const fetchConfluencePages = async (): Promise<ConfluencePage[]> => {
  try {
    const response = await fetch(
      '/confluence-api/wiki/rest/api/content?spaceKey=SO&type=page&limit=100',
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': CONFLUENCE_AUTH,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch pages: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching Confluence pages:', error);
    throw error;
  }
};

export const fetchConfluencePageDetails = async (pageId: string): Promise<ConfluencePageDetails> => {
  try {
    const response = await fetch(
      `/confluence-api/wiki/rest/api/content/${pageId}?expand=body.storage%2Cversion%2Cancestors`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': CONFLUENCE_AUTH,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch page details: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Confluence page details:', error);
    throw error;
  }
};

export interface CreateConfluencePageRequest {
  type: string;
  title: string;
  ancestors: Array<{ id: number }>;
  space: { key: string };
  body: {
    storage: {
      value: string;
      representation: string;
    };
  };
}

export const createConfluencePage = async (pageData: CreateConfluencePageRequest): Promise<any> => {
  try {
    const response = await fetch(
      '/confluence-api/wiki/rest/api/content/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': CONFLUENCE_AUTH,
        },
        body: JSON.stringify(pageData),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create page: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating Confluence page:', error);
    throw error;
  }
};
