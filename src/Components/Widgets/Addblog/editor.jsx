import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Image,
  Video,
  Type,
  Palette,
  Link,
  X,
} from "lucide-react";

const WordEditor = forwardRef(({ updateContent }, ref) => {
  const [content, setContent] = useState("");
  const [fontSize, setFontSize] = useState("16px");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [textColor, setTextColor] = useState("#000000");
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("https://");
  const [linkText, setLinkText] = useState("");
  const [selectedText, setSelectedText] = useState("");

  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const colorInputRef = useRef(null);
  const selectionRangeRef = useRef(null);

  // Expose editor methods to parent
  useImperativeHandle(ref, () => ({
    getContent: () => editorRef.current.innerHTML,
    setContent: (html) => {
      if (editorRef.current) {
        editorRef.current.innerHTML = html;
        setContent(html);
      }
    },
    focus: () => editorRef.current.focus(),
  }));

  const fontSizes = [
    "12px",
    "14px",
    "16px",
    "18px",
    "20px",
    "24px",
    "28px",
    "32px",
    "36px",
    "48px",
  ];

  const fontFamilies = [
    "Arial",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
    "Helvetica",
  ];

  // Heading styles options
  const headingStyles = [
    { value: "p", label: "Paragraph" },
    { value: "h1", label: "Heading 1" },
    { value: "h2", label: "Heading 2" },
    { value: "h3", label: "Heading 3" },
    { value: "h4", label: "Heading 4" },
    { value: "blockquote", label: "Quote" },
  ];

  // Add tooltip style for links
  useEffect(() => {
    // Add CSS for link tooltips
    const style = document.createElement("style");
    style.textContent = `
      .editor-link {
        position: relative;
      }
      .editor-link:hover::after {
        content: attr(href);
        position: absolute;
        bottom: 100%;
        left: 0;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 1000;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Process links after content changes
  useEffect(() => {
    if (editorRef.current) {
      const links = editorRef.current.querySelectorAll("a");
      links.forEach((link) => {
        if (!link.classList.contains("editor-link")) {
          link.classList.add("editor-link");
        }
      });
    }
  }, [content]);

  const handleCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleCommand("insertImage", event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const videoElement = `<video controls class="my-2 max-w-full h-auto" src="${event.target.result}"></video>`;
        document.execCommand("insertHTML", false, videoElement);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (e) => {
    const color = e.target.value;
    setTextColor(color);
    handleCommand("foreColor", color);
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    document.execCommand("fontSize", false, "7");
    const fontElements = document.getElementsByTagName("font");
    for (let i = 0; i < fontElements.length; i++) {
      if (fontElements[i].hasAttribute("size")) {
        fontElements[i].removeAttribute("size");
        fontElements[i].style.fontSize = size;
      }
    }
  };

  const handleFontFamilyChange = (font) => {
    setFontFamily(font);
    handleCommand("fontName", font);
  };

  // Function to apply heading styles
  const handleHeadingStyleChange = (style) => {
    if (style === "p") {
      handleCommand("formatBlock", "p");
    } else if (style === "blockquote") {
      handleCommand("formatBlock", "blockquote");
    } else {
      handleCommand("formatBlock", style);
    }
  };

  // Function to save selection range before showing link dialog
  const saveSelection = () => {
    if (window.getSelection) {
      const sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        selectionRangeRef.current = sel.getRangeAt(0);
        setSelectedText(sel.toString());
      }
    }
  };

  // Function to restore selection range after showing link dialog
  const restoreSelection = () => {
    if (selectionRangeRef.current) {
      if (window.getSelection) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(selectionRangeRef.current);
      }
    }
  };

  // Modified function to open custom link dialog
  const handleOpenLinkDialog = () => {
    saveSelection();
    const text = window.getSelection().toString();
    setLinkText(text || "");
    setLinkUrl("https://");
    setShowLinkDialog(true);
  };

  // Function to insert a link with custom dialog
  const handleInsertLink = () => {
    if (linkUrl) {
      restoreSelection();

      // Use the provided link text, or the selected text, or the URL
      const displayText = linkText || selectedText || linkUrl;
      const linkHtml = `<a href="${linkUrl}" target="_blank" class="editor-link">${displayText}</a>`;

      handleCommand("insertHTML", linkHtml);
    }
    setShowLinkDialog(false);
  };

  // Update parent component with content changes
  const handleContentChange = (e) => {
    const newContent = e.currentTarget.innerHTML;
    setContent(newContent);
    updateContent(newContent);
  };

  return (
    <div className="bg-white py-10">
      <div className="rounded-lg shadow-lg p-4 max-w-7xl mx-auto ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Post Description Editor
          </h2>
        </div>

        {/* Toolbar */}
        <div className="bg-gray-100 rounded-lg p-2 mb-4">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {/* Heading styles dropdown */}
            <div className="relative inline-block">
              <div className="flex items-center bg-white border rounded p-1">
                <Type className="w-4 h-4 mr-1" />
                <select
                  onChange={(e) => handleHeadingStyleChange(e.target.value)}
                  className="bg-transparent pr-8 focus:outline-none"
                  defaultValue="p"
                >
                  {headingStyles.map((style) => (
                    <option key={style.value} value={style.value}>
                      {style.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            {/* Text formatting */}
            <button
              onClick={() => handleCommand("bold")}
              className="p-2 hover:bg-gray-200 rounded"
            >
              <Bold className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleCommand("italic")}
              className="p-2 hover:bg-gray-200 rounded"
            >
              <Italic className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleCommand("underline")}
              className="p-2 hover:bg-gray-200 rounded"
            >
              <Underline className="w-5 h-5" />
            </button>

            {/* Link button */}
            <button
              onClick={handleOpenLinkDialog}
              className="p-2 hover:bg-gray-200 rounded"
            >
              <Link className="w-5 h-5" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            {/* Alignment */}
            <button
              onClick={() => handleCommand("justifyLeft")}
              className="p-2 hover:bg-gray-200 rounded"
            >
              <AlignLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleCommand("justifyCenter")}
              className="p-2 hover:bg-gray-200 rounded"
            >
              <AlignCenter className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleCommand("justifyRight")}
              className="p-2 hover:bg-gray-200 rounded"
            >
              <AlignRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleCommand("justifyFull")}
              className="p-2 hover:bg-gray-200 rounded"
            >
              <AlignJustify className="w-5 h-5" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            {/* Lists */}
            <button
              onClick={() => handleCommand("insertUnorderedList")}
              className="p-2 hover:bg-gray-200 rounded"
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleCommand("insertOrderedList")}
              className="p-2 hover:bg-gray-200 rounded"
            >
              <ListOrdered className="w-5 h-5" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            {/* Media */}
            <button
              onClick={() => fileInputRef.current.click()}
              className="p-2 hover:bg-gray-200 rounded"
            >
              <Image className="w-5 h-5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />

            <button
              onClick={() => videoInputRef.current.click()}
              className="p-2 hover:bg-gray-200 rounded"
            >
              <Video className="w-5 h-5" />
            </button>
            <input
              type="file"
              ref={videoInputRef}
              onChange={handleVideoUpload}
              accept="video/*"
              className="hidden"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Font family selector */}
            <div className="relative inline-block">
              <div className="flex items-center bg-white border rounded p-1">
                <Type className="w-4 h-4 mr-1" />
                <select
                  value={fontFamily}
                  onChange={(e) => handleFontFamilyChange(e.target.value)}
                  className="bg-transparent pr-8 focus:outline-none"
                >
                  {fontFamilies.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Font size selector */}
            <div className="relative inline-block">
              <div className="flex items-center bg-white border rounded p-1">
                <span className="text-xs mr-1">Size</span>
                <select
                  value={fontSize}
                  onChange={(e) => handleFontSizeChange(e.target.value)}
                  className="bg-transparent pr-8 focus:outline-none"
                >
                  {fontSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Color picker */}
            <div className="relative inline-block">
              <button
                onClick={() => colorInputRef.current.click()}
                className="flex items-center bg-white border rounded p-1"
              >
                <Palette className="w-4 h-4 mr-1" />
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: textColor }}
                ></div>
              </button>
              <input
                ref={colorInputRef}
                type="color"
                value={textColor}
                onChange={handleColorChange}
                className="absolute opacity-0 w-0 h-0"
              />
            </div>
          </div>
        </div>

        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable={true}
          onInput={handleContentChange}
          className="bg-white border border-gray-300 rounded-lg p-4 min-h-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ fontFamily }}
        ></div>

        {/* Custom Link Dialog */}
        {showLinkDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-96">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Insert Link</h3>
                <button
                  onClick={() => setShowLinkDialog(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link Text
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Display text for link"
                />
                {selectedText && (
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to use selected text: "{selectedText}"
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowLinkDialog(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInsertLink}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Insert
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default WordEditor;
