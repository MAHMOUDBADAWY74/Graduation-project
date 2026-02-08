import { PointerSensor, useDraggable } from "@dnd-kit/core";
import { forwardRef, memo } from "react";
import PropTypes from "prop-types";

const StickyNote = memo(
  forwardRef(({ note, onDelete, onTextChange }, ref) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
      useDraggable({
        id: note.id,
        sensors: [
          {
            sensor: PointerSensor,
            options: {
              activationConstraint: {
                delay: 100,
                tolerance: 5,
              },
            },
          },
        ],
      });

    const style = {
      position: "absolute",
      left: `${note.x}px`,
      top: `${note.y}px`,
      transform: transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : "none",
      background: "linear-gradient(145deg, #fffecb, #f7f3a6)",
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "12px",
      width: "180px",
      zIndex: isDragging ? 1000 : 10,
      boxShadow: "3px 3px 8px rgba(0,0,0,0.15)",
      cursor: isDragging ? "grabbing" : "grab",
      transition: isDragging
        ? "none"
        : "transform 0.2s ease, box-shadow 0.2s ease",
    };

    return (
      <div ref={setNodeRef} style={style} aria-label={`Note ${note.id}`}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <strong
            style={{
              fontSize: "14px",
              color: "#333",
              cursor: "move",
              padding: "2px 4px",
              borderRadius: "4px",
              background: "rgba(0,0,0,0.05)",
            }}
            {...listeners}
            {...attributes}
            aria-label="Drag handle"
          >
            Move
          </strong>
          <button
            onClick={() => onDelete(note.id)}
            style={{
              background: "none",
              border: "none",
              color: "#e63946",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer",
              padding: "0 4px",
            }}
            aria-label="Delete note"
          >
            ❌
          </button>
        </div>
        <textarea
          ref={ref}
          value={note.text ?? ""}
          onChange={(e) => onTextChange(note.id, e.target.value)}
          rows={3}
          placeholder="New Note"
          style={{
            width: "100%",
            resize: "none",
            background: "transparent",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "14px",
            outline: "none",
            borderStyle: "none",
            padding: "6px",
            color: "#333",
          }}
          aria-label="Note text"
        />
      </div>
    );
  })
);
StickyNote.displayName = "StickyNote";

StickyNote.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onTextChange: PropTypes.func.isRequired,
};

export default StickyNote;
