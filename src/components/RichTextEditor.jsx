import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { FaBold, FaItalic, FaUnderline, FaStrikethrough, FaHeading, FaListUl, FaListOl, FaQuoteLeft, FaUndo, FaRedo } from 'react-icons/fa';
import { cn } from '@/lib/utils';


// MenuBar component
const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const buttons = [
    { icon: <FaBold />, command: 'toggleBold', isActive: 'bold' },
    { icon: <FaItalic />, command: 'toggleItalic', isActive: 'italic' },
    { icon: <FaUnderline />, command: 'toggleUnderline', isActive: 'underline' },
    { icon: <FaStrikethrough />, command: 'toggleStrike', isActive: 'strike' },
    { icon: <FaHeading />, command: 'toggleHeading', attrs: { level: 2 }, isActive: 'heading' },
    { icon: <FaListUl />, command: 'toggleBulletList', isActive: 'bulletList' },
    { icon: <FaListOl />, command: 'toggleOrderedList', isActive: 'orderedList' },
    { icon: <FaQuoteLeft />, command: 'toggleBlockquote', isActive: 'blockquote' },
  ];

  return (
    <div className="pb-2 flex flex-wrap gap-2 border-b p-2 bg-muted/30">
      {buttons.map((btn, idx) => (
        <button
          key={idx}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus()[btn.command](btn.attrs || {}).run();
          }}
          className={cn(
            'border border-input bg-background hover:bg-accent hover:text-accent-foreground p-2 rounded text-xs flex items-center justify-center transition-colors',
            editor.isActive(btn.isActive, btn.attrs) ? 'bg-primary text-primary-foreground border-primary' : ''
          )}
        >
          {btn.icon}
        </button>
      ))}
      <button 
        type="button"
        onClick={() => editor.chain().focus().undo().run()} 
        disabled={!editor.can().undo()}
        className="border border-input bg-background hover:bg-accent hover:text-accent-foreground p-2 rounded text-xs flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaUndo />
      </button>
      <button 
        type="button"
        onClick={() => editor.chain().focus().redo().run()} 
        disabled={!editor.can().redo()}
        className="border border-input bg-background hover:bg-accent hover:text-accent-foreground p-2 rounded text-xs flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaRedo />
      </button>
    </div>
  );
};

const RichTextEditor = ({ content, setContent, placeholder = 'Start writing...' }) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[300px] p-4',
        'data-placeholder': placeholder,
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  // Update editor if content changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  if (!editor) {
    return <div className="border rounded p-4 min-h-[300px]">Loading editor...</div>;
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      <MenuBar editor={editor} />
      <div className="border-t bg-background">
        <EditorContent 
          editor={editor}
          className="[&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:p-4 [&_.ProseMirror]:prose [&_.ProseMirror]:prose-sm [&_.ProseMirror]:max-w-none [&_.ProseMirror]:text-foreground"
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
