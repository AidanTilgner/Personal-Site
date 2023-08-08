import React, { useEffect } from "react";
import styles from "./Content.module.scss";
import type { Block } from "../../../../../types/blocks";

interface ContentProps {
  blocks: Block[];
}

interface LoadedBlock {
  id: string;
  name: string;
  content: JSX.Element;
}

console.log("SERVER URL: ", import.meta.env.PUBLIC_BACKEND_URL);

const URLParser = (url: string) => {
  const fields: [[string, () => string]] = [
    ["[SERVER_URL]", () => import.meta.env.PUBLIC_BACKEND_URL || ""],
  ];
  let copy = url;
  fields.forEach((f) => {
    copy = copy.replace(f[0], f[1]());
  });
  return copy;
};

const contentTypeToHTMLMapper = {
  raw: (data: string) => <div>{data}</div>,
  url: async (data: string) => {
    const parsedUrl = URLParser(data);
    const response = await fetch(parsedUrl);
    const text = await response.text();
    return <div>{text}</div>;
  },
};

const getLoadedBlocks = async (blocks: Block[]): Promise<LoadedBlock[]> => {
  const loadedBlocks: LoadedBlock[] = [];

  for (const block of blocks) {
    const content = await contentTypeToHTMLMapper[block.content.type](
      block.content.data
    );

    loadedBlocks.push({
      id: block.id,
      name: block.name,
      content: (
        <div
          key={block.id}
          className={`${styles.block} block`}
          id={`block-${block.id}`}
          dangerouslySetInnerHTML={{
            __html: content.props.children,
          }}
        />
      ),
    });
  }

  return loadedBlocks;
};

function Content({ blocks }: ContentProps) {
  const [loadedBlocks, setLoadedBlocks] = React.useState<LoadedBlock[]>([]);

  useEffect(() => {
    (async () => {
      const loadedBlocks = await getLoadedBlocks(blocks);
      setLoadedBlocks(loadedBlocks);
    })();
  }, [blocks]);

  return (
    <div className={styles.content}>{loadedBlocks.map((b) => b.content)}</div>
  );
}

export default Content;
