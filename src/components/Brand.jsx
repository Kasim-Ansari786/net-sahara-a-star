import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Brand = ({
  to = "/",
  subtitle = "By Sahara Star",
  showWordmark = false,
  priority = false,
  className = "",
}) => {
  const img = (
    <img
      src={logo}
      alt="A-Star Academy by Sahara Star — logo"
      width={329}
      height={79}
      className="h-9 sm:h-10 md:h-12 w-auto select-none"
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      fetchpriority={priority ? "high" : "auto"}
      draggable={false}
    />
  );

  const content = (
    <span className={`flex items-center gap-3 ${className}`}>
      {img}
      {showWordmark && (
        <span className="leading-tight">
          <span className="block font-display text-base sm:text-lg md:text-xl tracking-wide">A-Star Academy</span>
          {subtitle && (
            <span className="block text-[10px] sm:text-xs uppercase tracking-[0.25em] text-gold/80">{subtitle}</span>
          )}
        </span>
      )}
    </span>
  );

  if (to === null) return content;

  return (
    <Link to={to} aria-label="A-Star Academy — home" className="inline-flex items-center">
      {content}
    </Link>
  );
};

export default Brand;