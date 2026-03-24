import { useState, useEffect } from "react";
import { sanityClient } from "./sanityClient";
import type { Lang } from "./i18n";

export interface SanityHeroContent {
  taglineExtreme?: string;
  taglinePop?: string;
  teacherName?: string;
}

export interface SanityAboutContent {
  bio1?: string;
  bio2?: string;
  bio3?: string;
  yearsOnStage?: string;
  yearsTeaching?: string;
  studentsCount?: string;
}

export interface SanityPageContent {
  hero?: SanityHeroContent;
  about?: SanityAboutContent;
  siteTitle?: string;
  siteDescription?: string;
  phoneNumber?: string;
  ctaText?: string;
}

const HOME_QUERY = (lang: Lang) => `*[_type == "homePage"][0]{
  "siteTitle": coalesce(siteTitle.${lang}, siteTitle.ru),
  "siteDescription": coalesce(siteDescription.${lang}, siteDescription.ru),
  "phoneNumber": phoneNumber,
  "ctaText": coalesce(ctaText.${lang}, ctaText.ru),
  "hero": {
    "taglineExtreme": coalesce(hero.taglineExtreme.${lang}, hero.taglineExtreme.ru),
    "taglinePop": coalesce(hero.taglinePop.${lang}, hero.taglinePop.ru),
    "teacherName": hero.teacherName
  },
  "about": {
    "bio1": coalesce(about.bio1.${lang}, about.bio1.ru),
    "bio2": coalesce(about.bio2.${lang}, about.bio2.ru),
    "bio3": coalesce(about.bio3.${lang}, about.bio3.ru),
    "yearsOnStage": about.yearsOnStage,
    "yearsTeaching": about.yearsTeaching,
    "studentsCount": about.studentsCount
  }
}`;

export function useSanityContent(lang: Lang): {
  content: SanityPageContent | null;
  loading: boolean;
} {
  const [content, setContent] = useState<SanityPageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sanityClient
      .fetch<SanityPageContent>(HOME_QUERY(lang))
      .then((data) => {
        if (data) setContent(data);
      })
      .catch(() => {
        // Silently fall back to hardcoded content
      })
      .finally(() => setLoading(false));
  }, [lang]);

  return { content, loading };
}
