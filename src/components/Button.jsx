export const Button = ({ text, color, icon: Icon, onClick, title }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 ${color} text-white px-4 py-2 rounded cursor-pointer`}
      title={title} 
    >
      {Icon && <Icon size={20} />}
      {text}
    </button>
  );
};

