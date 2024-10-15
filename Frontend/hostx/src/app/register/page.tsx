"use client";

import NestedDate from "@/components/registerComps/NestedDate";
import Image from "next/image";
import { CiLocationOn } from "react-icons/ci";
import DialogDemo from "@/components/registerComps/DialogDemo";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const Register = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const urlParam = searchParams.get("id");

  console.log("url id ", urlParam?.split("?")[0]);
  console.log("url url ", urlParam?.split("?")[1].split("=")[1])

  // useEffect(() => {
  //   if(idParam && urlParam) {
  //     console.log("url id ", idParam);
  //     console.log("url url ", urlParam)
  //   }
  // }, [idParam, urlParam])

  return (
    <div className="h-screen sm:p-8 gap-16 px-4 sm:pt-16 sm:px-6 font-[family-name:var(--font-geist-sans)] text-white">

      <DialogDemo isOpen={isOpen} setIsOpen={setIsOpen} />
     {
      !isLoading ? (
          <div className="w-full f-full flex justify-center items-center">
          <div className="rounded-xl w-7/12">
            <div className="flex flex-row items-center mb-4">
              <div>
                <Image
                  src={"/moon-cake.jpg"}
                  height={500}
                  width={500}
                  alt="moon cake"
                  className="rounded-xl"
                />
              </div>

              <div className="p-2 pl-10 w-full">
                <p className="text-5xl font-bold mb-2">Event Title</p>

                <NestedDate />

                <div className="flex flex-row items-center mb-4">
                  <CiLocationOn className="mr-8 font-bold text-base" />

                  <p className="font-bold text-base">Register to See Address</p>
                </div>

                <p className="text-[#f7f5f2] mb-2">Registration</p>

                <p className="font-semibold mb-4">
                  Welcome! To join the event, please register below.
                </p>

                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="cursor-pointer w-full outline-none border-none rounded-xl p-2 bg-black text-base font-semibold text-center"
                >
                  Register
                </button>
              </div>
            </div>

            <div className="p-2">
              <p className="font-regular text-[#f7f5f2] mb-2">Hosted By</p>

              <p className="font-bold text-lg/">Ejezie Franklin</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center w-full h-screen fixed bg-gray-400 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10">
        <span className="relative flex h-8 w-8">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-8 w-8 bg-white"></span>
        </span>
      </div>
      )
     }
    </div>
  );
};

export default Register;
