export const SidebarItem = ({
  icon: Icon,
  label,
  bgColor = "bg-pink-500",
  textColor = "text-white",
  iconColor = "text-white",
  active = false, // nuevo
}) => {
  const baseStyle = "flex items-center gap-3 p-3 cursor-pointer";

  // Aplica el estilo invertido si está activo
  const activeStyle = active
    ? "bg-white text-pink-500"
    : `${bgColor} ${textColor}`;

  const iconClass = active ? "text-pink-500" : iconColor;

  return (
    <div className={`${baseStyle} ${activeStyle}`}>
      <Icon className={iconClass} />
      <span>{label}</span>
    </div>
  );
};
