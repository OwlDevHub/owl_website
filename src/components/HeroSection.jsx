import React, { useState } from "react";

export const HeroSection = () => {
  return (
    <div className="main_block animate__animated animate__fadeInDown">
      <img src="/imgs/app_icon.png" className="app_logo" />
      <h2
        style={{ fontSize: "x-large", marginTop: "50px", lineHeight: "45px" }}
      >
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
      style={{
        textAlign: "left",
        height: "100%",
        width: "100%",
        alignItems: "center",
        display: "flex",
        padding: "0px",
        margin: "0px",
        justifyContent: "center",
      }}
    >
      <h1 className="big_text">
        <p
          style={{
            padding: "0px",
            paddingBottom: "20px",
            margin: "0px",
            fontStyle: "italic",
            fontSize: "xxx-large",
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
