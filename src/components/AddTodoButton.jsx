const AddTodoButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        fixed
        bottom-6
        right-6
        sm:bottom-8
        sm:right-8
        lg:right-88
        bg-[#6C63FF]
        p-4
        rounded-full
        shadow-lg
        cursor-pointer
        hover:bg-[#5a53e0]
        transition-colors
      "
    >
      <img
        src="/assets/images/plus.svg"
        alt="Add"
        className="w-6 h-6 sm:w-7 sm:h-7"
      />
    </button>
  );
};

export default AddTodoButton;
