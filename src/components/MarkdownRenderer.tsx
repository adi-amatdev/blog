import ReactMarkdown from 'react-markdown';
import remarkDirective from 'remark-directive';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { visit } from 'unist-util-visit';

function remarkDirectiveCallout() {
  return (tree: any) => {
    visit(tree, (node: any) => {
      if (node.type === 'containerDirective' || node.type === 'leafDirective') {
        if (node.name === 'highlight' || node.name === 'disclaimer') {
          const data = node.data || (node.data = {});
          data.hProperties = {
            className: ['callout', `callout-${node.name}`],
          };
        }
      }
    });
  };
}

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkDirective, remarkDirectiveCallout]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          a: ({ href, children, ...props }) => {
            const isExternal = href?.startsWith('http');
            return (
              <a href={href} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noopener noreferrer' : undefined} {...props}>
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
