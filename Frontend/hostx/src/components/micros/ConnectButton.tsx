"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function CustomConnectButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        if (!ready) {
          return null;
        }

        if (!connected) {
          return (
            <button
              onClick={openConnectModal}
              type="button"
              className="py-2 px-3 sm:px-4 bg-stone-700 rounded-3xl text-sm text-stone-300 hover:bg-stone-400 hover:text-stone-700">
              Connect Wallet
            </button>
          );
        }

        if (chain.unsupported) {
          return (
            <button onClick={openChainModal} type="button" className="py-2 px-3 sm:px-4 bg-stone-700 rounded-3xl text-sm text-stone-300 hover:bg-stone-400 hover:text-stone-700">
              Wrong network
            </button>
          );
        }

        return (
          <button
            onClick={openAccountModal}
            type="button"
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#131313B2",
              border: "none",
              cursor: "pointer",
            }}
            className="py-2 px-3 sm:px-4 bg-stone-700 rounded-3xl text-sm text-stone-300 hover:bg-stone-400 hover:text-stone-700">
            <p>
              {" "}
              {account.address.slice(0, 6)}...{account.address.slice(-4)}
            </p>
          </button>
        );
      }}
    </ConnectButton.Custom>
  );
}
