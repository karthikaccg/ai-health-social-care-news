import type { Article } from "@/lib/news";
import { getCategory } from "@/lib/news";
import ArticleImage from "./ArticleImage";
import TimeAgo from "./TimeAgo";

export default function ArticleCard({ article }: { article: Article }) {
  const cat = getCategory(article.category);
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-xl overflow-hidden bg-card border border-line hover:border-accent/40 shadow-sm hover:shadow-md transition-all"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <ArticleImage
          src={article.image}
          alt={article.title}
          gradient={cat?.gradient ?? "from-slate-700 to-slate-900"}
          label={cat?.short ?? "News"}
          source={article.source}
          className="absolute inset-0 w-full h-full transition-transform duration-300 group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider mb-2">
          <span className="text-accent">{article.source}</span>
          <span className="text-muted">
            <TimeAgo date={article.date} />
          </span>
        </div>
        <h3 className="font-bold leading-snug group-hover:text-accent transition-colors line-clamp-3">
          {article.title}
        </h3>
        {article.description && (
          <p className="mt-2 text-sm text-muted line-clamp-2">{article.description}</p>
        )}
      </div>
    </a>
  );
}
