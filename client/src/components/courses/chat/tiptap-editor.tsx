import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import RichTextToolbar from "./toolbar";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

function TipTapRichTextEditor({
  data,
  placeholder,
  onChange,
}: {
  data?: string;
  placeholder?: string;
  onChange: (richText: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: "tiptap-paragraph",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc list-outside pl-4",
          },
        },
      }),
      Underline.configure({
        HTMLAttributes: {
          class: "underline underline-offset-2",
        },
      }),
      Link.configure({
        autolink: true,
        defaultProtocol: "https",
        HTMLAttributes: {
          class: "text-blue-500 underline underline-offset-2",
          target: "_blank",
        },
      }).extend({
        inclusive: false,
      }),
      Placeholder.configure({
        placeholder: placeholder,
        emptyNodeClass:
          "first:before:text-muted-foreground first:before:float-left first:before:content-[attr(data-placeholder)] first:before:pointer-events-none first:before:text-sm first:before:h-0",
      }),
    ],
    content: data,
    editorProps: {
      attributes: {
        class:
          "border-b border-border rounded-t-md p-2 py-4 font-nunito text-muted-foreground bg-accent dark:bg-accent/40 h-[10rem] max-h-[10rem] overflow-y-auto text-sm",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="flex w-full flex-col justify-stretch rounded-md border border-border">
      <EditorContent editor={editor} />
      <RichTextToolbar editor={editor} />
    </div>
  );
}

export default TipTapRichTextEditor;
