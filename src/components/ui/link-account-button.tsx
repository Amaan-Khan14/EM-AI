"use client";
import React from "react";
import { Button } from "./button";
import { getAurinkoAuthUrl } from "@/lib/aurinko";

const LinkAccountButton = () => {
  return (
    <Button
      onClick={async () => {
        const redirectUrl = await getAurinkoAuthUrl("Google");
        window.location.href = redirectUrl;
      }}
    >
      Link ur account
    </Button>
  );
};

export default LinkAccountButton;
