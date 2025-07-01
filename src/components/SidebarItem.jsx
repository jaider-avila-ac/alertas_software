import { Link } from "react-router-dom";

export const SidebarItem = ({
  icon: Icon,
  label,
  path,
  bgColor = "bg-pink-500",
  textColor = "text-white",
  iconColor = "text-white",
  active = false,
  soloIcono = false,
  textoHorizontal = false,
}) => {
  const baseStyle = "flex items-center gap-2 p-2 sm:p-3 cursor-pointer transition";
  const activeStyle = active ? "bg-white text-pink-500" : `${bgColor} ${textColor}`;
  const iconClass = `w-5 h-5 sm:w-6 sm:h-6 ${active ? "text-pink-500" : iconColor}`;

  return (
    <Link to={path} className={`${baseStyle} ${activeStyle}`}>
      <Icon className={iconClass} />
      {!soloIcono && <span className={`text-sm ${textoHorizontal ? "" : "hidden sm:inline"}`}>{label}</span>}
    </Link>
  );
};
