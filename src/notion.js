import { Client } from "@notionhq/client";
import config from "config";

const notion = new Client({
  auth: config.get("NOTION_KEY"),
});

export async function create(short, text) {
  try {
  const response = await notion.pages.create({
    parent: { database_id: config.get("NOTION_DB_ID") },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: short,
            },
          },
        ],
      },
      Date: {
        date: {
          start: new Date().toISOString(),
        },
      },
    },
  });

  await notion.blocks.children.append({
    block_id: response.id,
    children: [
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: {
                content: text,
              },
            },
          ],
        },
      },
    ],
  });

  return response;
} catch (error) {
  console.error("Error creating page in Notion:", error);
  return null;
}
}
