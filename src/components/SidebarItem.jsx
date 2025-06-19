import { Link } from "react-router-dom";

export const SidebarItem = ({
  icon: Icon,
  label,
  path,
  bgColor = "bg-pink-500",
  textColor = "text-white",
  iconColor = "text-white",
  active = false,
}) => {
  const baseStyle = "flex items-center gap-3 p-3 cursor-pointer transition";
  const activeStyle = active ? "bg-white text-pink-500" : `${bgColor} ${textColor}`;
  const iconClass = active ? "text-pink-500" : iconColor;

  return (
    <Link to={path} className={`${baseStyle} ${activeStyle}`}>
      <Icon className={iconClass} />
      <span>{label}</span>
    </Link>
  );
};
