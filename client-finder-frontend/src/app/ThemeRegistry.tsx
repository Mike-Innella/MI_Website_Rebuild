"use client";

import * as React from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useServerInsertedHTML } from "next/navigation";

export default function ThemeRegistry({ children }: any) {
  const [{ cache, flush }] = React.useState(() => {
    const cache = createCache({ key: "css", prepend: true }) as any;
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: string[] = [];

    cache.insert = (...args: any[]) => {
      const serialized = args[1] as any;
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };

    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };

    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) return null;
    let styles = "";
    names.forEach((name) => {
      styles += cache.inserted[name];
    });
    return (
      <style
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
