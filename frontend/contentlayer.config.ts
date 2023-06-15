import { defineDocumentType, makeSource } from "contentlayer/source-files";

export const Page = defineDocumentType(() => ({
  name: "Page",
  filePathPattern: `page/*.md`,
  fields: {
    title: { type: "string", required: true },
  },
}));

export const Blog = defineDocumentType(() => ({
  name: "Blog",
  filePathPattern: `blog/*.md`,
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
  },
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Page, Blog],
});
