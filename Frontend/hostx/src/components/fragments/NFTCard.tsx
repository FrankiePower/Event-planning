"use client";

import { useState, useContext } from "react";
import { UrlContext } from "@/context/UrlContext";

import Image from "next/image";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CardWithForm() {
  const [file, setFile] = useState<File>();
  const { url, setUrl } = useContext(UrlContext);
  const [uploading, setUploading] = useState(false);

  const uploadFile = async () => {
    try {
      if (!file) {
        alert("No file selected");
        return;
      }

      setUploading(true);
      const data = new FormData();
      data.set("file", file);
      const uploadRequest = await fetch("/api/files", {
        method: "POST",
        body: data,
      });
      const ipfsUrl = await uploadRequest.json();
      console.log(ipfsUrl);
      setUrl(ipfsUrl);
      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target?.files?.[0]);
  };
  return (
    <Card className="w-[350px] ">
      <CardHeader>
        <div>
          <input type="file" onChange={handleChange} />
          <button disabled={uploading} onClick={uploadFile}>
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
        <CardTitle>Create your NFT Ticket</CardTitle>
        <CardDescription>Deploy your new event in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">NFT Ticket Name</Label>
              <Input id="name" placeholder="Name of your NFT Ticket" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">NFT Ticket Symbol</Label>
              <Input id="name" placeholder="Ticket Symbol" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Payment Token</Label>
              <Select>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="next">LISK</SelectItem>
                  <SelectItem value="sveltekit">USDT</SelectItem>
                  <SelectItem value="astro">USDC</SelectItem>
                  <SelectItem value="nuxt">DAI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Create</Button>
      </CardFooter>
    </Card>
  );
}
