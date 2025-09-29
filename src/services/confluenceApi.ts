// Confluence API Service
export interface ConfluenceContent {
  id: string;
  type: string;
  status: string;
  title: string;
  space: {
    key: string;
    name: string;
  };
  version: {
    number: number;
    when: string;
    by: {
      displayName: string;
      email?: string;
    };
  };
  ancestors?: Array<{
    id: string;
    title: string;
  }>;
  _links: {
    webui: string;
    self: string;
  };
}

export interface ConfluenceResponse {
  results: ConfluenceContent[];
  start: number;
  limit: number;
  size: number;
  _links: {
    self: string;
    base: string;
    context: string;
  };
}

export const fetchConfluenceContent = async (): Promise<ConfluenceResponse> => {
  const url = '/confluence-api/wiki/rest/api/content?spaceKey=SO&type=page&expand=ancestors,version,space';
  
  const headers = {
    'Accept': 'application/json'
  };

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ConfluenceResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Confluence content:', error);
    throw error;
  }
};

export const getPageContent = async (pageId: string): Promise<any> => {
  const url = `/confluence-api/wiki/rest/api/content/${pageId}?expand=body.storage,version,space`;
  
  const headers = {
    'Accept': 'application/json'
  };

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching page content:', error);
    throw error;
  }
};