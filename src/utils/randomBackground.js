import bg1 from "../assets/bg_1.webp";
import bg2 from "../assets/bg_2.webp";
import bg3 from "../assets/bg_3.webp";
import bg4 from "../assets/bg_4.webp";

const backgrounds = [bg1, bg2, bg3, bg4];

export const getRandomBackground = () =>
  backgrounds[Math.floor(Math.random() * backgrounds.length)];
