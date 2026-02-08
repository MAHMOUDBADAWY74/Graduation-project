import { PointerSensor, useDraggable } from "@dnd-kit/core";
import { forwardRef, memo } from "react";
import PropTypes from "prop-types";
import "./StickyNote.css";

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
      left: `${note.x}px`,
      top: `${note.y}px`,
      transform: transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : "none",
      transition: isDragging
        ? "box-shadow 0.2s"
        : "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.2s",
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`sticky-note${isDragging ? " dragging" : ""}`}
        aria-label={`Note ${note.id}`}
      >
        <div className="sticky-note-header">
          <strong
            className="sticky-note-move"
            {...listeners}
            {...attributes}
            aria-label="Drag handle"
          >
            Move
          </strong>
          <button
            onClick={() => onDelete(note.id)}
            className="sticky-note-delete"
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
          className="sticky-note-textarea"
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
