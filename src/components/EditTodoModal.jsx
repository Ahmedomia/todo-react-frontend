import { useState, useEffect } from "react";

const EditTodoModal = ({ isOpen, onClose, onEdit, todoToEdit }) => {
  const [text, setText] = useState("");

  useEffect(() => {
    if (todoToEdit) {
      setText(todoToEdit.text);
    }
  }, [todoToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onEdit(todoToEdit.id, text.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-50 px-4">
      <div
        className="
          bg-white dark:bg-black border rounded p-6 shadow-lg
          w-full max-w-[500px]  /* max width on large screens */
          h-auto
        "
      >
        <h2 className="text-xl font-bold mb-4 text-center text-black dark:text-white">
          EDIT NOTE
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            autoFocus
            type="text"
            value={text}
            maxLength={100}
            onChange={(e) => setText(e.target.value)}
            placeholder="UPDATE YOUR NOTE..."
            className="
              w-full px-4 py-2 border border-[#6C63FF] rounded mb-4 
              bg-white dark:bg-black text-gray-700 dark:text-gray-300
              focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/50
              transition-all duration-200 uppercase
            "
          />
          <div className="flex justify-between mt-10">
            <button
              type="button"
              onClick={onClose}
              className="
                h-[38px] w-[97px] rounded-[5px] 
                bg-white text-[#6C63FF] border border-[#6C63FF]
                hover:bg-[#6C63FF]/10 dark:bg-black cursor-pointer
              "
            >
              Cancel
            </button>
            <button
              type="submit"
              className="
                h-[38px] w-[97px] rounded-[5px] 
                bg-[#6C63FF] text-white
                hover:bg-[#5a53e0]
                cursor-pointer
              "
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTodoModal;
