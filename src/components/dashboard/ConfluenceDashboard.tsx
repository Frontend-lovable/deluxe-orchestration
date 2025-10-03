import { Search, ChevronRight, User, FileText, Users, Calendar, Tag, ExternalLink, Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { fetchConfluencePages, fetchConfluencePageDetails, ConfluencePage, ConfluencePageDetails } from "@/services/confluenceApi";
import { useToast } from "@/hooks/use-toast";

export const ConfluenceDashboard = () => {
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pages, setPages] = useState<ConfluencePage[]>([]);
  const [pageDetails, setPageDetails] = useState<ConfluencePageDetails | null>(null);
  const [isLoadingPages, setIsLoadingPages] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPages();
  }, []);

  useEffect(() => {
    if (selectedPageId) {
      loadPageDetails(selectedPageId);
    }
  }, [selectedPageId]);

  const loadPages = async () => {
    try {
      setIsLoadingPages(true);
      const fetchedPages = await fetchConfluencePages();
      setPages(fetchedPages);
      if (fetchedPages.length > 0 && !selectedPageId) {
        setSelectedPageId(fetchedPages[0].id);
      }
    } catch (error) {
      toast({
        title: "Error loading pages",
        description: "Failed to fetch Confluence pages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPages(false);
    }
  };

  const loadPageDetails = async (pageId: string) => {
    try {
      setIsLoadingDetails(true);
      const details = await fetchConfluencePageDetails(pageId);
      setPageDetails(details);
    } catch (error) {
      toast({
        title: "Error loading page details",
        description: "Failed to fetch page details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "Approved": "bg-green-100 text-green-700",
      "Under Review": "bg-yellow-100 text-yellow-700", 
      "Published": "bg-purple-100 text-purple-700",
      "In Progress": "bg-blue-100 text-blue-700",
      "Draft": "bg-gray-100 text-gray-700"
    };
    
    return statusConfig[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="h-full bg-white">
      <div className="p-2 sm:p-4 md:p-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 h-auto xl:h-full">
          {/* Left Sidebar - Search and Pages List */}
          <div className="xl:col-span-3 order-1 xl:order-1">
            <div className="h-auto xl:h-[650px] flex flex-col border border-[#ccc] p-[20px] rounded-lg">
              {/* Search Bar */}
              <div className="mb-4 sm:mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search pages"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-[45px] pl-10 pr-4 border border-[#DEDCDC] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  />
                </div>
              </div>

              {/* Payment Gateway Section */}
              <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#E6E6E6] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full">
                <div className="pr-2 sm:pr-[20px]">
                  <h2 className="text-base sm:text-lg font-semibold mb-4">Payment Gateway</h2>
                  {isLoadingPages ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      Loading pages...
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredPages.map((page) => (
                        <div 
                          key={page.id} 
                          className={`p-3 sm:p-4 border-[#DEDCDC] border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedPageId === page.id ? 'border-primary bg-primary/5' : ''
                          }`}
                          onClick={() => setSelectedPageId(page.id)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-sm text-foreground truncate pr-2 flex-1">
                              {page.title}
                            </h3>
                            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs truncate" style={{color: '#747474'}}>{page.status}</span>
                            <Badge className={`${getStatusBadge(page.status)} text-xs px-2 py-1 flex-shrink-0 border`} style={{fontWeight: 'normal', borderColor: '#DEDCDC'}}>
                              {page.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      {filteredPages.length === 0 && (
                        <div className="text-center text-muted-foreground text-sm py-8">
                          No pages found matching your search.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="xl:col-span-9 order-2 xl:order-2">
            <div className="border border-[#CCCCCC] rounded-lg h-auto">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 border-b border-[#CCCCCC] p-4 sm:p-[24px] gap-4">
                <h1 className="text-base font-semibold truncate flex-1">{pageDetails?.title || 'Select a page'}</h1>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button 
                    variant="outline" 
                    className="bg-white border border-[#8C8C8C] text-sm flex items-center gap-2 hover:bg-[#D31222] hover:text-white hover:border-[#D31222] transition-colors"
                    style={{
                      color: '#151515',
                      fontSize: '14px',
                      fontWeight: 'normal'
                    }}
                    onClick={() => pageDetails && window.open(`https://siriusai-team-test.atlassian.net${pageDetails._links.webui}`, '_blank')}
                    disabled={!pageDetails}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="hidden sm:inline">View in Confluence</span>
                    <span className="sm:hidden">View</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="bg-white border border-[#8C8C8C] text-sm flex items-center gap-2 hover:bg-[#D31222] hover:text-white hover:border-[#D31222] transition-colors"
                    style={{
                      color: '#151515',
                      fontSize: '14px',
                      fontWeight: 'normal'
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Create Epic & Story</span>
                    <span className="sm:hidden">Create</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="bg-white border border-[#8C8C8C] text-sm flex items-center gap-2 hover:bg-[#D31222] hover:text-white hover:border-[#D31222] transition-colors"
                    style={{
                      color: '#151515',
                      fontSize: '14px',
                      fontWeight: 'normal'
                    }}
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Preview Jira Integration</span>
                    <span className="sm:hidden">Preview</span>
                  </Button>
                </div>
              </div>

              {/* Content Details */}
              <div className="rounded-lg p-4 sm:p-6 bg-white">
                {isLoadingDetails ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading page details...
                  </div>
                ) : pageDetails ? (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="text-sm">
                          {pageDetails.version.by.displayName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{pageDetails.version.by.displayName}</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>{new Date(pageDetails.version.when).toLocaleString()}</span>
                      </div>
                      <Badge className={`${getStatusBadge(pageDetails.status)} self-start`}>
                        {pageDetails.status}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div 
                        className="text-sm leading-relaxed prose prose-sm max-w-none [&_*]:text-[#747474] [&_h1]:text-[#3B3B3B] [&_h2]:text-[#3B3B3B] [&_h3]:text-[#3B3B3B] [&_h4]:text-[#3B3B3B] [&_h5]:text-[#3B3B3B] [&_h6]:text-[#3B3B3B] [&_strong]:text-[#3B3B3B]"
                        dangerouslySetInnerHTML={{ __html: pageDetails.body.storage.value }}
                      />
                      
                      {pageDetails.ancestors && pageDetails.ancestors.length > 0 && (
                        <div className="mt-6">
                          <h4 className="text-sm font-medium mb-3">Breadcrumb</h4>
                          <div className="flex flex-wrap gap-2">
                            {pageDetails.ancestors.map((ancestor) => (
                              <Badge key={ancestor.id} variant="secondary" className="text-xs">
                                {ancestor.title}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Select a page to view details
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};