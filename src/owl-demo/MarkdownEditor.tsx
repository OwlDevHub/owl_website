import React, { useRef } from "react";
import {
  Editor,
  rootCtx,
  defaultValueCtx,
  editorViewOptionsCtx,
  prosePluginsCtx,
  remarkPluginsCtx,
} from "@milkdown/kit/core";
import { clipboard } from "@milkdown/plugin-clipboard";
import { history } from "@milkdown/plugin-history";
import { indent } from "@milkdown/plugin-indent";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { trailing } from "@milkdown/plugin-trailing";
import { upload } from "@milkdown/plugin-upload";
import { commonmark } from "@milkdown/preset-commonmark";
import { gfm } from "@milkdown/kit/preset/gfm";
import remarkGfm from "remark-gfm";
import { Plugin, PluginKey } from "@milkdown/prose/state";
import type { EditorState } from "@milkdown/prose/state";
import type { RemarkPlugin } from "@milkdown/transformer";
import { nord } from "@milkdown/theme-nord";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import "@milkdown/theme-nord/style.css";

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  editable?: boolean;
  placeholder?: string;
  className?: string;
}

const makePlaceholderPlugin = (text: string): Plugin => {
  const key = new PluginKey("milkdown-placeholder");
  return new Plugin({
    key,
    props: {
      attributes: (state: EditorState): Record<string, string> => {
        const isEmpty = state.doc.textContent.trim().length === 0;
        if (!isEmpty || !text) return { class: "" };
        return { class: "is-empty", "data-placeholder": text };
      },
    },
  });
};

const MarkdownEditorInner: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  editable = true,
  placeholder = "",
  className = "",
}) => {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEditor((root) => {
    return Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, value);
        ctx.update(editorViewOptionsCtx, (prev) => ({ ...prev, editable: () => editable }));
        ctx.update(prosePluginsCtx, (prev) => [...prev, makePlaceholderPlugin(placeholder)]);
        ctx.update(remarkPluginsCtx, (prev) => [...prev, remarkGfm as unknown as RemarkPlugin]);
        ctx.get(listenerCtx).markdownUpdated((_ctx, markdown) => {
          onChangeRef.current(markdown);
        });
      })
      .config(nord)
      .use(commonmark)
      .use(gfm)
      .use(history)
      .use(listener)
      .use(clipboard)
      .use(indent)
      .use(trailing)
      .use(upload);
  }, []);

  return (
    <div className={`markdown_editor ${className}`}>
      <Milkdown />
    </div>
  );
};

export const MarkdownEditor: React.FC<MarkdownEditorProps> = (props) => (
  <MilkdownProvider>
    <MarkdownEditorInner {...props} />
  </MilkdownProvider>
);
