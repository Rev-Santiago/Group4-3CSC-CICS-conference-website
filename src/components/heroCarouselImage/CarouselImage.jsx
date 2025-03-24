import { Carousel } from "@material-tailwind/react";
import { useState, useEffect } from "react";

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
        transition={{ duration: 3 }}
        autoplay={true}
        loop={true}
        prevArrow={null} // Fixed: Use null instead of ""
        nextArrow={null} // Fixed: Use null instead of ""
        className="w-11/12 h-96">
        <img
          src="/assets/frassati-image.png" // Fixed: Use public folder path
          alt="CICS Image 1"
          className="h-full w-full object-cover"
        />
        <img
          src="/assets/frassati-image.png" // Fixed: Use public folder path
          alt="CICS Image 2"
          className="h-full w-full object-cover"
        />
      </Carousel>
    </div>
  );
};

export default CarouselImage;
