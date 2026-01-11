import { useContext, useState } from "react";
import { kannBanContext } from "../../store";

interface ModalProp {
  handleAdd: any;
}

function TodoAddModal({ handleAdd }: ModalProp) {
  const [value, setValue] = useState("");
  const { handleModalClose, isOpen } = useContext(kannBanContext);

  function handleValue(e) {
    setValue(e.target.value);
  }

  function handleAddNewTodo() {
    if (value.trim() === "") {
      return;
    }
    const newData = {
      id: crypto.randomUUID(),
      title: value,
    };

    handleAdd(newData);
    setValue("");
    handleModalClose();
  }

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      handleAddNewTodo();
    } else if (e.key === "Escape") {
      handleModalClose();
    }
  }

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        onClick={handleModalClose}
        aria-hidden="true"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="
            w-full max-w-md
            bg-white
            rounded-2xl shadow-2xl
            flex flex-col gap-6 p-6
            pointer-events-auto
            animate-in zoom-in-95 fade-in duration-200
            border border-slate-200
          "
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 id="modal-title" className="text-2xl font-bold text-slate-800">
              Add New Todo
            </h3>
            <button
              onClick={handleModalClose}
              className="
                text-slate-400 hover:text-slate-600
                transition-colors
                p-1 rounded-lg hover:bg-slate-100
              "
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="todo-input"
              className="block text-sm font-medium text-slate-700"
            >
              Title
            </label>
            <input
              id="todo-input"
              type="text"
              className="
                w-full px-4 py-3
                rounded-lg
                bg-slate-50
                border border-slate-200
                text-slate-900
                placeholder:text-slate-400
                outline-none
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-all
              "
              placeholder="Enter your todo title"
              value={value}
              onChange={handleValue}
              onKeyDown={handleKeyPress}
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              className="
                px-5 py-2.5
                rounded-lg
                bg-slate-100
                text-slate-700 font-medium
                hover:bg-slate-200
                transition-colors
                focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2
              "
              onClick={handleModalClose}
            >
              Cancel
            </button>
            <button
              className="
                px-5 py-2.5
                rounded-lg
                bg-blue-500
                text-white font-medium
                hover:bg-blue-600
                active:bg-blue-700
                transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              onClick={handleAddNewTodo}
              disabled={value.trim() === ""}
            >
              Add Todo
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default TodoAddModal;
