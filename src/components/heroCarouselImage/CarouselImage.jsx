import { Carousel } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import cics1 from "../../assets/frassati-image.png";
import cics2 from "../../assets/frassati-image.png";

const CarouselImage = () => {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
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
        className="w-11/12 h-96">
        <img
          src={cics1}
          alt="CICS Image 1"
          className="h-full w-full object-cover"
        />
        <img
          src={cics2}
          alt="CICS Image 2"
          className="h-full w-full object-cover"
        />
      </Carousel>
    </div>
  );
};

export default CarouselImage;
