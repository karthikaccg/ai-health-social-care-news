import type { Article } from "@/lib/news";
import { getCategory } from "@/lib/news";
import ArticleImage from "./ArticleImage";
import TimeAgo from "./TimeAgo";

export default function HeroCard({ article }: { article: Article }) {
  const cat = getCategory(article.category);
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block rounded-2xl overflow-hidden bg-card border border-line shadow-sm min-h-[320px] md:min-h-[420px]"
    >
      <ArticleImage
        src={article.image}
        alt={article.title}
        gradient={cat?.gradient ?? "from-slate-700 to-slate-900"}
        label={cat?.short ?? "News"}
        source={article.source}
        className="absolute inset-0 w-full h-full transition-transform duration-300 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 p-5 md:p-7">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider">
          <span className="bg-accent text-[#0f1114] px-2 py-0.5 rounded">{cat?.short ?? "News"}</span>
          <span className="text-white/90">{article.source}</span>
          <span className="text-white/60">
            · <TimeAgo date={article.date} />
          </span>
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold leading-tight text-white group-hover:text-accent transition-colors">
          {article.title}
        </h1>
        {article.description && (
          <p className="hidden md:block mt-3 text-white/70 max-w-2xl line-clamp-2">{article.description}</p>
        )}
      </div>
    </a>
  );
}
