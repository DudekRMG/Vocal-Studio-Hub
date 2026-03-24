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
  name: "extremePage",
  title: "Extreme Vocals Page",
  type: "document",
  fields: [
    localizedText("heroTitle", "Hero Title"),
    localizedText("heroSubtitle", "Hero Subtitle"),
    localizedString("heroDescription", "Hero Description"),
    localizedString("whatBody1", "What Is — Paragraph 1"),
    localizedString("whatBody2", "What Is — Paragraph 2"),

    defineField({
      name: "techniques",
      title: "Techniques",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", title: "Name", type: "string" },
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
          preview: { select: { title: "name" } },
        },
      ],
    }),

    defineField({
      name: "processSteps",
      title: "Process Steps",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "number", title: "Step Number", type: "string" },
            defineField({
              name: "title",
              title: "Step Title",
              type: "object",
              fields: [
                { name: "ru", title: "Russian (RU)", type: "string" },
                { name: "en", title: "English (EN)", type: "string" },
              ],
            }),
            defineField({
              name: "description",
              title: "Step Description",
              type: "object",
              fields: [
                { name: "ru", title: "Russian (RU)", type: "text", rows: 3 },
                { name: "en", title: "English (EN)", type: "text", rows: 3 },
              ],
            }),
          ],
          preview: { select: { title: "title.ru", subtitle: "number" } },
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
    prepare: () => ({ title: "Extreme Vocals Page" }),
  },
});
