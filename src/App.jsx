import { useState, useEffect, useRef } from "react";
import SearchBar from "./components/SearchBar";
import TodoList from "./components/TodoList";
import AddTodoButton from "./components/AddTodoButton";
import AddTodoModal from "./components/AddTodoModal";
import EditTodoModal from "./components/EditTodoModal";

function App() {
  const [todos, setTodos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState(null);
  const [lastDeleted, setLastDeleted] = useState(null);
  const [showUndo, setShowUndo] = useState(false);
  const deleteIntervalRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const [countdown, setCountdown] = useState(5);
  const apiUrl = `${import.meta.env.VITE_API_URL}api/v1`;

  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored) return stored;
      if (window.matchMedia("(prefers-color-scheme: dark)").matches)
        return "dark";
    }
    return "light";
  });

  useEffect(() => {
    setLoading(true);
    fetch(`${apiUrl}/todos`)
      .then((res) => res.json())
      .then((data) => {
        setTodos(
          data.map((todo) => ({
            id: todo.id,
            text: todo.title,
            done: todo.completed,
          }))
          .sort((a, b)=> a.id - b.id)
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);


  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);


  useEffect(() => {
    console.log(theme);
    document.documentElement.classList.toggle(
      "dark",
      localStorage.theme === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  }, [theme]);

  const handleDeleteTodo = (id) => {
    const index = todos.findIndex((todo) => todo.id === id);
    const deletedTodo = todos[index];
    if (!deletedTodo) return;

    setTodos((prev) => prev.filter((todo) => todo.id !== id));

    setLastDeleted({ todo: deletedTodo, index });
    setShowUndo(true);
    setCountdown(5);

    if (deleteIntervalRef.current) {
      clearInterval(deleteIntervalRef.current);
    }

    deleteIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(deleteIntervalRef.current);
          deleteIntervalRef.current = null;
          setShowUndo(false);

          fetch(`${apiUrl}/todos/${id}`, {
            method: "DELETE",
          }).catch((err) => console.error("Delete error:", err));

          setLastDeleted(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleUndo = () => {
    if (deleteIntervalRef.current) {
      clearInterval(deleteIntervalRef.current);
      deleteIntervalRef.current = null;
    }

    if (lastDeleted) {
      setTodos((prev) => {
        const restored = [...prev];
        restored.splice(lastDeleted.index, 0, lastDeleted.todo);
        return restored;
      });
    }

    setLastDeleted(null);
    setShowUndo(false);
    setCountdown(0);
  };

  const handleAddTodo = async (text) => {
    if (!text.trim()) return;

    const tempId = Date.now();
    const optimisticTodo = { id: tempId, text: text.trim(), done: false };

    setTodos((prev) => [...prev, optimisticTodo]);

    try {
      const res = await fetch(`${apiUrl}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: text.trim(), completed: false }),
      });
      const newTodo = await res.json();

      setTodos((prev) =>
        prev.map((t) => (t.id === tempId ? { ...t, id: newTodo.id } : t))
      );
    } catch (err) {
      console.error(err);
      setTodos((prev) => prev.filter((t) => t.id !== tempId));
    }
  };
  
const handleToggleTodo = async (id) => {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;

  const previousDone = todo.done;
  const newDone = !todo.done;

  setTodos((prev) =>
    prev.map((t) => (t.id === id ? { ...t, done: newDone } : t))
  );

  try {
    const res = await fetch(`${apiUrl}/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: todo.text,
        completed: newDone,
      }),
    });

    if (!res.ok) throw new Error("Failed to update todo");

    const updated = await res.json();

    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: updated.completed } : t))
    );
  } catch (err) {
    console.error("Toggle error:", err);
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: previousDone } : t))
    );
  }
};


  const handleStartEdit = (todo) => {
    setTodoToEdit(todo);
    setIsEditOpen(true);
  };

  const handleEditTodo = (id, newText) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    fetch(`${apiUrl}/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newText.trim(), completed: todo.done }),
    })
      .then((res) => res.json())
      .then((updated) => {
        setTodos((prev) =>
          prev.map((t) => (t.id === id ? { ...t, text: updated.title } : t))
        );
        setIsEditOpen(false);
        setTodoToEdit(null);
      })
      .catch((err) => console.error(err));
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = (todo.text || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "All" ? true : filter === "Complete" ? todo.done : !todo.done;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div className="min-h-screen px-4 py-6 relative transition-colors duration-300 bg-white dark:bg-black text-black dark:text-white">
        <h1 className="text-3xl font-bold text-center mb-6 text-black dark:text-white">
          TODO LIST
        </h1>

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filter={filter}
          setFilter={setFilter}
          theme={theme}
          setTheme={setTheme}
        />

        <TodoList
          todos={filteredTodos}
          onToggle={handleToggleTodo}
          onEdit={handleStartEdit}
          onDelete={handleDeleteTodo}
          loading={loading}
        />

        <EditTodoModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onEdit={handleEditTodo}
          todoToEdit={todoToEdit}
        />
        <AddTodoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddTodo}
        />

        <AddTodoButton onClick={() => setIsModalOpen(true)} />

        {showUndo && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#6C63FF] text-white w-[160px] h-[50px] rounded shadow-lg flex items-center justify-center gap-3 animate-fade-in-up">
            <button
              onClick={handleUndo}
              className="flex items-center gap-3 text-white font-bold relative"
            >
              <div className="relative w-8 h-8 flex items-center justify-center">
                <svg className="absolute w-8 h-8 -rotate-90">
                  <circle
                    className="text-white opacity-30"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    r="14"
                    cx="16"
                    cy="16"
                  />
                  <circle
                    className="text-white"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    r="14"
                    cx="16"
                    cy="16"
                    strokeDasharray={88}
                    strokeDashoffset={(88 / 5) * (5 - countdown)}
                    style={{ transition: "stroke-dashoffset 1s linear" }}
                  />
                </svg>
                <span className="text-sm font-bold">{countdown}</span>
              </div>
              <span>UNDO</span>
              <img
                src="/assets/images/undo.svg"
                alt="Undo"
                className="w-4 h-4"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
