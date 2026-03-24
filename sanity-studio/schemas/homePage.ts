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
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    localizedText("siteTitle", "Site Title"),
    localizedString("siteDescription", "Site Meta Description"),
    defineField({
      name: "phoneNumber",
      title: "Phone Number",
      type: "string",
      initialValue: "+998 33 862-25-89",
    }),
    localizedText("ctaText", "CTA Button Text"),

    defineField({
      name: "hero",
      title: "Hero Section",
      type: "object",
      fields: [
        defineField({
          name: "teacherName",
          title: "Teacher Name",
          type: "string",
          initialValue: "Дария Свиридова",
        }),
        localizedText("taglineExtreme", "Tagline — Extreme Vocals Side"),
        localizedText("taglinePop", "Tagline — Pop Vocals Side"),
        localizedString("descExtreme", "Description — Extreme Vocals"),
        localizedString("descPop", "Description — Pop Vocals"),
      ],
    }),

    defineField({
      name: "about",
      title: "About / Teacher Section",
      type: "object",
      fields: [
        defineField({ name: "teacherName", title: "Teacher Full Name", type: "string" }),
        localizedString("bio1", "Bio Paragraph 1"),
        localizedString("bio2", "Bio Paragraph 2"),
        localizedString("bio3", "Bio Paragraph 3"),
        defineField({ name: "yearsOnStage", title: "Years on Stage", type: "string", initialValue: "10+" }),
        defineField({ name: "yearsTeaching", title: "Years Teaching", type: "string", initialValue: "7+" }),
        defineField({ name: "studentsCount", title: "Students Count", type: "string", initialValue: "200+" }),
        defineField({
          name: "photo",
          title: "Teacher Photo",
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),

    defineField({
      name: "booking",
      title: "Booking Section",
      type: "object",
      fields: [
        localizedText("title", "Section Title"),
        localizedString("intro1", "Intro Paragraph 1"),
        localizedString("intro2", "Intro Paragraph 2"),
      ],
    }),
  ],

  preview: {
    select: { title: "siteTitle.ru" },
  },
});
