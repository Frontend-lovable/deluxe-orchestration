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
  // For production/preview environments, use mock data since CORS proxy isn't available
  if (import.meta.env.PROD || window.location.hostname.includes('lovable')) {
    return getMockConfluenceData();
  }

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
  // For production/preview environments, use mock data since CORS proxy isn't available
  if (import.meta.env.PROD || window.location.hostname.includes('lovable')) {
    return getMockPageContent(pageId);
  }

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

// Mock data for production/preview environments
const getMockConfluenceData = (): ConfluenceResponse => ({
  results: [
    {
      id: "54493524",
      type: "page",
      status: "current",
      title: "SDLC Orchestration Tool",
      space: {
        key: "SO",
        name: "SDLC Orchestration"
      },
      version: {
        number: 2,
        when: "2025-09-15T12:47:00.423Z",
        by: {
          displayName: "Paritosh",
          email: ""
        }
      },
      _links: {
        webui: "/spaces/SO/overview",
        self: "https://siriusai-team-test.atlassian.net/wiki/rest/api/content/54493524"
      }
    },
    {
      id: "63799297",
      type: "page",
      status: "current",
      title: "Multi-Currency Support – Payments Platform Release",
      space: {
        key: "SO",
        name: "SDLC Orchestration"
      },
      version: {
        number: 1,
        when: "2025-09-24T09:22:04.885Z",
        by: {
          displayName: "Abhinav Munghate",
          email: ""
        }
      },
      _links: {
        webui: "/spaces/SO/pages/63799297/Multi-Currency+Support+Payments+Platform+Release",
        self: "https://siriusai-team-test.atlassian.net/wiki/rest/api/content/63799297"
      }
    },
    {
      id: "63766529",
      type: "page",
      status: "current",
      title: "Hourly Settlement Reporting – Payments Platform Release",
      space: {
        key: "SO",
        name: "SDLC Orchestration"
      },
      version: {
        number: 1,
        when: "2025-09-24T09:18:31.292Z",
        by: {
          displayName: "Abhinav Munghate",
          email: ""
        }
      },
      _links: {
        webui: "/spaces/SO/pages/63766529/Hourly+Settlement+Reporting+Payments+Platform+Release",
        self: "https://siriusai-team-test.atlassian.net/wiki/rest/api/content/63766529"
      }
    }
  ],
  start: 0,
  limit: 50,
  size: 3,
  _links: {
    self: "https://siriusai-team-test.atlassian.net/wiki/rest/api/content",
    base: "https://siriusai-team-test.atlassian.net/wiki",
    context: "/wiki"
  }
});

const getMockPageContent = (pageId: string): any => {
  const mockContents: Record<string, any> = {
    "54493524": {
      id: "54493524",
      type: "page",
      status: "current",
      title: "SDLC Orchestration Tool",
      space: {
        key: "SO",
        name: "SDLC Orchestration"
      },
      version: {
        number: 2,
        when: "2025-09-15T12:47:00.423Z",
        by: {
          displayName: "Paritosh"
        }
      },
      body: {
        storage: {
          value: `<h2>Description</h2>
          <p>The SDLC Orchestration Tool is designed to streamline and automate the software development lifecycle process.</p>
          <h2>Project Tracker</h2>
          <p>This section contains project tracking information and links to related Jira projects.</p>
          <h2>Recently updated content</h2>
          <p>This list shows the most recently updated content in the space.</p>
          <h2>Contributors</h2>
          <p>This section lists the contributors to this space.</p>`
        }
      }
    },
    "63799297": {
      id: "63799297",
      type: "page",
      status: "current",
      title: "Multi-Currency Support – Payments Platform Release",
      space: {
        key: "SO",
        name: "SDLC Orchestration"
      },
      version: {
        number: 1,
        when: "2025-09-24T09:22:04.885Z",
        by: {
          displayName: "Abhinav Munghate"
        }
      },
      body: {
        storage: {
          value: `<h1>Business Requirements Document (BRD): Multi-Currency Support</h1>
          <h2>1. Document Overview</h2>
          <p>This document captures the business requirements for implementing multi-currency support in the payments platform.</p>
          <h2>2. Purpose</h2>
          <p>The goal is to enable transactions in additional currencies and improve the platform's global reach.</p>
          <h2>3. Background / Context</h2>
          <p>Currently, the platform supports transactions only in USD. There is a need to support additional currencies to cater to a broader international market.</p>`
        }
      }
    },
    "63766529": {
      id: "63766529",
      type: "page",
      status: "current",
      title: "Hourly Settlement Reporting – Payments Platform Release",
      space: {
        key: "SO",
        name: "SDLC Orchestration"
      },
      version: {
        number: 1,
        when: "2025-09-24T09:18:31.292Z",
        by: {
          displayName: "Abhinav Munghate"
        }
      },
      body: {
        storage: {
          value: `<h1>Business Requirements Document (BRD): Hourly Settlement Reporting</h1>
          <h2>1. Document Overview</h2>
          <p>This document captures the business requirements for implementing hourly settlement reporting in the payments platform.</p>
          <h2>2. Purpose</h2>
          <p>The goal is to improve data freshness and reconciliation speed for merchants.</p>
          <h2>3. Background / Context</h2>
          <p>Merchants currently receive settlement reports once daily at 2 AM, causing them to operate on outdated figures during the day.</p>`
        }
      }
    }
  };

  return mockContents[pageId] || {
    id: pageId,
    title: "Sample Page",
    body: { storage: { value: "<p>Sample content for page " + pageId + "</p>" } }
  };
};