import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  rectIntersection,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { useRouter } from "next/router";
import { useState } from "react";
import Button from "~/components/Button";
import CampaignEditNavBar from "~/components/CampaignEditNavBar";
import CampaignEditorSidebar from "~/components/CampaignEditorSidebar";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "~/components/SortableItem";
import DraggableComponent from "~/components/DraggableComponent";
import EditEmailContainer from "~/components/EditEmailContainer";

export default function CampaignBuilder() {
  const [currentOverId, setCurrentOverId] = useState<
    UniqueIdentifier | undefined
  >();

  // NEW

  const [newBlocks, setNewBlocks] = useState([
    { id: "joh", name: "john" },
    { id: "jer", name: "Jeremy" },
    { id: "t", name: "Tim" },
    { id: "M", name: "Matt" },
  ]);

  const [newComponents, setNewComponents] = useState<any>([
    { id: "10", name: "text" },
    { id: "20", name: "heading" },
  ]);

  // console.log({ newComponents });
  console.log({ newBlocks });

  const handleNewDragEnd = (e: DragEndEvent) => {
    // console.log(e); // look at over.current.value
    // const overContainer =
    //   e.over?.data.current?.sortable.containerId || e.over?.id;
    const over = e.over?.id;
    const activeIndex = e.active.data.current?.index;
    const container = e.over?.id;
    const title = e.active.data.current?.title ?? "";
    const id = e.active.data.current?.itemId ?? "";
    const index = e.active.data.current?.index ?? 0;
    const parent = e.active.data.current?.parent ?? "Components";
    const activeId = e.active.id;

    // console.log("CONTAINER", container);
    // console.log("TITLE", title);
    // console.log("INDEX", index);
    // console.log("PARENT", parent);
    // console.log("ID", id);
    // console.log("activeIndex", activeIndex);
    // console.log("over", over);

    if (container === "blocks" && parent !== container) {
      setNewBlocks([
        ...newBlocks,
        { id: String(Math.random() * 200), name: title },
      ]);
    }
  };

  //

  const router = useRouter();

  const [tabs, setTabs] = useState([
    {
      name: "Content",
      current: true,
    },
    { name: "Global Styles", current: false },
  ]);

  const [blocks, setBlocks] = useState([
    { id: "1", name: "john" },
    { id: "2", name: "mike" },
  ]);

  function handleSortableDragEnd(event: any) {
    // DragEndEvent
    const { active, over } = event;

    // console.log("OVERID", over.id);
    // console.log("ACTIVE", active.id);

    // check if active exists in array. If not, add.

    // const newItem: { id: string; name: string }[] = [];

    // if (active.id !== over.id) {
    //   const activeIsInBlocksArray = newBlocks.find(
    //     (block) => block.id === active.id
    //   );
    //   if (!activeIsInBlocksArray) {
    //     const currentItem = newBlocks.filter((block) => block.id === active.id);
    //     newItem.push({ id: active.id, name: currentItem.name });
    //   }
    //   console.log({ newItem });
    //   // const newItemsState = [...blocks, ...newItem];
    //   setNewBlocks((items) => {
    //     const activeIndex = items
    //       .map((mapItem) => mapItem.id)
    //       .indexOf(active.id);
    //     const overIndex = items.map((mapItem) => mapItem.id).indexOf(over.id);
    //     return arrayMove(items, activeIndex, overIndex);
    //   });

    // if (blocks.some((block) => block.id === active.id)) {
    //   console.log("TRUE");
    // }

    const activeIsInBlocksArray = newBlocks.some(
      (block) => block.id === active.id
    );

    console.log("IS IN BLOCKS ARR", activeIsInBlocksArray);

    // re-ordering logic

    if (active.id !== over.id) {
      if (activeIsInBlocksArray) {
        setNewBlocks((items) => {
          const activeIndex = items
            .map((mapItem) => mapItem.id)
            .indexOf(active.id);
          const overIndex = items.map((mapItem) => mapItem.id).indexOf(over.id);
          return arrayMove(items, activeIndex, overIndex);
        });
      } else {
        console.log("RUNNINGNGNGNGNGNGN");
        const currentItem = newComponents.filter(
          (comp: any) => comp.id === active.id
        );
        setNewBlocks((prev) => {
          return [
            ...prev,
            { id: String(Math.random() * 200), name: currentItem[0].name },
          ];
        });
      }
    }
  }

  return (
    <div className="flex min-h-[100vh] flex-col">
      <CampaignEditNavBar router={router} />
      <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:gap-0">
        <div className="min-w-[400px] max-w-[400px] border-r border-gray-200 bg-white py-2">
          <CampaignEditorSidebar tabs={tabs} setTabs={setTabs} />
        </div>
        <div className="flex-1 bg-gray-50">
          <div className="flex h-[62px] items-center justify-end border-b border-gray-200 bg-white px-6">
            <Button appearance="secondary" size="sm">
              Send Preview
            </Button>
          </div>
          <div className="flex justify-center pt-12">
            <div className="bg-yellow-500">
              {/*<DndContext
                modifiers={[restrictToVerticalAxis]}
                collisionDetection={closestCenter}
                onDragEnd={handleSortableDragEnd}
                id="1"
              >
                <SortableContext
                  items={newBlocks.map((item) => item.name)}
                  strategy={verticalListSortingStrategy}
                >
                  {newBlocks.map((item) => (
                    <SortableItem id={item.id}>{item.name}</SortableItem>
                  ))}
                </SortableContext>
              </DndContext> */}
            </div>
            <div className="min-w-[600px] max-w-[600px] bg-red-500">
              <DndContext
                modifiers={[restrictToVerticalAxis]}
                collisionDetection={closestCenter}
                onDragEnd={handleSortableDragEnd}
                onDragOver={(e) => {
                  setCurrentOverId(e.over?.id);
                  // console.log("OVER", e);
                }}
                id="1"
              >
                <SortableContext
                  items={newBlocks.map((item) => item.name)}
                  strategy={verticalListSortingStrategy}
                >
                  {newBlocks.map((item) => (
                    <SortableItem id={item.id}>{item.name}</SortableItem>
                  ))}
                </SortableContext>
                <br />
                <EditEmailContainer title="components" items={newComponents} />
              </DndContext>
              {/* <DndContext
                id="0"
                collisionDetection={rectIntersection}
                onDragEnd={handleNewDragEnd}
              >
                <EditEmailContainer title="blocks" items={newBlocks} />

                <br />
                <EditEmailContainer title="components" items={newComponents} />
              </DndContext> */}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-4 border-t border-gray-200 bg-white p-2 text-xs text-gray-600">
        <p>Support</p>
        <p>Documentation</p>
      </div>
    </div>
  );
}
