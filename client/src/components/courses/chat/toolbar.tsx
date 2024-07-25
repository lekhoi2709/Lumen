import { Bold, Italic, Underline, List } from "lucide-react";
import { type Editor } from "@tiptap/react";
import { Toggle } from "@/components/ui/toggle";

function RichTextToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return null;
  }

  return (
    <div className="p-1">
      <Toggle
        aria-label="Toggle Bold"
        className="rounded-sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        aria-label="Toggle Italic"
        className="rounded-sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        aria-label="Toggle Underline"
        className="rounded-sm"
        pressed={editor.isActive("underline")}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline className="h-4 w-4" />
      </Toggle>
      <Toggle
        aria-label="Toggle List"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Toggle>
    </div>
  );
}

export default RichTextToolbar;
