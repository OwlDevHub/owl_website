import React, { useState } from "react";
import OwlIcon from "./OwlIcon";

export const HeroSection = () => {
  return (
    <div className="main_block animate__animated animate__fadeInDown">
      <OwlIcon />
      <h2 style={{ fontSize: "x-large", marginTop: "50px", lineHeight: "45px"}}>
        Modern task and project manager
        <br />
        for your productivity
      </h2>
    </div>
  );
};

export const SloganSection = () => {
  return (
    <div
      style={{ textAlign: "left", height: "100%", width: "100%", alignItems: "center", display: "flex", justifyContent: "center" }}
    >
      <h1 className="big_text">
        <p
          style={{
            padding: "0px",
            paddingBottom: "20px",
            margin: "0px",
            fontStyle: "italic",
            fontSize: "xx-large",
            fontWeight: "1000",
          }}
        >
          OWL:
        </p>
        - Your ideas
        <br />- your organization
        <br />- your freedom
      </h1>
    </div>
  );
};
