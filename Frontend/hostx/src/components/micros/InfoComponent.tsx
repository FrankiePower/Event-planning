import { AlertTriangle } from "lucide-react";
import Image from "next/image";
import { FC } from "react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import Social from "./Social";

interface InfoComponentProps {
  title: string;
  date: string;
  time: string;
  host: {
    name: string;
    email: string;
  };
  eventLink: string;
}

const InfoComponent: FC<InfoComponentProps> = ({ time }) => {
  return (
    <div className="bg-transparent text-white p-4 shadow-xl max-w-4xl mx-auto border rounded-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="bg-[#13380e] rounded-xl p-2 space-y-3">
            <Image
              width={0}
              height={0}
              alt="alt image"
              className="h-full w-full rounded-xl"
              src={"/image.jpeg"}
            />
            img
          </div>
          <div className="flex justify-between items-center w-full h-4/12 text-sm pt-3 px-2">
            <h3 className="font-semibold text-gray-300">Share Event</h3>
            <Social />
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">When & Where</h2>

            <div className="">
              <div className="flex items-center gap-3">
                <div className="border rounded-xl flex flex-col items-center w-14 h-14 bg-stone-900">
                  <div className="flex flex-col justify-center items-center w-full text-xs bg-[#8e8e8e] h-1/3 rounded-t-xl">
                    <p className="text-xs py-1">OCT</p>
                  </div>
                  <div className="flex justify-center items-center w-full h-full">
                    <p className="text-2xl font-bold py-1">14</p>
                  </div>
                </div>
                <div>
                  <p className="font-semibold">Tomorrow</p>
                  <p>{time} GMT+1</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="border rounded-xl flex flex-col justify-center items-center w-14 h-14 bg-stone-900 p-4">
                <AlertTriangle className="text-yellow-500" />
              </div>
              <div>
                <h3 className="text-yellow-500 font-semibold">
                  Location Missing
                </h3>
                <p className="text-sm text-gray-300">
                  Please enter the location of the event before it starts.
                </p>
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-3 justify-between w-full justify-self-end px-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  // variant="outline"
                  className="w-full bg-stone-800 text-white py-1.5 rounded-xl text-base"
                >
                  Edit Event
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <h1>hello world</h1>
              </SheetContent>
            </Sheet>
            <button className="w-full bg-stone-800 text-white py-1.5 rounded-xl">
              Change Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoComponent;
