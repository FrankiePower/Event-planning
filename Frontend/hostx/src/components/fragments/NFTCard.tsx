"use client";

import * as React from "react";
import { useState, useContext } from "react";
import { UrlContext } from "@/context/UrlContext";
import { imageplaceholder } from "@/asset";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
  const tokenAddresses = {
    lisk: "0xLISK_TOKEN_ADDRESS",
    usdt: "0xUSDT_TOKEN_ADDRESS",
    usdc: "0xUSDC_TOKEN_ADDRESS",
    dai: "0xDAI_TOKEN_ADDRESS",
  };

  const [file, setFile] = useState<File>();
  const {
    url,
    setUrl,
    nftName,
    setNftName,
    nftSymbol,
    setNftSymbol,
    selectedToken,
    setSelectedToken,
  } = useContext(UrlContext);

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

  const handleNftNameChange = (e) => {
    setNftName(e.target.value);
  };

  const handleNftSymbolChange = (e) => {
    setNftSymbol(e.target.value);
  };

  const handleTokenChange = (value) => {
    setSelectedToken(tokenAddresses[value]);
  };
  return (
    <div>
      <div>
        <Image
          src={url ? url : imageplaceholder}
          alt="images"
          width={350}
          height={350}
          className="rounded-xl"
        />
      </div>

      <Card className="w-[350px] ">
        <CardHeader>
          <div>
            <input type="file" onChange={handleChange} />
            <button disabled={uploading} onClick={uploadFile}>
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <CardTitle>Create your NFT Ticket</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">NFT Ticket Name</Label>
                <Input
                  id="name"
                  placeholder="Name of your NFT Ticket"
                  value={nftName}
                  onChange={handleNftNameChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">NFT Ticket Symbol</Label>
                <Input
                  id="name"
                  placeholder="Ticket Symbol"
                  value={nftSymbol}
                  onChange={handleNftSymbolChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Payment Token</Label>
                <Select onValueChange={handleTokenChange}>
                  <SelectTrigger id="framework">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="lisk">LISK</SelectItem>
                    <SelectItem value="usdt">USDT</SelectItem>
                    <SelectItem value="usdc">USDC</SelectItem>
                    <SelectItem value="dai">DAI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
