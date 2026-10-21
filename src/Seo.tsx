import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE = "https://apleema-ai-connector.vercel.app";

type SeoPage = { title: string; description: string };

const pages: Record<string, SeoPage> = {
  "/": {
    title: "Apleema AI Connector | GitHub Repository & Project Workspace",
    description: "Apleema AI Connector brings GitHub repositories, project workflows, and domain management into one connected workspace.",
  },
  "/docs": {
    title: "Documentation & Setup Guide | Apleema AI Connector",
    description: "Learn how to connect GitHub, manage repositories and projects, configure domains, and use Apleema AI Connector.",
  },
  "/terms": {
    title: "Terms of Service | Apleema AI Connector",
    description: "Read the terms and conditions that apply when using Apleema AI Connector and its connected services.",
  },
  "/privacy": {
    title: "Privacy Policy | Apleema AI Connector",
    description: "Learn how Apleema AI Connector handles account information, connected-service data, and privacy-related requests.",
  },
  "/support": {
    title: "Support & Troubleshooting | Apleema AI Connector",
    description: "Get help with Apleema AI Connector, GitHub connections, repository access, projects, and domain configuration.",
  },
  "/connect": {
    title: "Connect Accounts | Apleema AI Connector",
    description: "Connect your supported accounts to Apleema AI Connector.",
  },
  "/repos": {
    title: "Repositories | Apleema AI Connector",
    description: "View and manage connected GitHub repositories in Apleema AI Connector.",
  },
  "/projects": {
    title: "Projects | Apleema AI Connector",
    description: "Manage your connected projects in Apleema AI Connector.",
  },
  "/domains": {
    title: "Domain Management | Apleema AI Connector",
    description: "Manage project domains and review domain configuration in Apleema AI Connector.",
  },
  "/settings": {
    title: "Account Settings | Apleema AI Connector",
    description: "Manage account and connected-service settings in Apleema AI Connector.",
  },
};

const privatePaths = [
  "/connect", "/repos", "/projects", "/domains", "/settings",
  "/login", "/dashboard", "/import",
];

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${key}"]`,
  );
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function setCanonical(url: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = url;
}

function setStructuredData(path: string) {
  const id = "apleema-website-schema";
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (path !== "/") {
    script?.remove();
    return;
  }
  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Apleema AI Connector",
    url: `${SITE}/`,
    description: pages["/"].description,
  });
}

export default function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const path = pathname.replace(/\/+$/, "") || "/";
    const page = pages[path] ?? {
      title: "Apleema AI Connector",
      description: "Connect GitHub repositories, projects, and domains with Apleema AI Connector.",
    };
    const isPrivate = privatePaths.some(
      (privatePath) => path === privatePath || path.startsWith(`${privatePath}/`),
    );
    const robots = isPrivate
      ? "noindex, nofollow"
      : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

    document.title = page.title;
    setMeta("name", "description", page.description);
    setMeta("name", "robots", robots);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", "Apleema AI Connector");
    setMeta("property", "og:title", page.title);
    setMeta("property", "og:description", page.description);
    setMeta("property", "og:url", `${SITE}${path === "/" ? "/" : path}`);
    setMeta("name", "twitter:card", "summary");
    setMeta("name", "twitter:title", page.title);
    setMeta("name", "twitter:description", page.description);
    setCanonical(`${SITE}${path === "/" ? "/" : path}`);
    setStructuredData(path);
  }, [pathname]);

  return null;
}