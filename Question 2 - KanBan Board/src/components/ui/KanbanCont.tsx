import { FaPlus } from "react-icons/fa";
import TodoCont from "./TodoCont";
import { useContext } from "react";
import { kannBanContext } from "../../store";

interface contProps {
  title: string;
  count: number;
  bgColor: string;
  data: any;
  onDelete: any;
  onAdd: any;
  onEdit: any;
}

function KanbanCont({
  title,
  count,
  bgColor,
  data,
  onDelete,
  onAdd,
  onEdit,
}: contProps) {
  const { handleDrop } = useContext(kannBanContext);
  const columnKey =
    title === "Todo"
      ? "todo"
      : title === "In Progress"
      ? "inProgress"
      : "completed";
  const handleEdit = (id, newTitle) => {
    // This would be passed as a prop from App
    onEdit(id, newTitle);
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => handleDrop(columnKey)}
      className="h-[60vh] md:h-[80vh] w-full flex flex-col justify-start items-start gap-5 bg-slate-50 rounded-md"
    >
      <div
        className={`w-full h-[10%] ${bgColor} flex flex-row justify-between items-center py-10 px-3 text-white font-semibold`}
      >
        <div className="flex flex-row justify-center items-center gap-2 text-2xl">
          <span>{title}</span>
          <span className="w-6 h-6 px-1 py-2 flex flex-row justify-center items-center bg-transparent bg-white/20">
            {count}
          </span>
        </div>
        <div className="flex items-center justify-center">
          <button
            className="bg-slate-300 p-2 rounded hover:bg-slate-200 transition cursor-pointer"
            onClick={() => onAdd(columnKey)}
          >
            <FaPlus className="text-black" />
          </button>
        </div>
      </div>
      <div className="mx-5">
        <button
          className="flex flex-row justify-evenly items-center gap-2 bg-slate-300 py-2 px-1 rounded-sm cursor-pointer"
          onClick={() => onAdd(columnKey)}
        >
          <span>
            <FaPlus />
          </span>
          <span>Add Card</span>
        </button>
      </div>

      {/* mapping all the todo's here  */}

      {data.map((item) => (
        <TodoCont
          key={item.id}
          id={item.id}
          title={item.title}
          onDelete={onDelete}
          bgColor={title === "Done" ? "bg-green-300" : "bg-orange-300"}
          column={columnKey}
          onEdit={handleEdit}
        />
      ))}
    </div>
  );
}

export default KanbanCont;
