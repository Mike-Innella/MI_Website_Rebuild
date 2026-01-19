"use client";

import { useEffect, useRef, useState } from "react";

export default function LazyMount({ fallback = null, children, rootMargin = "300px" }: any) {
  const ref = useRef<any>(null);
  const [show, setShow] = useState(false);

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

  return <div ref={ref}>{show ? children : fallback}</div>;
}
