"use client";
import React from "react";
import { Loader2 } from "lucide-react";
import PageLoader from "@/components/page-loader";

type Props = {};

function loading({}: Props) {
  return <PageLoader />;
}

export default loading;
