import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  FileText,
  Eye,
  ClipboardList,
  Trash2,
  Move,
} from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const statusColors = {
  RELEASED: "bg-green-200 text-green-800",
  DEVELOPMENT: "bg-blue-200 text-blue-800",
};

export default function BomItemRow({ item, level = 0, onUpdate, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(true
 );
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingQty, setIsEditingQty] = useState(false);
  const [name, setName] = useState(item.item_name);
  const [qty, setQty] = useState(item.quantity);

  const hasChildren = item.children && item.children.length > 0;

  // dnd-kit sortable hook for drag-and-drop
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: isDragging ? "#f3f4f6" : undefined,
  };

  const handleSave = () => {
    onUpdate(item.id, { item_name: name, quantity: qty });
    setIsEditingName(false);
    setIsEditingQty(false);
  };

   const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-center border-b text-sm"
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="w-6 flex items-center justify-center cursor-grab active:cursor-grabbing"
          style={{ marginLeft: `${level * 20}px` }}
        >
          <Move size={16} className="text-gray-400" />
        </div>

        {/* Expand/Collapse Toggle */}
        <div
  className={`w-6 flex items-center justify-center ${hasChildren ? "cursor-pointer" : "opacity-0"}`}
  onClick={hasChildren ? toggleExpand : undefined}
  role="button"
  aria-label={isExpanded ? "Collapse children" : "Expand children"}
  tabIndex={hasChildren ? 0 : -1}
>
  {hasChildren &&
    (isExpanded ? (
      <ChevronDown size={16} className="text-gray-600" />
    ) : (
      <ChevronRight size={16} className="text-gray-600" />
    ))}
</div>

        {/* Item Name (editable) */}
        <div className="py-2 px-2 flex-1">
          {isEditingName ? (
            <input
              className="border px-1 text-sm w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />
          ) : (
            <span
              className="cursor-pointer"
              onClick={() => setIsEditingName(true)}
            >
              {name}
            </span>
          )}
        </div>

        {/* Status Badge */}
        <div className="py-2 px-2 w-32">
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              statusColors[item.status] || "bg-gray-200 text-gray-800"
            }`}
          >
            {item.status}
          </span>
        </div>

        {/* Icons */}
        <div className="py-2 px-2 w-32 flex items-center gap-2 text-gray-500">
          <FileText size={16} />
          <Eye size={16} />
          <ClipboardList size={16} />
        </div>

        {/* Quantity (editable) */}
        <div className="py-2 px-2 w-20 text-right">
          {isEditingQty ? (
            <input
              type="number"
              className="border px-1 text-sm w-16 text-right"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              onBlur={handleSave}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />
          ) : (
            <span
              className="cursor-pointer"
              onClick={() => setIsEditingQty(true)}
            >
              {qty}
            </span>
          )}
        </div>

        {/* Creator */}
        <div className="py-2 px-2 w-20 text-center">{item.creator}</div>

        {/* Delete */}
        <div className="py-2 px-2 w-12 flex justify-center">
          <Trash2
            size={16}
            className="text-red-500 cursor-pointer"
            onClick={() => onDelete(item.id)}
          />
        </div>
      </div>

          {/* Render children recursively (only if expanded) */}
      {isExpanded && hasChildren && (
        <div
    style={{
      marginLeft: `${(level + 1) * 20}px`,
      borderLeft: "2px solid #e5e7eb",
      background: "#f9fafb",
      paddingLeft: "8px",
      transition: "background 0.2s",
    }}
    className="py-1"
  >
          {item.children.map((child) => (
            <BomItemRow
              key={child.id}
              item={child}
              level={level + 1}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </>
  );
}
