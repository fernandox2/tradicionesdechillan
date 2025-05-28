import axios from "axios";
import React, { useRef } from "react";

type MenuBarProps = {
  editor: any;
};

const MenuBar = ({ editor }: MenuBarProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!editor) return null;

  const baseBtnClass =
    "px-3 py-1 rounded-md border border-gray-300 bg-gray text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-150 select-none";

  const activeBtnClass = "bg-blue-600 text-white border-blue-600";
  const disabledBtnClass = "opacity-50 cursor-not-allowed";

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      editor.chain().focus().setImage({ src: base64 }).run();
    };
    reader.readAsDataURL(file);
  };

  const handleAddLink = () => {
    const url = window.prompt("Enter the URL");
  
    if (!url) return;
  
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run();
  };

  const buttons = [
    {
      action: () => editor.chain().focus().toggleBold().run(),
      canRun: () => editor.can().chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
      ariaLabel: "Bold",
      title: "Bold (Ctrl+B)",
      content: <strong>B</strong>,
    },
    {
      action: () => editor.chain().focus().toggleItalic().run(),
      canRun: () => editor.can().chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
      ariaLabel: "Italic",
      title: "Italic (Ctrl+I)",
      content: <em>I</em>,
    },
    {
      action: () => editor.chain().focus().toggleStrike().run(),
      canRun: () => editor.can().chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive("strike"),
      ariaLabel: "Strike",
      title: "Strike",
      content: <s>S</s>,
    },
    // Text Align buttons
    {
      action: () => editor.chain().focus().setTextAlign("left").run(),
      canRun: () => true,
      isActive: () => editor.isActive({ textAlign: "left" }),
      ariaLabel: "Align Left",
      title: "Align Left",
      content: (
        <svg
          className="w-4 h-4 mx-auto"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="14" height="2" rx="1" />
          <rect x="3" y="9" width="10" height="2" rx="1" />
          <rect x="3" y="13" width="14" height="2" rx="1" />
        </svg>
      ),
    },
    {
      action: () => editor.chain().focus().setTextAlign("center").run(),
      canRun: () => true,
      isActive: () => editor.isActive({ textAlign: "center" }),
      ariaLabel: "Align Center",
      title: "Align Center",
      content: (
        <svg
          className="w-4 h-4 mx-auto"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <rect x="4" y="5" width="12" height="2" rx="1" />
          <rect x="6" y="9" width="8" height="2" rx="1" />
          <rect x="4" y="13" width="12" height="2" rx="1" />
        </svg>
      ),
    },
    {
      action: () => editor.chain().focus().setTextAlign("right").run(),
      canRun: () => true,
      isActive: () => editor.isActive({ textAlign: "right" }),
      ariaLabel: "Align Right",
      title: "Align Right",
      content: (
        <svg
          className="w-4 h-4 mx-auto"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="14" height="2" rx="1" />
          <rect x="7" y="9" width="10" height="2" rx="1" />
          <rect x="3" y="13" width="14" height="2" rx="1" />
        </svg>
      ),
    },
    {
      action: () => editor.chain().focus().setTextAlign("justify").run(),
      canRun: () => true,
      isActive: () => editor.isActive({ textAlign: "justify" }),
      ariaLabel: "Justify",
      title: "Justify",
      content: (
        <svg
          className="w-4 h-4 mx-auto"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="14" height="2" rx="1" />
          <rect x="3" y="9" width="14" height="2" rx="1" />
          <rect x="3" y="13" width="14" height="2" rx="1" />
        </svg>
      ),
    },
    // Lists
    {
      action: () => editor.chain().focus().toggleBulletList().run(),
      canRun: () => true,
      isActive: () => editor.isActive("bulletList"),
      ariaLabel: "Bullet List",
      title: "Bullet List",
      content: (
        <svg
          className="w-4 h-4 mx-auto"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <circle cx="5" cy="7" r="2" />
          <circle cx="5" cy="13" r="2" />
          <rect x="9" y="6" width="8" height="2" rx="1" />
          <rect x="9" y="12" width="8" height="2" rx="1" />
        </svg>
      ),
    },
    {
      action: () => editor.chain().focus().toggleOrderedList().run(),
      canRun: () => true,
      isActive: () => editor.isActive("orderedList"),
      ariaLabel: "Ordered List",
      title: "Ordered List",
      content: (
        <svg
          className="w-4 h-4 mx-auto"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <text x="4" y="9" fontSize="7" fontWeight="bold">
            1.
          </text>
          <text x="4" y="15" fontSize="7" fontWeight="bold">
            2.
          </text>
          <rect x="9" y="6" width="8" height="2" rx="1" />
          <rect x="9" y="12" width="8" height="2" rx="1" />
        </svg>
      ),
    },
    // Horizontal Rule
    {
      action: () => editor.chain().focus().setHorizontalRule().run(),
      canRun: () => true,
      isActive: () => false,
      ariaLabel: "Horizontal Rule",
      title: "Horizontal Rule",
      content: (
        <svg
          className="w-6 h-6 mx-auto"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <line x1="4" y1="12" x2="20" y2="12" />
        </svg>
      ),
    },
    // NUEVO BOTÓN con icono de imagen
    {
        action: handleImageUploadClick,
        canRun: () => true,
        isActive: () => false,
        ariaLabel: "Insert Image",
        title: "Insert Image",
        content: (
          <svg
            className="w-5 h-5 mx-auto"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
            <circle cx="8.5" cy="10.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        ),
      },

      {
        action: handleAddLink,
  canRun: () => {
    // Sólo activar si hay texto seleccionado
    return editor.state.selection && !editor.state.selection.empty;
  },
  isActive: () => editor.isActive("link"),
  ariaLabel: "Insert Link",
  title: "Insert Link",
        content: (
          <svg
            className="w-5 h-5 mx-auto"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M10 14a4 4 0 005.66 0l3.54-3.54a4 4 0 00-5.66-5.66l-1.41 1.41" />
            <path d="M14 10a4 4 0 00-5.66 0l-3.54 3.54a4 4 0 005.66 5.66l1.41-1.41" />
          </svg>
        ),
      },
  ];

  return (
    <>
    <input
      type="file"
      accept="image/*"
      style={{ display: "none" }}
      ref={fileInputRef}
      onChange={handleChange}
    />
    <div className="mb-3 flex flex-wrap gap-2">
      {buttons.map(({ action, canRun, isActive, ariaLabel, title, content }, i) => (
        <button
          key={i}
          onClick={action}
          disabled={!canRun()}
          className={`${baseBtnClass} ${
            isActive() ? activeBtnClass : ""
          } ${!canRun() ? disabledBtnClass : ""}`}
          type="button"
          aria-label={ariaLabel}
          title={title}
        >
          {content}
        </button>
      ))}
    </div>
  </>
  );
};

export default MenuBar;
