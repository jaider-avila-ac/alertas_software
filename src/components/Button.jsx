export const Button = ({ text, color, icon: Icon, onClick, title, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 ${color} text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
      title={title}
    >
      {Icon && <Icon size={20} />}
      {text}
    </button>
  );
};
