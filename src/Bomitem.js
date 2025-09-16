import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  FileText,
  Eye,
  ClipboardList,
  Trash2,
} from "lucide-react";

const statusColors = {
  RELEASED: "bg-green-200 text-green-800",
  DEVELOPMENT: "bg-blue-200 text-blue-800",
};

export default function BomItemRow({ item, level = 0, onUpdate, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingQty, setIsEditingQty] = useState(false);
  const [name, setName] = useState(item.item_name);
  const [qty, setQty] = useState(item.quantity);

  const hasChildren = item.children && item.children.length > 0;

  const handleSave = () => {
    onUpdate(item.id, { item_name: name, quantity: qty });
    setIsEditingName(false);
    setIsEditingQty(false);
  };

  return (
    <>
      <div className="flex items-center border-b text-sm">
        {/* Expand/Collapse Toggle */}
        <div
          className="w-6 cursor-pointer flex items-center justify-center"
          style={{ marginLeft: `${level * 20}px` }}
          onClick={() => hasChildren && setIsExpanded(!isExpanded)}
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
      {isExpanded &&
        hasChildren &&
        item.children.map((child) => (
          <BomItemRow
            key={child.id}
            item={child}
            level={level + 1}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
    </>
  );
}
