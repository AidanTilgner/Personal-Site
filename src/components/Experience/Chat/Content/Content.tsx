import { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import styles from "./Content.module.scss";
import type { Block } from "../../../../../types/blocks";

interface ContentProps {
  blocks: Block[];
  isLoading: boolean;
}

interface LoadedBlock extends Pick<Block, "id" | "name" | "kind"> {
  html: string;
}

type BlockCleanup = () => void;

const blockLabel = (block: Pick<Block, "name" | "kind">) => {
  if (block.kind === "project-preview") return "Project preview";
  if (block.kind === "blog-preview") return "Writing preview";
  return block.name.replaceAll("-", " ");
};

const sanitizeBlockHTML = (html: string) =>
  DOMPurify.sanitize(html, {
    FORBID_TAGS: ["script", "iframe", "object", "embed", "form"],
  });

const activateDonut = (root: HTMLElement): BlockCleanup | undefined => {
  const container = root.querySelector<HTMLElement>("#donut-goes-here");
  if (!container) return;
  const output = document.createElement("pre");
  container.replaceChildren(output);
  let rotationX = 0;
  let rotationY = 0;
  const frameSize = 1_760;

  const render = () => {
    rotationX += 0.07;
    rotationY += 0.03;
    const characters: string[] = Array.from(
      { length: frameSize },
      (_, index) => (index % 80 === 79 ? "\n" : " "),
    );
    const depth = new Array<number>(frameSize).fill(0);
    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);
    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);

    for (let outer = 0; outer < 6.28; outer += 0.07) {
      const cosOuter = Math.cos(outer);
      const sinOuter = Math.sin(outer);
      for (let inner = 0; inner < 6.28; inner += 0.02) {
        const sinInner = Math.sin(inner);
        const cosInner = Math.cos(inner);
        const circle = cosOuter + 2;
        const inverseDepth =
          1 / (sinInner * circle * sinX + sinOuter * cosX + 5);
        const projection = sinInner * circle * cosX - sinOuter * sinX;
        const column =
          0 |
          (40 +
            30 * inverseDepth * (cosInner * circle * cosY - projection * sinY));
        const row =
          0 |
          (12 +
            15 * inverseDepth * (cosInner * circle * sinY + projection * cosY));
        const luminance =
          0 |
          (8 *
            ((sinOuter * sinX - sinInner * cosOuter * cosX) * cosY -
              sinInner * cosOuter * sinX -
              sinOuter * cosX -
              cosInner * cosOuter * sinY));
        const position = column + 80 * row;
        if (
          row < 22 &&
          row >= 0 &&
          column >= 0 &&
          column < 79 &&
          inverseDepth > depth[position]
        ) {
          depth[position] = inverseDepth;
          characters[position] = ".,-~:;=!*#$@"[Math.max(luminance, 0)];
        }
      }
    }
    output.textContent = characters.join("");
  };

  render();
  const interval = window.setInterval(render, 50);
  return () => window.clearInterval(interval);
};

const activateWelcome = (root: HTMLElement) => {
  const ascii = root.querySelector<HTMLElement>(".ascii-art-welcome");
  if (!ascii?.textContent) return;
  const colors = ["red", "green", "blue", "yellow", "orange", "purple"];
  const fragment = document.createDocumentFragment();
  for (const character of ascii.textContent) {
    const span = document.createElement("span");
    span.textContent = character;
    span.style.color = colors[Math.floor(Math.random() * colors.length)];
    fragment.appendChild(span);
  }
  ascii.replaceChildren(fragment);
};

const activateBlockBehavior = (
  block: LoadedBlock,
  root: HTMLElement,
): BlockCleanup | undefined => {
  if (block.name === "donut") return activateDonut(root);
  if (block.name === "welcome") activateWelcome(root);
};

const parseBlockURL = (url: string, block: Block) => {
  const backendURL = import.meta.env.PUBLIC_BACKEND_URL || "";
  return url
    .replaceAll("[SERVER_URL]", backendURL)
    .replaceAll(
      "[SELF_BLOCK_FILE]",
      `${backendURL}/v1/blocks/${block.id}/content`,
    );
};

const loadBlock = async (block: Block, signal: AbortSignal) => {
  if (block.content.type === "raw")
    return sanitizeBlockHTML(block.content.data);
  const response = await fetch(parseBlockURL(block.content.data, block), {
    signal,
  });
  if (!response.ok) throw new Error(`Unable to load ${block.name}.`);
  return sanitizeBlockHTML(await response.text());
};

function Content({ blocks, isLoading }: ContentProps) {
  const [loadedBlocks, setLoadedBlocks] = useState<LoadedBlock[]>([]);
  const [loadError, setLoadError] = useState(false);
  const blockElements = useRef(new Map<string, HTMLDivElement>());
  const behaviorCleanup = useRef<BlockCleanup[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    setLoadError(false);

    Promise.all(
      blocks.map(async (block) => ({
        id: block.id,
        name: block.name,
        kind: block.kind,
        html: await loadBlock(block, controller.signal),
      })),
    )
      .then(setLoadedBlocks)
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        setLoadError(true);
      });

    return () => controller.abort();
  }, [blocks]);

  useEffect(() => {
    behaviorCleanup.current.forEach((cleanup) => cleanup());
    behaviorCleanup.current = [];

    loadedBlocks.forEach((block) => {
      const element = blockElements.current.get(block.id);
      if (!element) return;
      const cleanup = activateBlockBehavior(block, element);
      if (cleanup) behaviorCleanup.current.push(cleanup);
    });

    return () => {
      behaviorCleanup.current.forEach((cleanup) => cleanup());
      behaviorCleanup.current = [];
    };
  }, [loadedBlocks]);

  return (
    <div className={styles.content}>
      {loadedBlocks.length > 0 ? (
        <div className={styles.blocks}>
          {loadedBlocks.map((block) => (
            <article
              className={`${styles.block} ${block.kind ? styles.previewBlock : ""}`}
              key={block.id}
            >
              <header>
                <p>{blockLabel(block)}</p>
              </header>
              <div
                id={`block-${block.id}`}
                ref={(element) => {
                  if (element) blockElements.current.set(block.id, element);
                  else blockElements.current.delete(block.id);
                }}
                dangerouslySetInnerHTML={{ __html: block.html }}
              />
            </article>
          ))}
        </div>
      ) : isLoading ? (
        <div className={styles.queryPending} aria-live="polite" aria-busy="true">
          <p>Assembling relevant context…</p>
        </div>
      ) : (
        <div className={styles.defaultState}>
          <div className={styles.identityCopy}>
            <h1>Aidan Tilgner</h1>
            <p className={styles.tagline}>
              Software engineer, <span>AI engineer</span>, and experience
              designer.
            </p>
            <p className={styles.description}>
              Ask about a role, problem, or project. The site will assemble the
              most relevant evidence for you.
            </p>
            {loadError && (
              <p className={styles.error}>That context could not be loaded.</p>
            )}
          </div>
          <figure className={styles.portrait}>
            <figcaption>
              <span>Identity / 01</span>
              <span>Portrait</span>
            </figcaption>
            <img
              src="/images/aidan-tilgner-headshot.jpg"
              alt="Aidan Tilgner smiling outdoors"
              width="924"
              height="1200"
              loading="eager"
              fetchPriority="high"
            />
          </figure>
        </div>
      )}
    </div>
  );
}

export default Content;
