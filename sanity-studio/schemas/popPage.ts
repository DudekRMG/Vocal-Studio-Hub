import { defineType, defineField } from "sanity";

const localizedString = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    fields: [
      { name: "ru", title: "Russian (RU)", type: "text", rows: 3 },
      { name: "en", title: "English (EN)", type: "text", rows: 3 },
    ],
  });

const localizedText = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    fields: [
      { name: "ru", title: "Russian (RU)", type: "string" },
      { name: "en", title: "English (EN)", type: "string" },
    ],
  });

export default defineType({
  name: "popPage",
  title: "Pop Vocals Page",
  type: "document",
  fields: [
    localizedText("heroTitle1", "Hero Title Line 1"),
    localizedText("heroTitle2", "Hero Title Line 2 (Red)"),
    localizedText("heroSubtitle", "Hero Subtitle"),
    localizedString("heroDescription", "Hero Description"),
    localizedText("whatTitle", "What Is Section Title"),
    localizedString("whatBody1", "What Is — Paragraph 1"),
    localizedString("whatBody2", "What Is — Paragraph 2"),

    defineField({
      name: "pillars",
      title: "Core Pillars",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "icon", title: "Icon (symbol)", type: "string" },
            defineField({
              name: "title",
              title: "Title",
              type: "object",
              fields: [
                { name: "ru", title: "Russian (RU)", type: "string" },
                { name: "en", title: "English (EN)", type: "string" },
              ],
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "object",
              fields: [
                { name: "ru", title: "Russian (RU)", type: "text", rows: 3 },
                { name: "en", title: "English (EN)", type: "text", rows: 3 },
              ],
            }),
          ],
          preview: { select: { title: "title.ru", subtitle: "icon" } },
        },
      ],
    }),

    defineField({
      name: "forWhom",
      title: "For Whom Cards",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "object",
              fields: [
                { name: "ru", title: "Russian (RU)", type: "string" },
                { name: "en", title: "English (EN)", type: "string" },
              ],
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "object",
              fields: [
                { name: "ru", title: "Russian (RU)", type: "text", rows: 3 },
                { name: "en", title: "English (EN)", type: "text", rows: 3 },
              ],
            }),
          ],
          preview: { select: { title: "title.ru" } },
        },
      ],
    }),

    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "object",
              fields: [
                { name: "ru", title: "Russian (RU)", type: "string" },
                { name: "en", title: "English (EN)", type: "string" },
              ],
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "object",
              fields: [
                { name: "ru", title: "Russian (RU)", type: "text", rows: 3 },
                { name: "en", title: "English (EN)", type: "text", rows: 3 },
              ],
            }),
          ],
          preview: { select: { title: "question.ru" } },
        },
      ],
    }),
  ],

  preview: {
    prepare: () => ({ title: "Pop Vocals Page" }),
  },
});
