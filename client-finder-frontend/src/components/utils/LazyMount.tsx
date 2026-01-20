"use client";

import { isValidElement, useEffect, useMemo, useRef, useState } from "react";

export default function LazyMount({ fallback = null, children, rootMargin = "300px" }: any) {
  const ref = useRef<any>(null);
  const [show, setShow] = useState(false);
  const anchorId = useMemo(() => {
    const child = Array.isArray(children) ? children[0] : children;
    if (isValidElement(child)) {
      const id = (child.props as { id?: string })?.id;
      if (id) {
        return id;
      }
    }
    return undefined;
  }, [children]);

  useEffect(() => {
    if (!ref.current || show) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );

    io.observe(ref.current);
    return () => io.disconnect();
  }, [show, rootMargin]);

  return (
    <div ref={ref} id={!show ? anchorId : undefined} style={{ minHeight: 1 }}>
      {show ? children : fallback}
    </div>
  );
}
