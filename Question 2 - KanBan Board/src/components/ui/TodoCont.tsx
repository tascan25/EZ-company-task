import { RiDeleteBinLine } from "react-icons/ri";
import { useContext, useState } from "react";
import { kannBanContext } from "../../store";

interface todoContProps {
  id: string;
  title: string;
  onDelete: any;
  bgColor: string;
  column: string;
  onEdit: (id: string, newTitle: string) => void;
}

function TodoCont({
  id,
  title,
  onDelete,
  bgColor,
  column,
  onEdit,
}: todoContProps) {
  const { handleDragStart } = useContext(kannBanContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);

  function handleDoubleClick() {
    setIsEditing(true);
  }

  function handleBlur() {
    if (editValue.trim() !== "") {
      onEdit(id, editValue.trim());
    } else {
      setEditValue(title);
    }
    setIsEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleBlur();
    } else if (e.key === "Escape") {
      setEditValue(title);
      setIsEditing(false);
    }
  }

  return (
    <div
      draggable={!isEditing}
      onDragStart={() => handleDragStart({ id, title }, column)}
      className="mx-5 rounded-sm px-2 py-3 flex flex-row justify-start items-center gap-4 bg-slate-200 w-[90%] cursor-grab"
    >
      <div className={`h-full w-[1%] rounded-xl ${bgColor}`}></div>
      <div className="flex-1 flex flex-row justify-between items-center">
        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="flex-1 px-2 py-1 bg-white border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <span
            onDoubleClick={handleDoubleClick}
            className="cursor-text hover:text-blue-600 transition-colors"
            title="Double-click to edit"
          >
            {title}
          </span>
        )}
        <button
          className="w-8 h-8 rounded-full cursor-pointer flex items-center justify-center hover:bg-red-100 transition-colors"
          onClick={() => onDelete(id)}
        >
          <RiDeleteBinLine className="text-red-500" />
        </button>
      </div>
    </div>
  );
}

export default TodoCont;
