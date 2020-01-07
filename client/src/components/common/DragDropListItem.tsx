import React from "react";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot
} from "react-beautiful-dnd";

interface Props {
  children: (
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot
  ) => React.ReactElement;
  itemId: string;
  index: number;
}

const DragDropListItem: React.FC<Props> = ({ children, itemId, index }) => {
  return (
    <Draggable draggableId={itemId} index={index}>
      {(provided, snapshot) => (
        <div {...provided.draggableProps} ref={provided.innerRef}>
          {children(provided, snapshot)}
        </div>
      )}
    </Draggable>
  );
};

export default DragDropListItem;
