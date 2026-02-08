import { ReactReader } from "react-reader";
import { useState, useRef, useEffect } from "react";
import { HighlightSidebar } from "./HighlightFeatures";
import { BookReaderFeatures } from "./BookReaderFeatures";
import StickyNote from "./stickynotes/StickyNote";
import { DndContext } from "@dnd-kit/core";
import DOMPurify from "dompurify";
import "./BookViewer.css";
import PropTypes from "prop-types";

const getStorageKey = (userId, bookId, key) => `${userId}_${bookId}_${key}`;

const themes = {
  light: {
    body: { background: "#fff", color: "#222" },
    readerArea: { background: "#fff", color: "#222" },
  },
  dark: {
    body: { background: "#181a1b", color: "#e8e6e3" },
    readerArea: { background: "#181a1b", color: "#e8e6e3" },
  },
};

const highlightColors = [
  { name: "Yellow", color: "#ffe066" },
  { name: "Pink", color: "#ffadad" },
  { name: "Green", color: "#caffbf" },
  { name: "Blue", color: "#9bf6ff" },
  { name: "Purple", color: "#bdb2ff" },
];

const customFonts = [
  { name: "Default", fontFamily: "inherit" },
  { name: "Serif", fontFamily: "serif" },
  { name: "Sans-serif", fontFamily: "sans-serif" },
  { name: "Georgia", fontFamily: "Georgia, serif" },
  { name: "OpenDyslexic", fontFamily: "'OpenDyslexic', Arial, sans-serif" },
];

const supportedLanguages = [
  { code: "en", name: "English" },
  { code: "ar", name: "Arabic" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "zh-cn", name: "Chinese (Simplified)" },
  { code: "hi", name: "Hindi" },
  { code: "tr", name: "Turkish" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
];

const MAX_STICKY_NOTES = 10;

const BookViewer = ({ id, userId }) => {
  const [location, setLocation] = useState(() => {
    return (
      localStorage.getItem(getStorageKey(userId, id, "epub-location")) ||
      undefined
    );
  });
  const [theme, setTheme] = useState(
    () =>
      localStorage.getItem(getStorageKey(userId, id, "epub-theme")) || "light"
  );
  const [selectionText, setSelectionText] = useState("");
  const [selectedCfiRange, setSelectedCfiRange] = useState(null);
  const [highlightColor, setHighlightColor] = useState(
    highlightColors[0].color
  );
  const [highlights, setHighlights] = useState(() => {
    const saved = localStorage.getItem(
      getStorageKey(userId, id, "epub-highlights")
    );
    return saved ? JSON.parse(saved) : [];
  });
  const [showSidebar, setShowSidebar] = useState(false);
  const [fontFamily, setFontFamily] = useState(customFonts[0].fontFamily);
  const [stickyNotes, setStickyNotes] = useState(() => {
    const saved = localStorage.getItem(
      getStorageKey(userId, id, "epub-sticky-notes")
    );
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [audioPath, setAudioPath] = useState("");
  const [ttsError, setTtsError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);
  const renditionRef = useRef(null);
  const [bookUrl, setBookUrl] = useState("");

  // Load book
  useEffect(() => {
    const fetchBookUrl = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://localhost:7159/api/BookDownload/${id}`
        );
        if (!response.ok) throw new Error("Failed to load book");
        const data = await response.json();
        console.log("🟩 data: ", data);

        setBookUrl(data.path);
      } catch (error) {
        console.error("Error loading book:", error);
        setTtsError("Failed to load book");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookUrl();
  }, [id]);

  // Save highlights to localStorage
  useEffect(() => {
    localStorage.setItem(
      getStorageKey(userId, id, "epub-highlights"),
      JSON.stringify(highlights)
    );
  }, [highlights, userId, id]);

  // Save sticky notes to localStorage
  useEffect(() => {
    localStorage.setItem(
      getStorageKey(userId, id, "epub-sticky-notes"),
      JSON.stringify(stickyNotes)
    );
  }, [stickyNotes, userId, id]);

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem(getStorageKey(userId, id, "epub-theme"), theme);
  }, [theme, userId, id]);

  // Update location
  const handleLocationChanged = (loc) => {
    setLocation(loc);
    localStorage.setItem(getStorageKey(userId, id, "epub-location"), loc);
  };

  // Apply theme and font
  const applyThemeAndFont = (rendition, theme, fontFamily) => {
    rendition.themes.select(theme);
    rendition.themes.font(fontFamily);
  };

  const handleThemeChange = (mode) => {
    setTheme(mode);
    if (renditionRef.current) {
      applyThemeAndFont(renditionRef.current, mode, fontFamily);
    }
  };

  const handleFontChange = (font) => {
    setFontFamily(font);
    if (renditionRef.current) {
      applyThemeAndFont(renditionRef.current, theme, font);
    }
  };

  // Add highlight with validation
  const addHighlight = () => {
    if (selectionText && selectedCfiRange && renditionRef.current) {
      console.log("Adding highlight:", {
        selectedCfiRange,
        selectionText,
        highlightColor,
      });
      try {
        const range = renditionRef.current.getRange(selectedCfiRange);
        if (range) {
          renditionRef.current.annotations.add(
            "highlight",
            selectedCfiRange,
            {},
            null,
            "highlight",
            { fill: highlightColor, "fill-opacity": "0.5" }
          );
          setHighlights((prev) => [
            ...prev,
            {
              cfiRange: selectedCfiRange,
              text: selectionText,
              color: highlightColor,
            },
          ]);
          console.log("Highlight added successfully");
          setSelectionText("");
          setSelectedCfiRange(null);
        } else {
          console.error("Invalid cfiRange:", selectedCfiRange);
        }
      } catch (error) {
        console.error("Error adding highlight:", error);
      }
    } else {
      console.warn("Missing required data for highlight:", {
        selectionText,
        selectedCfiRange,
        rendition: renditionRef.current,
      });
    }
  };

  const handleRendition = (rendition) => {
    renditionRef.current = rendition;
    console.log("Rendition initialized:", rendition);
    rendition.themes.register("light", themes.light);
    rendition.themes.register("dark", themes.dark);
    applyThemeAndFont(rendition, theme, fontFamily);

    rendition.on("rendered", () => {
      console.log("Rendition rendered, applying highlights:", highlights);
      highlights.forEach((h) => {
        try {
          if (!rendition.annotations._annotations[h.cfiRange]) {
            rendition.annotations.add(
              "highlight",
              h.cfiRange,
              {},
              null,
              "highlight",
              { fill: h.color, "fill-opacity": "0.5" }
            );
            console.log("Restored highlight:", h.cfiRange);
          }
        } catch (error) {
          console.error("Error restoring highlight:", h.cfiRange, error);
        }
      });
    });

    rendition.on("selected", (cfiRange, contents) => {
      console.log("Text selected:", { cfiRange, contents });
      const text =
        contents.window.getSelection &&
        contents.window.getSelection().toString();
      if (text) {
        const cleanText = DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
        console.log("Cleaned selected text:", cleanText);
        setSelectionText(cleanText);
        setSelectedCfiRange(cfiRange);
      } else {
        console.warn("No text selected");
      }
    });
  };

  const removeHighlight = (cfiRange) => {
    setHighlights((prev) => prev.filter((h) => h.cfiRange !== cfiRange));
    if (renditionRef.current) {
      renditionRef.current.annotations.remove(cfiRange, "highlight");
    }
  };

  const showHighlight = (cfiRange) => {
    if (renditionRef.current) {
      renditionRef.current.display(cfiRange);
    }
  };

  const addStickyNote = (x = 100, y = 100) => {
    if (stickyNotes.length >= MAX_STICKY_NOTES) {
      setTtsError("Maximum limit of sticky notes (10) reached");
      return;
    }
    console.log("Adding sticky note at:", { x, y });
    setStickyNotes((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: "",
        x,
        y,
      },
    ]);
  };

  const deleteStickyNote = (id) => {
    setStickyNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const updateStickyNoteText = (id, text) => {
    setStickyNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, text } : n))
    );
  };

  const handleStickyDragEnd = (event) => {
    const { active, delta } = event;
    setStickyNotes((prev) =>
      prev.map((n) =>
        n.id === active.id ? { ...n, x: n.x + delta.x, y: n.y + delta.y } : n
      )
    );
  };

  // Handle double-click to add sticky note
  const handleDoubleClick = (e) => {
    const isFromReader = e.target.closest(".book-reader-container");
    console.log("Double-click detected:", {
      isFromReader,
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    });
    if (!isFromReader) {
      addStickyNote(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    }
  };

  // Convert text to speech
  const handleTextToSpeech = async () => {
    if (!selectionText) {
      setTtsError("Please select text first");
      return;
    }
    setTtsError("");
    setAudioPath("");
    try {
      const response = await fetch("http://localhost:5000/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: selectionText,
          lang: selectedLanguage,
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to convert text to speech");
      const fullAudioPath = `http://localhost:5000${data.audio_path}`;
      setAudioPath(fullAudioPath);
    } catch (error) {
      setTtsError(`Error: ${error.message}`);
    }
  };

  // Play audio automatically
  useEffect(() => {
    if (audioPath && audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
        setTtsError("Failed to play audio, please try again");
      });
      audioRef.current.focus();
    }
  }, [audioPath]);

  // Hide selected text after 10 seconds
  useEffect(() => {
    if (selectionText) {
      const timeout = setTimeout(() => {
        setSelectionText("");
        setSelectedCfiRange(null);
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [selectionText]);

  return (
    <div className="app-root">
      <HighlightSidebar
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        highlights={highlights}
        showHighlight={showHighlight}
        removeHighlight={removeHighlight}
      />
      <div className="app-main-content" onDoubleClick={handleDoubleClick}>
        {isLoading && (
          <div style={{ position: "absolute", top: 50, left: 50, zIndex: 40 }}>
            Loading book...
          </div>
        )}
        <button
          className="app-add-sticky-btn"
          style={{ position: "absolute", top: 16, left: 16, zIndex: 30 }}
          onClick={() => addStickyNote(120, 120)}
        >
          + Add Sticky Note
        </button>
        <BookReaderFeatures
          theme={theme}
          handleThemeChange={handleThemeChange}
          customFonts={customFonts}
          fontFamily={fontFamily}
          handleFontChange={handleFontChange}
          setShowSidebar={setShowSidebar}
          highlightColors={highlightColors}
          highlightColor={highlightColor}
          setHighlightColor={setHighlightColor}
        />
        <DndContext onDragEnd={handleStickyDragEnd}>
          {stickyNotes.map((note) => (
            <StickyNote
              key={note.id}
              note={note}
              onDelete={deleteStickyNote}
              onTextChange={updateStickyNoteText}
            />
          ))}
        </DndContext>
        {selectionText && (
          <div className="app-selection-text">
            <strong>Selected Text:</strong> {selectionText}
            <div style={{ marginTop: 8 }}>
              <span style={{ fontSize: 12, color: "#888" }}>
                Highlight Color:{" "}
              </span>
              <span
                style={{
                  display: "inline-block",
                  width: 16,
                  height: 16,
                  background: highlightColor,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                  verticalAlign: "middle",
                }}
              />
            </div>
            <div style={{ marginTop: 8 }}>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                style={{ marginRight: 8 }}
              >
                {supportedLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <button onClick={handleTextToSpeech} style={{ marginRight: 8 }}>
                Convert to Speech
              </button>
              <button onClick={addHighlight}>Add Highlight</button>
            </div>
            {ttsError && (
              <div style={{ color: "red", marginTop: 8 }}>{ttsError}</div>
            )}
          </div>
        )}
        <div className="book-reader-container">
          {bookUrl && !isLoading && (
            <ReactReader
              url={`https://localhost:7159/${bookUrl}`}
              location={location}
              locationChanged={handleLocationChanged}
              getRendition={handleRendition}
              epubInitOptions={{
                openAs: "epub",
                sandbox: "allow-same-origin allow-scripts",
              }}
            />
          )}
          <div className="audio-player" style={{ marginTop: 10 }}>
            {audioPath && (
              <audio
                ref={audioRef}
                controls
                src={audioPath}
                style={{ width: "100%", maxWidth: "500px" }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

BookViewer.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  userId: PropTypes.string.isRequired,
};

export default BookViewer;
