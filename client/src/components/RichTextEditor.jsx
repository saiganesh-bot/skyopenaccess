import { useEffect, useRef } from "react";

const tools = [
  { label: "B", command: "bold", title: "Bold" },
  { label: "I", command: "italic", title: "Italic" },
  { label: "U", command: "underline", title: "Underline" },
  { label: "H", command: "hiliteColor", value: "#ffe1b3", title: "Highlight" },
  { label: "•", command: "insertUnorderedList", title: "Bullet List" }
];

export const RichTextEditor = ({ value, onChange, placeholder = "Start typing..." }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) return;
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const runCommand = (command, commandValue) => {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    onChange(editorRef.current?.innerHTML || "");
  };

  return (
    <div className="rte-shell">
      <div className="rte-toolbar" role="toolbar" aria-label="Text editor toolbar">
        {tools.map((tool) => (
          <button
            key={tool.title}
            type="button"
            className="rte-btn"
            onClick={() => runCommand(tool.command, tool.value)}
            title={tool.title}
            aria-label={tool.title}
          >
            {tool.label}
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        className="rte-panel"
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
      />
    </div>
  );
};
