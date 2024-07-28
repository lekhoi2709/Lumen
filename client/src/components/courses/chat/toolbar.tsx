import { Bold, Italic, Underline, List, Link } from "lucide-react";
import { type Editor } from "@tiptap/react";
import { Toggle } from "@/components/ui/toggle";
import { useCallback } from "react";

function RichTextToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return null;
  }

  const setLink = useCallback(() => {
    const prevUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter the URL", prevUrl);
    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // update link
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url, target: "_blank" })
      .run();
  }, [editor]);

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
      <Toggle
        aria-label="Toggle Link"
        pressed={editor.isActive("link")}
        onPressedChange={setLink}
      >
        <Link className="h-4 w-4" />
      </Toggle>
    </div>
  );
}

export default RichTextToolbar;
