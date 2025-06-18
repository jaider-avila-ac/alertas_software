export const Card = ({ icon: Icon, label, total, bgColor, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded shadow text-white ${bgColor} cursor-pointer w-full hover:opacity-90`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-lg font-bold">{label}</p>
          <p className="text-3xl">{total}</p>
        </div>
        <Icon size={36} />
      </div>
    </div>
  );
};