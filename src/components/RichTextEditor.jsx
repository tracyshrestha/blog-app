import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Mic, MicOff } from "lucide-react";
import { toast } from "sonner";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaHeading,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaUndo,
  FaRedo,
} from "react-icons/fa";
import { cn } from "@/lib/utils";

const SpeechRecognitionAPI =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

const MAX_LISTEN_MS = 30_000;

// MenuBar component
const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const buttons = [
    { icon: <FaBold />, command: "toggleBold", isActive: "bold" },
    { icon: <FaItalic />, command: "toggleItalic", isActive: "italic" },
    {
      icon: <FaUnderline />,
      command: "toggleUnderline",
      isActive: "underline",
    },
    { icon: <FaStrikethrough />, command: "toggleStrike", isActive: "strike" },
    {
      icon: <FaHeading />,
      command: "toggleHeading",
      attrs: { level: 2 },
      isActive: "heading",
    },
    { icon: <FaListUl />, command: "toggleBulletList", isActive: "bulletList" },
    {
      icon: <FaListOl />,
      command: "toggleOrderedList",
      isActive: "orderedList",
    },
    {
      icon: <FaQuoteLeft />,
      command: "toggleBlockquote",
      isActive: "blockquote",
    },
  ];

  return (
    <div className="pb-2 flex flex-wrap gap-2 border-b p-2 bg-muted/30">
      {buttons.map((btn, idx) => (
        <button
          key={idx}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor
              .chain()
              .focus()
              [btn.command](btn.attrs || {})
              .run();
          }}
          className={cn(
            "border border-input bg-background hover:bg-accent hover:text-accent-foreground p-2 rounded text-xs flex items-center justify-center transition-colors",
            editor.isActive(btn.isActive, btn.attrs)
              ? "bg-primary text-primary-foreground border-primary"
              : "",
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

const RichTextEditor = ({
  content,
  setContent,
  placeholder = "Start writing...",
}) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const listenTimeoutRef = useRef(null);
  const finalIndexRef = useRef(0);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: content || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[300px] p-4",
        "data-placeholder": placeholder,
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  // Update editor if content changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  const stopSpeechToText = () => {
    if (listenTimeoutRef.current) {
      clearTimeout(listenTimeoutRef.current);
      listenTimeoutRef.current = null;
    }
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  useEffect(() => {
    return () => {
      if (listenTimeoutRef.current) clearTimeout(listenTimeoutRef.current);
      recognitionRef.current?.stop();
    };
  }, []);

  const toggleSpeechToText = () => {
    if (!editor) return;

    if (!SpeechRecognitionAPI) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      stopSpeechToText();
      return;
    }

    finalIndexRef.current = 0;
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      for (let i = finalIndexRef.current; i < event.results.length; i++) {
        if (!event.results[i].isFinal) continue;

        const transcript = event.results[i][0].transcript;
        if (transcript) {
          editor.chain().focus().insertContent(transcript).run();
        }
        finalIndexRef.current = i + 1;
      }
    };

    recognition.onerror = (event) => {
      stopSpeechToText();
      if (event.error === "not-allowed") {
        toast.error("Microphone access was denied.");
      } else if (event.error !== "aborted" && event.error !== "no-speech") {
        toast.error("Could not capture speech. Please try again.");
      }
    };

    recognition.onend = () => {
      if (listenTimeoutRef.current) {
        clearTimeout(listenTimeoutRef.current);
        listenTimeoutRef.current = null;
      }
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();

    listenTimeoutRef.current = setTimeout(() => {
      stopSpeechToText();
    }, MAX_LISTEN_MS);
  };

  if (!editor) {
    return (
      <div className="border rounded p-4 min-h-[300px]">Loading editor...</div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      <MenuBar editor={editor} />
      <div className="relative border-t bg-background">
        <EditorContent
          editor={editor}
          className="[&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:p-4 [&_.ProseMirror]:pb-12 [&_.ProseMirror]:prose [&_.ProseMirror]:prose-sm [&_.ProseMirror]:max-w-none [&_.ProseMirror]:text-foreground"
        />
        <p
          className={cn(
            "absolute bottom-3 left-3 text-xs pointer-events-none select-none transition-colors",
            isListening
              ? "text-destructive"
              : "text-muted-foreground",
          )}
        >
          {isListening
            ? "Listening… speak now"
            : "Click the mic to speak, or start typing"}
        </p>
        <button
          type="button"
          onClick={toggleSpeechToText}
          aria-label={isListening ? "Stop dictation" : "Start dictation"}
          title={
            isListening
              ? "Stop listening (or auto-stops at 30s)"
              : "Dictate with microphone (max 30s)"
          }
          className={cn(
            "absolute bottom-3 right-3 rounded-md p-2 border border-input bg-background shadow-sm transition-colors",
            isListening
              ? "text-destructive bg-destructive/10 border-destructive/30"
              : "text-muted-foreground hover:text-foreground hover:bg-muted",
          )}
        >
          {isListening ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default RichTextEditor;
