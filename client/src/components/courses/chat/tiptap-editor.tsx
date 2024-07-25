import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import RichTextToolbar from "./toolbar";
import Underline from "@tiptap/extension-underline";

function TipTapRichTextEditor({
  data,
  onChange,
}: {
  data: string;
  onChange: (richText: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
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
    ],
    content: data,
    editorProps: {
      attributes: {
        class:
          "border-b border-border rounded-t-md p-2 py-4 font-nunito text-muted-foreground bg-accent dark:bg-accent/40 h-[10rem] max-h-[10rem] overflow-y-auto",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="flex flex-col justify-stretch border border-border rounded-md w-full">
      <EditorContent editor={editor} />
      <RichTextToolbar editor={editor} />
    </div>
  );
}

export default TipTapRichTextEditor;
