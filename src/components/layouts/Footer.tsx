import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="px-common-sp md:px-common-pc pt-[45px] pb-[25px] md:pt-[70px] md:pb-[75px]">
      <div className="text-right">
        <p className="inline-block relative w-[80px] h-[15px] md:w-[120px] md:h-[20px]">
          <Image src="/logo_rhino-inc.svg" fill alt="&copy; Rhino Inc." />
        </p>
      </div>
    </footer>
  );
};

export default Footer;
