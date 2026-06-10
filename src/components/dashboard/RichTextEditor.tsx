import React, { useRef, useEffect, useState } from "react";
import { 
  Bold, 
  Italic, 
  Underline, 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered, 
  CheckSquare, 
  Code,
  Quote
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeStyles, setActiveStyles] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  // Prevent cursor jumping: only set innerHTML if value changed externally
  useEffect(() => {
    if (editorRef.current) {
      // Normalize comparison to prevent circular updates
      const currentHTML = editorRef.current.innerHTML;
      if (currentHTML !== value) {
        if (!value) {
          editorRef.current.innerHTML = "<div><br></div>";
        } else {
          editorRef.current.innerHTML = value;
        }
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      // If it only contains empty elements, treat as empty string
      if (
        html === "<div><br></div>" || 
        html === "<p><br></p>" || 
        html === "<br>" || 
        html === ""
      ) {
        onChange("");
      } else {
        onChange(html);
      }
      updateActiveStyles();
    }
  };

  const executeCommand = (command: string, argValue: string = "") => {
    document.execCommand(command, false, argValue);
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
    updateActiveStyles();
    editorRef.current?.focus();
  };

  const handleHeading = (tag: string) => {
    // If we are already on that block, toggle to paragraph
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const parent = selection.getRangeAt(0).startContainer.parentElement;
      if (parent && parent.tagName.toLowerCase() === tag) {
        executeCommand("formatBlock", "<p>");
        return;
      }
    }
    executeCommand("formatBlock", `<${tag}>`);
  };

  const handleCodeBlock = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const parent = selection.getRangeAt(0).startContainer.parentElement;
      if (parent && parent.tagName.toLowerCase() === "pre") {
        executeCommand("formatBlock", "<p>");
        return;
      }
    }
    executeCommand("formatBlock", "<pre>");
  };

  const handleBlockquote = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const parent = selection.getRangeAt(0).startContainer.parentElement;
      if (parent && parent.tagName.toLowerCase() === "blockquote") {
        executeCommand("formatBlock", "<p>");
        return;
      }
    }
    executeCommand("formatBlock", "<blockquote>");
  };

  const handleChecklist = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);

    // Create a checklist item with checkbox and nested styling
    const clContainer = document.createElement("div");
    clContainer.className = "checklist-item flex items-start gap-2.5 my-1.5";
    
    // Checkbox input
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-950 cursor-pointer mt-0.5";
    checkbox.contentEditable = "false"; // Keep checkbox interactive, not typing-friendly

    // Label editable container
    const labelSpan = document.createElement("span");
    labelSpan.className = "outline-none flex-1 text-xs text-neutral-800 font-sans leading-relaxed editor-checklist-label";
    labelSpan.innerHTML = "New checklist task";

    clContainer.appendChild(checkbox);
    clContainer.appendChild(labelSpan);

    range.deleteContents();
    range.insertNode(clContainer);

    // Position carets for immediate editing
    const newRange = document.createRange();
    newRange.setStart(labelSpan, 0);
    newRange.setEnd(labelSpan, labelSpan.innerHTML.length);
    selection.removeAllRanges();
    selection.addRange(newRange);

    handleInput();
  };

  // Support interactive checklist clicking directly in the editor workspace
  const handleEditorClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target && target.tagName === "INPUT" && (target as HTMLInputElement).type === "checkbox") {
      const checkbox = target as HTMLInputElement;
      if (checkbox.checked) {
        checkbox.setAttribute("checked", "true");
        // Strythrough style will apply via CSS class
      } else {
        checkbox.removeAttribute("checked");
      }
      handleInput();
    }
  };

  const updateActiveStyles = () => {
    const styles: string[] = [];
    if (document.queryCommandState("bold")) styles.push("bold");
    if (document.queryCommandState("italic")) styles.push("italic");
    if (document.queryCommandState("underline")) styles.push("underline");
    if (document.queryCommandState("insertUnorderedList")) styles.push("bullet");
    if (document.queryCommandState("insertOrderedList")) styles.push("ordered");
    
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      let parent = selection.getRangeAt(0).startContainer.parentElement;
      while (parent && parent !== editorRef.current) {
        const tagName = parent.tagName.toLowerCase();
        if (tagName === "h1") styles.push("h1");
        if (tagName === "h2") styles.push("h2");
        if (tagName === "pre") styles.push("code");
        if (tagName === "blockquote") styles.push("quote");
        if (parent.classList.contains("checklist-item")) styles.push("checklist");
        parent = parent.parentElement;
      }
    }
    setActiveStyles(styles);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      // Force generic linebreaks/paragraphs rather than raw divs when possible
      // Let standard editor mechanics process, but update active states
      setTimeout(() => {
        handleInput();
      }, 0);
    }
  };

  return (
    <div 
      className={`border border-neutral-200 rounded-2xl flex flex-col overflow-hidden bg-neutral-50 transition-all ${
        isFocused ? "border-neutral-400 bg-white ring-1 ring-neutral-400/10" : ""
      }`}
    >
      {/* RICH TEXT EDITOR TOOLBAR */}
      <div className="bg-neutral-100/80 backdrop-blur-sm border-b border-neutral-200/60 p-1.5 flex flex-wrap gap-1 items-center">
        {/* Typo Formats */}
        <button
          type="button"
          onClick={() => executeCommand("bold")}
          className={`p-2 rounded-lg transition-all cursor-pointer hover:bg-neutral-200/80 active:scale-95 ${
            activeStyles.includes("bold") ? "bg-neutral-900 text-white hover:bg-neutral-900" : "text-neutral-600"
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold size={14} className="stroke-[2.5]" />
        </button>

        <button
          type="button"
          onClick={() => executeCommand("italic")}
          className={`p-2 rounded-lg transition-all cursor-pointer hover:bg-neutral-200/80 active:scale-95 ${
            activeStyles.includes("italic") ? "bg-neutral-900 text-white hover:bg-neutral-900" : "text-neutral-600"
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic size={14} className="stroke-[2.5]" />
        </button>

        <button
          type="button"
          onClick={() => executeCommand("underline")}
          className={`p-2 rounded-lg transition-all cursor-pointer hover:bg-neutral-200/80 active:scale-95 ${
            activeStyles.includes("underline") ? "bg-neutral-900 text-white hover:bg-neutral-900" : "text-neutral-600"
          }`}
          title="Underline (Ctrl+U)"
        >
          <Underline size={14} className="stroke-[2.5]" />
        </button>

        <div className="w-[1px] h-4 bg-neutral-300 mx-1 shrink-0" />

        {/* Headings */}
        <button
          type="button"
          onClick={() => handleHeading("h1")}
          className={`p-2 rounded-lg transition-all cursor-pointer hover:bg-neutral-200/80 active:scale-95 ${
            activeStyles.includes("h1") ? "bg-neutral-900 text-white hover:bg-neutral-900" : "text-neutral-600"
          }`}
          title="Heading H1"
        >
          <Heading1 size={14} />
        </button>

        <button
          type="button"
          onClick={() => handleHeading("h2")}
          className={`p-2 rounded-lg transition-all cursor-pointer hover:bg-neutral-200/80 active:scale-95 ${
            activeStyles.includes("h2") ? "bg-neutral-900 text-white hover:bg-neutral-900" : "text-neutral-600"
          }`}
          title="Heading H2"
        >
          <Heading2 size={14} />
        </button>

        <div className="w-[1px] h-4 bg-neutral-300 mx-1 shrink-0" />

        {/* Bullet and Numbers */}
        <button
          type="button"
          onClick={() => executeCommand("insertUnorderedList")}
          className={`p-2 rounded-lg transition-all cursor-pointer hover:bg-neutral-200/80 active:scale-95 ${
            activeStyles.includes("bullet") ? "bg-neutral-900 text-white hover:bg-neutral-900" : "text-neutral-600"
          }`}
          title="Bullet List"
        >
          <List size={14} />
        </button>

        <button
          type="button"
          onClick={() => executeCommand("insertOrderedList")}
          className={`p-2 rounded-lg transition-all cursor-pointer hover:bg-neutral-200/80 active:scale-95 ${
            activeStyles.includes("ordered") ? "bg-neutral-900 text-white hover:bg-neutral-900" : "text-neutral-600"
          }`}
          title="Numbered List"
        >
          <ListOrdered size={14} />
        </button>

        <button
          type="button"
          onClick={handleChecklist}
          className={`p-2 rounded-lg transition-all cursor-pointer hover:bg-neutral-200/80 active:scale-95 ${
            activeStyles.includes("checklist") ? "bg-neutral-900 text-white hover:bg-neutral-900" : "text-neutral-600"
          }`}
          title="Add Checklist"
        >
          <CheckSquare size={14} />
        </button>

        <div className="w-[1px] h-4 bg-neutral-300 mx-1 shrink-0" />

        {/* Code Blocks and Quotes */}
        <button
          type="button"
          onClick={handleCodeBlock}
          className={`p-2 rounded-lg transition-all cursor-pointer hover:bg-neutral-200/80 active:scale-95 ${
            activeStyles.includes("code") ? "bg-neutral-900 text-white hover:bg-neutral-900" : "text-neutral-600"
          }`}
          title="Code Block"
        >
          <Code size={14} />
        </button>

        <button
          type="button"
          onClick={handleBlockquote}
          className={`p-2 rounded-lg transition-all cursor-pointer hover:bg-neutral-200/80 active:scale-95 ${
            activeStyles.includes("quote") ? "bg-neutral-900 text-white hover:bg-neutral-900" : "text-neutral-600"
          }`}
          title="Blockquote"
        >
          <Quote size={14} />
        </button>
      </div>

      {/* CORE CONTENTEDITABLE WORKSPACE */}
      <div 
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onClick={handleEditorClick}
        onKeyUp={updateActiveStyles}
        onMouseUp={updateActiveStyles}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          handleInput();
        }}
        className="rich-text-content px-4 py-3 text-xs w-full min-h-[140px] max-h-[300px] overflow-y-auto focus:outline-none focus:bg-white select-text cursor-text leading-relaxed"
        style={{ outline: "none" }}
      />

      {/* FOOTER INFO BAR */}
      <div className="bg-neutral-50 px-3.5 py-1.5 border-t border-neutral-100 flex items-center justify-between text-[9px] text-neutral-400 select-none">
        <span className="font-mono">Workspace Safe Web RTF Editor</span>
        <span className="font-mono">HTML Format</span>
      </div>
    </div>
  );
}
