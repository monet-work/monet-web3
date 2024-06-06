"use client";
import React from "react";
import { Loader2 } from "lucide-react";

type Props = {};

function loading({}: Props) {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Loader2 className=" h-8 w-8 animate-spin" />
    </div>
  );
}

export default loading;
