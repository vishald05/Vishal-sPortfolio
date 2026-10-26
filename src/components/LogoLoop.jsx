import { useEffect, useRef, useState } from "react";
import "./LogoLoop.css";

function LogoLoop({
  logos,
  speed = 120,
  direction = "left",
  gap = 32,
  pauseOnHover = true,
  fadeOut = true,
  fadeOutColor = "transparent",
  scaleOnHover = false,
  ariaLabel = "Technology logos",
}) {
  const listRef = useRef(null);
  const [duration, setDuration] = useState(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;

    const updateDuration = () => {
      const width = list.getBoundingClientRect().width;
      setDuration(width > 0 && speed > 0 ? `${width / speed}s` : null);
    };

    updateDuration();
    const observer = new ResizeObserver(updateDuration);
    observer.observe(list);
    return () => observer.disconnect();
  }, [speed, logos]);

  const animationDirection = direction === "right" ? "reverse" : "normal";
  const style = {
    "--logoloop-gap": `${gap}px`,
    "--logoloop-duration": duration || "24s",
    "--logoloop-fade": fadeOutColor,
    animationDirection,
  };

  return (
    <div
      className={`logoloop${pauseOnHover ? " logoloop--pause-hover" : ""}${scaleOnHover ? " logoloop--scale-hover" : ""}${fadeOut ? " logoloop--fade" : ""}`}
      aria-label={ariaLabel}
    >
      <div className="logoloop__track" style={style}>
        {[0, 1].map((copy) => (
          <ul
            className="logoloop__list"
            key={copy}
            ref={copy === 0 ? listRef : undefined}
            aria-hidden={copy === 1}
          >
            {logos.map(({ title, node, href }) => (
              <li className="logoloop__item" key={`${copy}-${title}`}>
                {href ? (
                  <a className="logoloop__content" href={href} target="_blank" rel="noreferrer" aria-label={title}>
                    <span className="logoloop__node" aria-hidden="true">{node}</span>
                    <span className="logoloop__label">{title}</span>
                  </a>
                ) : (
                  <span className="logoloop__content">
                    <span className="logoloop__node" aria-hidden="true">{node}</span>
                    <span className="logoloop__label">{title}</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export default LogoLoop;
