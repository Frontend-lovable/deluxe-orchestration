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
  const url = 'https://siriusai-team-test.atlassian.net/wiki/rest/api/content?spaceKey=SO&type=page&expand=ancestors,version,space';
  
  const headers = {
    'Accept': 'application/json',
    'Authorization': 'Basic c2h1YmhhbS5zaW5naEBzaXJpdXNhaS5jb206QVRBVFQzeEZmR0YwS28zR3F4cXFvTGc1MFhCWVFqazBXcHVwT1JXUjFhdUMzWHpJZnNnQUkxejZSalBRWnhudGlsWHRQMHJjRFdrWThfSWNmSEFUTERjcWFpaVkycWs2dVhKWFllbFN1YkI4QlNRWWxBOU00R1VOdi1Wb1FSSEVRSEg0V0NkZXdRWHU5aDZZUDVQcGxUMW80S2dVQnhkTEZpOU4wZURYZHJfZnBNbTk3aTAycGpzPURFN0JDQjY4',
    'Cookie': 'atlassian.xsrf.token=f32abaf62147e552ff7e6e565564268648a4979d_lin'
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
  const url = `https://siriusai-team-test.atlassian.net/wiki/rest/api/content/${pageId}?expand=body.storage,version,space`;
  
  const headers = {
    'Accept': 'application/json',
    'Authorization': 'Basic c2h1YmhhbS5zaW5naEBzaXJpdXNhaS5jb206QVRBVFQzeEZmR0YwS28zR3F4cXFvTGc1MFhCWVFqazBXcHVwT1JXUjFhdUMzWHpJZnNnQUkxejZSalBRWnhudGlsWHRQMHJjRFdrWThfSWNmSEFUTERjcWFpaVkycWs2dVhKWFllbFN1YkI4QlNRWWxBOU00R1VOdi1Wb1FSSEVRSEg0V0NkZXdRWHU5aDZZUDVQcGxUMW80S2dVQnhkTEZpOU4wZURYZHJfZnBNbTk3aTAycGpzPURFN0JDQjY4',
    'Cookie': 'atlassian.xsrf.token=f32abaf62147e552ff7e6e565564268648a4979d_lin'
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