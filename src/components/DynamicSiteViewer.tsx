import { useEffect, useState } from "react";
import { DynamicSite } from "../types";
import { ArrowLeft, ExternalLink, Globe, ShieldAlert } from "lucide-react";

interface DynamicSiteViewerProps {
  slug: string;
  onBackToPortal: () => void;
}

export default function DynamicSiteViewer({ slug, onBackToPortal }: DynamicSiteViewerProps) {
  const [site, setSite] = useState<DynamicSite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSite() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/site-by-slug/${encodeURIComponent(slug)}`);
        if (!res.ok) {
          throw new Error(`Dynamic site "/${slug}" was not found or has been removed.`);
        }
        const data = await res.json();
        setSite(data);
      } catch (err: any) {
        setError(err.message || "Failed to load dynamic site.");
      } finally {
        setLoading(false);
      }
    }
    loadSite();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#030712] text-slate-100 p-4">
        <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-mono text-purple-300">Resolving dynamic route /{slug}...</p>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#030712] text-slate-100 p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Dynamic Route Not Found</h2>
        <p className="text-slate-400 text-sm max-w-md mb-6">{error}</p>
        <button
          onClick={onBackToPortal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to SKEDZ-S.PORTAL
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100">
      {/* Top Dynamic Bar */}
      <div className="h-14 bg-[#090d1a]/95 border-b border-purple-500/20 px-4 sm:px-6 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToPortal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Portal
          </button>
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-xs text-purple-300 font-semibold">
              /{site.slug}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline truncate max-w-[200px]">
              — {site.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`/raw-site/${site.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/30 text-purple-200 text-xs font-medium transition"
          >
            <span>Raw View</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Content Render */}
      <div className="flex-1 w-full relative">
        {site.customHtml ? (
          <iframe
            title={site.title}
            srcDoc={
              site.customCss
                ? `${site.customHtml}<style>${site.customCss}</style>`
                : site.customHtml
            }
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
            className="w-full h-[calc(100vh-56px)] border-0 bg-white"
          />
        ) : site.externalUrl ? (
          <iframe
            title={site.title}
            src={site.externalUrl}
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
            className="w-full h-[calc(100vh-56px)] border-0 bg-white"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <h1 className="text-3xl font-bold mb-3">{site.title}</h1>
            <p className="text-slate-400 max-w-lg">{site.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
