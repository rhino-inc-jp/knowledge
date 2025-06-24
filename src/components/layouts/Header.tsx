import React from "react";
import Image from "next/image";

const Header: React.FC = () => {
  return (
    <header className="w-full fixed top-0 left-0 z-50 px-common-sp md:px-common-pc pt-[28px] pb-[50px] md:pt-[70px] md:pb-[90px] bg-white">
      <div>
        <h1 className="relative w-[240px] h-[65px] md:w-[360px] md:h-[100px]">
          <Image src="/logo_Knowledge.svg" fill alt="Knowledge" />
        </h1>
      </div>
    </header>
  );
};

export default Header;
