"use client";

import * as React from "react";

export const UrlContext = React.createContext<{
  url: null | string;
  setUrl: React.Dispatch<React.SetStateAction<null | string>>;
  nftName: string;
  setNftName: React.Dispatch<React.SetStateAction<string>>;
  nftSymbol: string;
  setNftSymbol: React.Dispatch<React.SetStateAction<string>>;
  selectedToken: string;
  setSelectedToken: React.Dispatch<React.SetStateAction<string>>;
}>({
  url: null,
  setUrl: () => {},
  nftName: "",
  setNftName: () => {},
  nftSymbol: "",
  setNftSymbol: () => {},
  selectedToken: "",
  setSelectedToken: () => {},
});

export function useUrl() {
  return React.useContext(UrlContext);
}

export function UrlProvider({ children }: { children: React.ReactNode }) {
  const [url, setUrl] = React.useState<null | string>(null);
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
