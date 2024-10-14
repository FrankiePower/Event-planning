import { Button } from "@/components/ui/button";
import { zoro } from "@/asset";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

export function ImageSelector() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Image src={zoro} alt="zoro" width={330} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Image src={zoro} alt="zoro" width={230} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Image src={zoro} alt="zoro" width={230} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
