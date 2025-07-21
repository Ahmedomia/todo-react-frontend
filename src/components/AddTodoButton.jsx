const AddTodoButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-86 bg-[#6C63FF] p-4 rounded-full shadow-lg cursor-pointer"
    >
      <img src="/assets/images/plus.svg" />
    </button>
  );
};

export default AddTodoButton;
