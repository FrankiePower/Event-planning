"use client";

import * as React from "react";

export const UrlContext = React.createContext(null);

export function useUrl() {
  return React.useContext(UrlContext);
}

export function UrlProvider({ children }) {
  const [url, setUrl] = React.useState(null);
  const [nftName, setNftName] = React.useState("");
  const [nftSymbol, setNftSymbol] = React.useState("");
  const [selectedToken, setSelectedToken] = React.useState("");

  return (
    <UrlContext.Provider
      value={{
        url,
        setUrl,
        nftName,
        setNftName,
        nftSymbol,
        setNftSymbol,
        selectedToken,
        setSelectedToken,
      }}
    >
      {children}
    </UrlContext.Provider>
  );
}
