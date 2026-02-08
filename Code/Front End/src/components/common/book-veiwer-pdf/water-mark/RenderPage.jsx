import PropTypes from "prop-types";

import {
  MinimalButton,
  Position,
  RotateDirection,
  Tooltip,
} from "@react-pdf-viewer/core";
import {
  RotateForwardIcon,
  RotateBackwardIcon,
} from "@react-pdf-viewer/rotate";

const TOOLTIP_OFFSET = { left: 0, top: 8 };

export const RenderPage = (props) => {
  return (
    <>
      {props.canvasLayer.children}

      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          transform: "translate(100%, 0)",
          zIndex: 1,
          padding: "0.25rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Tooltip
            position={Position.BottomCenter}
            target={
              <MinimalButton
                onClick={() => props.onRotatePage(RotateDirection.Forward)}
              >
                <RotateForwardIcon />
              </MinimalButton>
            }
            content={() => "Rotate clockwise"}
            offset={TOOLTIP_OFFSET}
          />
          <Tooltip
            position={Position.BottomCenter}
            target={
              <MinimalButton
                onClick={() => props.onRotatePage(RotateDirection.Backward)}
              >
                <RotateBackwardIcon />
              </MinimalButton>
            }
            content={() => "Rotate counterclockwise"}
            offset={TOOLTIP_OFFSET}
          />
        </div>
      </div>

      {props.annotationLayer.children}

      {props.textLayer.children}
    </>
  );
};
RenderPage.propTypes = {
  canvasLayer: PropTypes.shape({
    children: PropTypes.node.isRequired,
  }).isRequired,
  textLayer: PropTypes.shape({
    children: PropTypes.node.isRequired,
  }).isRequired,
  annotationLayer: PropTypes.shape({
    children: PropTypes.node.isRequired,
  }).isRequired,
  onRotatePage: PropTypes.func.isRequired,
};
