import { createContext, useState } from "react";

export const kannBanContext = createContext({});

export default function KanBanContextProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState(null);
  const [todo, setTodo] = useState([
    {
      id: crypto.randomUUID(),
      title: "Create Initial Project Plan",
    },
    {
      id: crypto.randomUUID(),
      title: "Design Landing Page",
    },
    {
      id: crypto.randomUUID(),
      title: "Review codebase structure",
    },
  ]);
  const [completed, setComplete] = useState([
    {
      id: crypto.randomUUID(),
      title: "Organize project repositry",
    },
    {
      id: crypto.randomUUID(),
      title: "Write API documentation",
    },
  ]);
  const [inProgress, setInProgress] = useState([
    {
      id: crypto.randomUUID(),
      title: "Implement Authentication",
    },
    {
      id: crypto.randomUUID(),
      title: "Set up Database Schema",
    },
    {
      id: crypto.randomUUID(),
      title: "Fix Navbar Bugs",
    },
  ]);

  const [dragItem, setDragItem] = useState(null); // this is the state for keeping the track of which item is going to be dragged
  const [dragSource, setDragSource] = useState(null); // this is the state for keeping the track of the source from which todo is being dragged

  function handleDeletTodo(id) {
    setTodo((prev) => prev.filter((item) => item.id !== id));
  }

  function handleDeleteInProgressTodo(id) {
    setInProgress((prev) => prev.filter((item) => item.id !== id));
  }

  function handleDeleteCompleteTodo(id) {
    setComplete((prev) => prev.filter((item) => item.id !== id));
  }

  function handleAddTodo(newData) {
    setTodo((prev) => [...prev, newData]);
  }

  function handleAddInProgressTodo(newData) {
    setInProgress((prev) => [...prev, newData]);
  }

  function handleAddCompleteTodo(newData) {
    setComplete((prev) => [...prev, newData]);
  }

  function handleAddFromModal(newData) {
    if (modalTarget === "todo") {
      handleAddTodo(newData);
    } else if (modalTarget === "inProgress") {
      handleAddInProgressTodo(newData);
    } else if (modalTarget === "completed") {
      handleAddCompleteTodo(newData);
    }
  }

  function handleEditTodo(id, newTitle) {
    setTodo((prev) =>
      prev.map((item) => (item.id === id ? { ...item, title: newTitle } : item))
    );
  }

  function handleEditInProgress(id, newTitle) {
    setInProgress((prev) =>
      prev.map((item) => (item.id === id ? { ...item, title: newTitle } : item))
    );
  }

  function handleEditComplete(id, newTitle) {
    setComplete((prev) =>
      prev.map((item) => (item.id === id ? { ...item, title: newTitle } : item))
    );
  }

  function handleDragStart(item, source) {
    setDragItem(item);
    setDragSource(source);
  }

  function handleDrop(target: string) {
    if (!dragItem || !dragSource || dragSource === target) {
      return;
    }

    const removeMap = {
      todo: setTodo,
      inProgress: setInProgress,
      completed: setComplete,
    };

    const addMap = {
      todo: setTodo,
      inProgress: setInProgress,
      completed: setComplete,
    };

    removeMap[dragSource]((prev) =>
      prev.filter((item) => item.id !== dragItem.id)
    );

    addMap[target]((prev) => [...prev, dragItem]);

    setDragItem(null);
    setDragSource(null);
  }

  function handleModalOpen(target) {
    console.log("fuck her");
    setModalTarget(target);
    setIsOpen(true);
  }

  function handleModalClose() {
    setIsOpen(false);
  }

  return (
    <kannBanContext.Provider
      value={{
        todo,
        handleDeletTodo,
        setTodo,
        setComplete,
        setInProgress,
        completed,
        inProgress,
        todoCount: todo.length,
        completeCount: completed.length,
        progressCount: inProgress.length,
        handleDragStart,
        handleDrop,
        handleDeleteInProgressTodo,
        handleDeleteCompleteTodo,
        handleModalOpen,
        handleModalClose,
        handleAddFromModal,
        handleEditTodo,
        handleEditComplete,
        handleEditInProgress,
        isOpen,
      }}
    >
      {children}
    </kannBanContext.Provider>
  );
}
