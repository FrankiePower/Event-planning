import React from "react";
import { zoro } from "@/asset";
import Image from "next/image";

const Create = () => {
  return (
    <div className="flex">
      <div>
        <Image src={zoro} alt="zoro" width={330} height={330} />
      </div>
      <div>
        <input type="text" />
      </div>
    </div>
  );
};

export default Create;
