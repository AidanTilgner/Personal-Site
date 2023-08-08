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

const contentTypeToHTMLMapper = {
  raw: (data: string) => <div>{data}</div>,
  url: async (data: string) => {
    const response = await fetch(data);
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
