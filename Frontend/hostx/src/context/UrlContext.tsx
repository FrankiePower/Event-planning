"use client";

import * as React from "react";

export const UrlContext = React.createContext(null);

export function useUrl() {
  return React.useContext(UrlContext);
}

export function UrlProvider({ children }) {
  const [url, setUrl] = React.useState(null);

  return (
    <UrlContext.Provider value={{ url, setUrl }}>
      {children}
    </UrlContext.Provider>
  );
}
