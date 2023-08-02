import { useDroppable } from "@dnd-kit/core";
import DraggableComponent from "./DraggableComponent";

interface KanbanLaneProps {
  title: string;
  items: { id: string; name: string }[];
}

export default function EditEmailContainer({ title, items }: KanbanLaneProps) {
  const { setNodeRef } = useDroppable({
    id: title,
    data: {
      title,
      items,
    },
  }); // added 'data' obj in - not sure if necessary
  return (
    <div>
      <div>
        {items.map((item, key) => (
          <DraggableComponent
            title={item.name}
            itemId={item.id}
            key={key}
            index={key}
            parent={title}
          />
        ))}
      </div>
    </div>
  );
}
