import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD.");

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string().min(1),
    author: z.string().min(1),
    description: z.string().min(1),
    postdate: date,
    updatedate: date.optional(),
    tags: z.array(z.string().min(1)),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const projectLink = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const projectImage = z.object({
  src: z.string().min(1),
  alt: z.string(),
  caption: z.string().min(1).optional(),
});

const projectVideo = z.object({
  src: z.url(),
  title: z.string().min(1),
  caption: z.string().min(1).optional(),
});

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    status: z.enum([
      "active",
      "maintained",
      "completed",
      "paused",
      "archived",
      "concept",
    ]),
    started: date.optional(),
    completed: date.optional(),
    role: z.string().min(1).optional(),
    tags: z.array(z.string().min(1)).default([]),
    technologies: z.array(z.string().min(1)).default([]),
    highlights: z.array(z.string().min(1)).default([]),
    links: z.array(projectLink).default([]),
    image: projectImage.optional(),
    video: projectVideo.optional(),
    gallery: z.array(projectImage).default([]),
    featured: z.boolean().default(false),
    order: z.number().int().default(0),
    draft: z.boolean().default(false),
    page: z.enum(["default", "custom"]).default("default"),
    aliases: z.array(z.string().min(1)).default([]),
    block: z.string().min(1).optional(),
    index: z.boolean().default(true),
  }),
});

export const collections = { blog, projects };
