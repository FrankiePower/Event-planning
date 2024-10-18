import { zoro } from "@/asset";

import Image from "next/image";

export function ImageSelector() {
  return (
    <div>
      <Image src={zoro} alt="zoro" width={350} className="rounded-xl" />
    </div>
  );
}
