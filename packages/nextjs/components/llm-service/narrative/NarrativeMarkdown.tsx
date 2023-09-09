import { memo } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";

type NarrativeMarkdownProps = {
    children: string;
  };

const NarrativeMarkdown = memo(function _NarrativeMarkdown({
    children = "",
  }: NarrativeMarkdownProps) {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h2 {...props} className="font-medium text-[24px] mt-6 mb-2" />
          ),
          h2: ({ node, ...props }) => (
            <h2 {...props} className="font-bold text-[20px] mt-6 mb-2" />
          ),
          h3: ({ node, ...props }) => (
            <h2 {...props} className="font-semibold text-[18px] mt-4 mb-2" />
          ),
          ul: ({ node, ...props }) => (
            <ul
              {...props}
              className="list-image-[url(/list.svg)] list-outside pl-7"
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              {...props}
              className="list-decimal list-outside marker:bg-ac-1  pl-8 marker:font-code marker:font-bold marker:text-[15px]"
            />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              {...props}
              className="border-l-4 border-bd-1 pl-4 font-code text-[12px] text-ft-2 mb-8 transition-all hover:border-ac-1 hover:text-ft-1"
            />
          ),
          li: ({ node, ...props }) => <li {...props} className="" />,
          p: ({ node, ...props }) => <p {...props} className="mt-2 mb-4" />,
          a: ({ node, ...props }) => (
            <a
              {...props}
              className="text-ac-1 font-bold relative z-[0]"
              rel="noreferrer"
              target={props?.href?.startsWith("#") ? "_self" : "_blank"}
            />
          ),
          sup: ({ node, children, ...props }) => (
            <sup {...props} className="ml-1 text-[0.8em]">
              [{children}]
            </sup>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    );
  });
  export default NarrativeMarkdown;