import React from "react";
import cicsSeal from "../../../assets/cics-seal.png";

export default function BaseFooter() {
  return (
    <footer className="bg-black text-white py-6 relative">
      {/* Red Line at the Top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-customRed"></div>

      {/* Content Wrapper */}
      <div className="container -md:mx-auto flex flex-col md:flex-row items-center md:items-start text-center md:text-left space-y-6 md:space-y-0 md:space-x-10">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center md:items-start md:ml-16 ">
          <img src={cicsSeal} alt="UST Logo" className="w-16 h-16 mb-2" />
          <p className="text-sm">
            University of Santo Tomas, <br />
            College of Information and Computing Sciences, <br />
            Copyright © 2025
          </p>
        </div>

        {/* Contact Section */}
        <div>
          <p className="text-customRed font-semibold">Contact Us</p>
          <div>
            <p className="text-sm">sampleemail@ust.edu.ph</p>
            <p className="text-sm">+631 234 5678</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
