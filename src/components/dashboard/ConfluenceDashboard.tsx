import { Search, ChevronRight, User, FileText, Users, Calendar, Tag, ExternalLink, Plus, Eye, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { fetchConfluenceContent, getPageContent, type ConfluenceContent } from "@/services/confluenceApi";
import { parseConfluenceContent, formatConfluenceContentAsStructured } from "@/utils/confluenceParser";
import { useToast } from "@/hooks/use-toast";


export const ConfluenceDashboard = () => {
  const [selectedPage, setSelectedPage] = useState<ConfluenceContent | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [confluencePages, setConfluencePages] = useState<ConfluenceContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageContent, setPageContent] = useState<any>(null);
  const { toast } = useToast();

  // Load Confluence data on component mount
  useEffect(() => {
    loadConfluenceData();
  }, []);

  // Load page content when a page is selected
  useEffect(() => {
    if (selectedPage) {
      loadPageContent(selectedPage.id);
    }
  }, [selectedPage]);

  const loadConfluenceData = async () => {
    setLoading(true);
    try {
      const data = await fetchConfluenceContent();
      setConfluencePages(data.results);
      if (data.results.length > 0) {
        setSelectedPage(data.results[0]);
      }
      toast({
        title: "Success",
        description: `Loaded ${data.results.length} pages from Confluence`,
      });
    } catch (error) {
      console.error('Error loading Confluence data:', error);
      toast({
        title: "Error",
        description: "Failed to load Confluence data. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPageContent = async (pageId: string) => {
    try {
      const content = await getPageContent(pageId);
      setPageContent(content);
    } catch (error) {
      console.error('Error loading page content:', error);
      toast({
        title: "Error",
        description: "Failed to load page content",
        variant: "destructive",
      });
    }
  };

  const filteredPages = confluencePages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.version.by.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "current": "bg-green-100 text-green-700",
      "draft": "bg-yellow-100 text-yellow-700", 
      "archived": "bg-gray-100 text-gray-700"
    };
    
    return statusConfig[status] || "bg-blue-100 text-blue-700";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-full bg-white">
      <div className="p-2 sm:p-4 md:p-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 h-auto xl:h-full">
          {/* Left Sidebar - Search and Pages List */}
          <div className="xl:col-span-3 order-1 xl:order-1">
            <div className="h-auto xl:h-[650px] flex flex-col border border-[#ccc] p-[20px] rounded-lg">
              {/* Search Bar and Refresh Button */}
              <div className="mb-4 sm:mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search pages"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-[45px] pl-10 pr-12 border border-[#DEDCDC] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={loadConfluenceData}
                    disabled={loading}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>

              {/* Confluence Pages Section */}
              <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#E6E6E6] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full">
                <div className="pr-2 sm:pr-[20px]">
                  <h2 className="text-base sm:text-lg font-semibold mb-4">
                    Confluence Pages ({confluencePages.length})
                  </h2>
                  {loading ? (
                    <div className="text-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Loading pages...</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredPages.map((page) => (
                        <div 
                          key={page.id} 
                          className={`p-3 sm:p-4 border-[#DEDCDC] border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedPage?.id === page.id ? 'border-primary bg-primary/5' : ''
                          }`}
                          onClick={() => setSelectedPage(page)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-sm text-foreground truncate pr-2 flex-1">
                              {page.title}
                            </h3>
                            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <Avatar className="h-4 w-4 flex-shrink-0">
                              <AvatarFallback className="text-xs">
                                {page.version.by.displayName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="truncate">{page.version.by.displayName}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs truncate" style={{color: '#747474'}}>
                              {formatDate(page.version.when)}
                            </span>
                            <Badge className={`${getStatusBadge(page.status)} text-xs px-2 py-1 flex-shrink-0 border`} style={{fontWeight: 'normal', borderColor: '#DEDCDC'}}>
                              {page.status}
                            </Badge>
                          </div>
                          
                          {/* Space info */}
                          <div className="mt-2 text-xs text-muted-foreground">
                            Space: {page.space.name} ({page.space.key})
                          </div>
                        </div>
                      ))}
                      {filteredPages.length === 0 && !loading && (
                        <div className="text-center text-muted-foreground text-sm py-8">
                          {confluencePages.length === 0 ? 'No pages loaded. Click refresh to load data.' : 'No pages found matching your search.'}
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
                <h1 className="text-base font-semibold truncate flex-1">
                  {selectedPage ? selectedPage.title : 'Select a page'}
                </h1>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button 
                    variant="outline" 
                    className="bg-white border border-[#8C8C8C] text-sm flex items-center gap-2 hover:bg-[#D31222] hover:text-white hover:border-[#D31222] transition-colors"
                    style={{
                      color: '#151515',
                      fontSize: '14px',
                      fontWeight: 'normal'
                    }}
                    onClick={() => {
                      if (selectedPage) {
                        window.open(`https://siriusai-team-test.atlassian.net/wiki${selectedPage._links.webui}`, '_blank', 'noopener,noreferrer');
                      }
                    }}
                    disabled={!selectedPage}
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
                {selectedPage ? (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="text-sm">
                          {selectedPage.version.by.displayName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{selectedPage.version.by.displayName}</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>{formatDate(selectedPage.version.when)}</span>
                      </div>
                      <Badge className={`${getStatusBadge(selectedPage.status)} self-start`}>
                        {selectedPage.status}
                      </Badge>
                      <span className="text-xs">Version {selectedPage.version.number}</span>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium mb-2">Page Information</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div><strong>ID:</strong> {selectedPage.id}</div>
                          <div><strong>Type:</strong> {selectedPage.type}</div>
                          <div><strong>Space:</strong> {selectedPage.space.name} ({selectedPage.space.key})</div>
                          <div><strong>Status:</strong> {selectedPage.status}</div>
                        </div>
                      </div>
                      
                      {selectedPage.ancestors && selectedPage.ancestors.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Page Hierarchy</h4>
                          <div className="text-xs text-muted-foreground">
                            {selectedPage.ancestors.map((ancestor, index) => (
                              <span key={ancestor.id}>
                                {ancestor.title}
                                {index < selectedPage.ancestors!.length - 1 && ' > '}
                              </span>
                            ))}
                            {selectedPage.ancestors.length > 0 && ' > '}
                            <span className="font-medium">{selectedPage.title}</span>
                          </div>
                        </div>
                      )}

                      {pageContent && pageContent.body && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Content Preview</h4>
                          <div className="bg-gray-50 p-4 rounded-lg max-h-80 overflow-y-auto">
                            {(() => {
                              const structuredContent = formatConfluenceContentAsStructured(
                                pageContent.body.storage?.value || ''
                              );
                              
                              return structuredContent.map((item: any) => {
                                if (item.type === 'heading') {
                                  return (
                                    <div key={item.key} className="mb-3">
                                      <h3 className="text-base font-semibold text-foreground border-b pb-1">
                                        {item.content}
                                      </h3>
                                    </div>
                                  );
                                } else if (item.type === 'paragraph') {
                                  return (
                                    <div key={item.key} className="mb-3">
                                      <p className="text-sm text-muted-foreground leading-relaxed">
                                        {item.content}
                                      </p>
                                    </div>
                                  );
                                } else {
                                  return (
                                    <div key={item.key} className="text-sm text-muted-foreground">
                                      {item.content}
                                    </div>
                                  );
                                }
                              });
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Select a page from the left to view its details
                    </p>
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