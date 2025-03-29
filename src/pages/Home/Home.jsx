import { useState } from 'react';
import HorizontalAccordion from "../../components/horizontalAccordion/HorizontalAccordion";
import CarouselImage from "../../components/heroCarouselImage/CarouselImage";
import { Container } from '@mui/material';

function Home() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Container>
        <div className="landing-page">
          <section className="hero relative mx-1">
            <div>
              <h1 className="text-3xl text-customRed text-center pb-5 -md:mt-3">Welcome to UST CICS Conference Website</h1>
            </div>
            {/* Image Carousel */}
            <div className="carousel pb-5">
              <CarouselImage />
            </div>

            <div className=" space-y-4 pb-5">
              <p className="text-justify ">
                The University of Santo Tomas College of Information and Computing Sciences (UST CICS)
                stands at the forefront of technology-driven innovation and academic excellence. As a leading
                institution in the field of computing, we are committed to shaping future-ready professionals
                equipped with the skills, knowledge, and ethical grounding necessary to thrive in a dynamic digital world.
              </p>

              <p className="text-justify">
                Founded on a tradition of academic distinction, UST CICS bridges the gap between theoretical learning and
                practical application. Our diverse programs cater to emerging fields such as software development, data science,
                cybersecurity, and artificial intelligence.
              </p>
            </div>

            <div className="mb-5">
              <HorizontalAccordion />
            </div>
          </section>
        </div>
      </Container>
    </>
  );
}



export default Home;
