import { Link } from "react-router-dom";

const COLOR_CLASS = {
  cyan: "bg-cyan-500",
  green: "bg-emerald-500",
  orange: "bg-amber-400",
  red: "bg-red-500",
};

export default function KpiCard({ title, value, Icon, color = "cyan", to }) {
  const bg = COLOR_CLASS[color] ?? COLOR_CLASS.cyan;

  const card = (
    <div className={`${bg} flex items-center justify-between px-6 py-6 rounded-2xl cursor-pointer`}>
      <div>
        <p className="text-white/80 text-xs font-medium mb-1">{title}</p>
        <p className="text-white text-2xl font-extrabold leading-none">{value ?? ""}</p>
      </div>
      {Icon && <Icon size={38} color="rgba(255,255,255,0.75)" strokeWidth={1.4} />}
    </div>
  );

  return to
    ? <Link to={to} className="block no-underline">{card}</Link>
    : card;
}