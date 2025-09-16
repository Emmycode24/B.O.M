import React, { useEffect, useState } from "react";
import bomData from "./bom_item.json";
import BomItemRow from "./Bomitem";
import { Plus, Save } from "lucide-react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';

export default function BomTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(bomData);
  }, []);

  // Recursive update
  const updateItem = (id, updates, items = data) => {
    return items.map((item) => {
      if (item.id === id) {
        return { ...item, ...updates };
      }
      if (item.children) {
        return { ...item, children: updateItem(id, updates, item.children) };
      }
      return item;
    });
  };

  // Recursive delete
  const deleteItem = (id, items = data) => {
    return items
      .filter((item) => item.id !== id)
      .map((item) =>
        item.children
          ? { ...item, children: deleteItem(id, item.children) }
          : item
      );
  };

  const handleUpdate = (id, updates) => {
    setData((prev) => updateItem(id, updates, prev));
  };

  const handleDelete = (id) => {
    setData((prev) => deleteItem(id, prev));
  };

  // Add a new item at root level
  const handleAdd = () => {
    const newItem = {
      id: Date.now().toString(),
      item_number: "NEW-ITEM",
      item_name: "New Item",
      status: "DEVELOPMENT",
      quantity: 1,
      creator: "EC",
      children: [],
    };
    setData((prev) => [...prev, newItem]);
  };

  // Handle drag & drop with dnd-kit
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = data.findIndex(item => item.id === active.id);
      const newIndex = data.findIndex(item => item.id === over.id);
      setData((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <div className="border rounded-lg shadow-sm bg-white">
      {/* Header Section */}
      <div className="flex justify-between items-center p-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold">Bill of Materials</h2>
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <Plus size={16} /> Add End Item
          </button>
          <button className="flex items-center gap-1 px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600">
            <Save size={16} /> Save as new eBOM version
          </button>
        </div>
      </div>

      {/* Table Header */}
      <div className="flex font-semibold bg-gray-100 border-b text-sm">
        <div className="px-2 py-2 w-6"></div>
        <div className="px-2 py-2 flex-1">Item Name</div>
        <div className="px-2 py-2 w-32">Status</div>
        <div className="px-2 py-2 w-32">Files / Viz / Tasks</div>
        <div className="px-2 py-2 w-20 text-right">Qty</div>
        <div className="px-2 py-2 w-20 text-center">Creator</div>
        <div className="px-2 py-2 w-12 text-center">Del</div>
      </div>

      {/* Table Body with Drag & Drop using dnd-kit */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={data.map(item => item.id)} strategy={verticalListSortingStrategy}>
          {data.map((item) => (
            <SortableBomItemRow
              key={item.id}
              id={item.id}
              item={item}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

// Sortable wrapper for BomItemRow
function SortableBomItemRow({ id, item, onUpdate, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <BomItemRow
        item={item}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </div>
  );
}
