import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { liskSepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "hostX",
  projectId: "83b7c27ad682bdcba4b03c2b30984b0a",
  chains: [liskSepolia],
  ssr: true,
});
