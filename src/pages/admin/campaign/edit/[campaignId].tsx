import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
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

export default function CampaignBuilder() {
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

  const handleDragEnd = (e: DragEndEvent) => {
    // setIsDragInProgress(false);
    const { active, over } = e;

    console.log(active, over);

    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const activeIndex = items
          .map((mapItem) => mapItem.id)
          .indexOf(String(active.id));
        const overIndex = items
          .map((mapItem) => mapItem.id)
          .indexOf(String(over.id));
        return arrayMove(items, activeIndex, overIndex);
      });
    }
  };

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
            <div className="min-w-[600px] max-w-[600px] bg-red-500">
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={blocks}
                  strategy={verticalListSortingStrategy}
                >
                  {blocks.map((item) => (
                    <SortableItem key={item.id} id={item.id}>
                      <div className="p-6">{item.id}</div>
                    </SortableItem>
                  ))}
                </SortableContext>
              </DndContext>
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
