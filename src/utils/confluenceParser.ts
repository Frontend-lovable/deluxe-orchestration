// Utility to parse and clean Confluence HTML content
export const parseConfluenceContent = (htmlContent: string): string => {
  if (!htmlContent) return "No content available";

  // Remove Confluence-specific structured macros and ADF extensions
  let cleanContent = htmlContent
    // Remove structured macro blocks
    .replace(/<ac:structured-macro[^>]*>[\s\S]*?<\/ac:structured-macro>/g, '')
    // Remove ADF extensions
    .replace(/<ac:adf-extension>[\s\S]*?<\/ac:adf-extension>/g, '')
    // Remove ADF nodes
    .replace(/<ac:adf-node[^>]*>[\s\S]*?<\/ac:adf-node>/g, '')
    // Remove parameter tags
    .replace(/<ac:parameter[^>]*>[\s\S]*?<\/ac:parameter>/g, '')
    // Remove rich text body wrapper but keep content
    .replace(/<ac:rich-text-body>([\s\S]*?)<\/ac:rich-text-body>/g, '$1')
    // Remove any remaining ac: tags
    .replace(/<\/?ac:[^>]*>/g, '')
    // Clean up extra whitespace
    .replace(/\s+/g, ' ')
    .trim();

  return cleanContent || "Content not available";
};

export const formatConfluenceContentAsStructured = (htmlContent: string) => {
  if (!htmlContent) return [];

  const elements: any[] = [];
  
  // Parse different sections
  const sections = htmlContent.split(/<h[1-6][^>]*>/);
  
  sections.forEach((section, index) => {
    if (!section.trim()) return;
    
    // Extract heading if present
    const headingMatch = section.match(/^([^<]*)<\/h[1-6]>/);
    const content = section.replace(/^[^<]*<\/h[1-6]>/, '').trim();
    
    if (headingMatch) {
      const heading = headingMatch[1].trim();
      if (heading) {
        elements.push({
          type: 'heading',
          content: heading,
          key: `heading-${index}`
        });
      }
    }
    
    if (content) {
      // Clean and format the content
      const cleanContent = parseConfluenceContent(content);
      
      // Split content into paragraphs
      const paragraphs = cleanContent
        .split(/<\/p>|<p[^>]*>/)
        .filter(p => p.trim() && !p.match(/^<\/?[^>]+>$/));
      
      paragraphs.forEach((paragraph, pIndex) => {
        const cleanParagraph = paragraph
          .replace(/<[^>]*>/g, '') // Remove any remaining HTML tags
          .trim();
          
        if (cleanParagraph) {
          elements.push({
            type: 'paragraph',
            content: cleanParagraph,
            key: `content-${index}-${pIndex}`
          });
        }
      });
    }
  });
  
  return elements.length > 0 ? elements : [{
    type: 'fallback',
    content: 'Content contains complex formatting that cannot be displayed properly.',
    key: 'fallback'
  }];
};
