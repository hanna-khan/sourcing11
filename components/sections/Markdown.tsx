import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { slugify } from "@/lib/utils/format";

/**
 * Minimal Markdown → React renderer for CMS content: headings (##, ###),
 * paragraphs, ordered/unordered lists, blockquotes, **bold**, *italic* and
 * [links](/path). Raw HTML is never interpreted, so admin content cannot inject markup.
 */
export function Markdown({ source, className }: { source: string; className?: string }) {
  return <div className={cn("prose-editorial", className)}>{renderBlocks(source)}</div>;
}

export function extractHeadings(source: string) {
  return source
    .split("\n")
    .filter((l) => /^##\s+/.test(l))
    .map((l) => {
      const text = l.replace(/^##\s+/, "").trim();
      return { id: slugify(text), text };
    });
}

function renderBlocks(src: string): ReactNode[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const out: ReactNode[] = [];
  let i = 0;
  let key = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const h = /^(#{2,3})\s+(.*)$/.exec(line);
    if (h) {
      const text = h[2].trim();
      out.push(h[1].length === 2 ? <h2 key={key++} id={slugify(text)}>{inline(text)}</h2> : <h3 key={key++}>{inline(text)}</h3>);
      i++;
      continue;
    }
    if (/^>\s?/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ""));
      out.push(<blockquote key={key++}>{inline(buf.join(" "))}</blockquote>);
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) items.push(lines[i++].replace(/^[-*]\s+/, ""));
      out.push(
        <ul key={key++}>
          {items.map((t, j) => (
            <li key={j}>{inline(t)}</li>
          ))}
        </ul>,
      );
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) items.push(lines[i++].replace(/^\d+\.\s+/, ""));
      out.push(
        <ol key={key++}>
          {items.map((t, j) => (
            <li key={j}>{inline(t)}</li>
          ))}
        </ol>,
      );
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{2,3}\s|>|[-*]\s|\d+\.\s)/.test(lines[i])) para.push(lines[i++]);
    out.push(<p key={key++}>{inline(para.join(" "))}</p>);
  }
  return out;
}

const TOKEN = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;

function inline(text: string): ReactNode {
  const parts = text.split(TOKEN).filter(Boolean);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith("*") && p.endsWith("*") && p.length > 2) return <em key={i}>{p.slice(1, -1)}</em>;
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(p);
    if (link) {
      const [, label, href] = link;
      if (href.startsWith("/")) return <Link key={i} href={href}>{label}</Link>;
      if (/^https?:\/\//.test(href) || href.startsWith("mailto:"))
        return (
          <a key={i} href={href} rel="noopener noreferrer" target={href.startsWith("http") ? "_blank" : undefined}>
            {label}
          </a>
        );
      return <Fragment key={i}>{label}</Fragment>;
    }
    return <Fragment key={i}>{p}</Fragment>;
  });
}
