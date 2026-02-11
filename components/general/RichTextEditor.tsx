"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Mathematics from "@tiptap/extension-mathematics";
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough, 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered, 
  Quote, 
  ImageIcon,
  Link as LinkIcon,
  Sigma
} from "lucide-react";
import { Button } from "../ui/button";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto my-4",
        },
      }),
      Placeholder.configure({
        placeholder: "Write something ...",
      }),
      Mathematics,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[400px] py-4",
      },
    },
  });

  const addImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.url) {
          editor?.chain().focus().setImage({ src: data.url }).run();
        }
      }
    };
    input.click();
  };

  const setLink = () => {
    const url = window.prompt("URL");
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="relative border rounded-md p-2 min-h-[500px] bg-white dark:bg-zinc-950">
      <div className="flex flex-wrap gap-2 mb-4 p-2 border-b sticky top-0 bg-white dark:bg-zinc-950 z-10">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-zinc-100 dark:bg-zinc-800" : ""}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-zinc-100 dark:bg-zinc-800" : ""}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "bg-zinc-100 dark:bg-zinc-800" : ""}
        >
          <UnderlineIcon className="w-4 h-4" />
        </Button>
        <div className="w-[1px] h-6 bg-zinc-200 dark:bg-zinc-800 mx-1 self-center" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive("heading", { level: 1 }) ? "bg-zinc-100 dark:bg-zinc-800" : ""}
        >
          <Heading1 className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive("heading", { level: 2 }) ? "bg-zinc-100 dark:bg-zinc-800" : ""}
        >
          <Heading2 className="w-4 h-4" />
        </Button>
        <div className="w-[1px] h-6 bg-zinc-200 dark:bg-zinc-800 mx-1 self-center" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-zinc-100 dark:bg-zinc-800" : ""}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-zinc-100 dark:bg-zinc-800" : ""}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "bg-zinc-100 dark:bg-zinc-800" : ""}
        >
          <Quote className="w-4 h-4" />
        </Button>
        <div className="w-[1px] h-6 bg-zinc-200 dark:bg-zinc-800 mx-1 self-center" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={setLink}
          className={editor.isActive("link") ? "bg-zinc-100 dark:bg-zinc-800" : ""}
        >
          <LinkIcon className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addImage}
        >
          <ImageIcon className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.commands.insertContent('$\\sqrt{x^2 + y^2}$')}
          className={editor.isActive("mathematics") ? "bg-zinc-100 dark:bg-zinc-800" : ""}
          title="Insert Math (LaTeX)"
        >
          <Sigma className="w-4 h-4" />
        </Button>
      </div>

      {editor && (
        <BubbleMenu editor={editor}>
          <div className="flex gap-1 bg-zinc-900 text-white rounded-lg shadow-xl p-1 overflow-hidden">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 hover:bg-zinc-800 rounded ${editor.isActive("bold") ? "text-blue-400" : ""}`}
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 hover:bg-zinc-800 rounded ${editor.isActive("italic") ? "text-blue-400" : ""}`}
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-2 hover:bg-zinc-800 rounded ${editor.isActive("heading", { level: 2 }) ? "text-blue-400" : ""}`}
            >
              <Heading2 className="w-4 h-4" />
            </button>
          </div>
        </BubbleMenu>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}
