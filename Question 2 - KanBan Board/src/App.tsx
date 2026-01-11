import KanbanCont from "./components/ui/KanbanCont";
import { kannBanContext } from "./store";
import { useContext } from "react";
import TodoAddModal from "./components/ui/TodoAddModal";
function App() {
  const {
    todo,
    handleDeletTodo,
    todoCount,
    inProgress,
    completed,
    completeCount,
    progressCount,
    handleDeleteInProgressTodo,
    handleDeleteCompleteTodo,
    handleModalOpen,
    handleAddFromModal,
    handleEditTodo,
    handleEditComplete,
    handleEditInProgress,
  } = useContext(kannBanContext);
  console.log(todo);
  return (
    <>
      <div className="w-full min-h-screen flex flex-col p-4 justify-start items-start">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">KanBan Board</h2>
        <section className="flex-wrap md:flex-nowrap w-full flex flex-row  justify-center gap-4 p-10">
          <KanbanCont
            bgColor="bg-blue-400"
            count={todoCount}
            title="Todo"
            data={todo}
            onDelete={handleDeletTodo}
            onAdd={handleModalOpen}
            onEdit={handleEditTodo}
          />
          <KanbanCont
            bgColor="bg-orange-400"
            count={progressCount}
            title="In Progress"
            data={inProgress}
            onDelete={handleDeleteInProgressTodo}
            onAdd={handleModalOpen}
            onEdit={handleEditInProgress}
          />
          <KanbanCont
            bgColor="bg-green-400"
            count={completeCount}
            title="Done"
            data={completed}
            onDelete={handleDeleteCompleteTodo}
            onAdd={handleModalOpen}
            onEdit={handleEditComplete}
          />
        </section>
        <TodoAddModal handleAdd={handleAddFromModal} />
      </div>
    </>
  );
}

export default App;
