import { Carousel } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import cics1 from "../../assets/frassati-image.png";
import cics2 from "../../assets/frassati-image.png";

const CarouselImage = () => {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative flex justify-center items-center w-full">
      <Carousel
        transition={{ duration: 1 }}
        autoplay={true}
        loop={true}
        className="w-full h-auto"
      >
        <img
          src={cics1}
          alt="CICS Image 1"
          className="w-full h-auto max-h-[80vh] object-contain"
        />
        <img
          src={cics2}
          alt="CICS Image 2"
          className="w-full h-auto max-h-[80vh] object-contain"
        />
      </Carousel>
    </div>
  );
};

export default CarouselImage;
