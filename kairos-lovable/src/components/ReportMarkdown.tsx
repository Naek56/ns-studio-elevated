import ReactMarkdown from "react-markdown";

export default function ReportMarkdown({ content }: { content: string }) {
  return (
    <div className="kairos-prose font-mono text-sm">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
