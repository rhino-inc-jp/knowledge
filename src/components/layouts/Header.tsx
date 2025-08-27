import Image from "next/image";

const Header = () => {
  return (
    <header className="w-full fixed top-0 left-0 z-[210] px-common-sp pt-[28px] pb-[50px] md:p-[73px_0_0_141px] md:z-[500]">
      <div>
        <h1 className="relative w-[240px] h-[66px] md:w-[360px] md:h-[100px]">
          <a href="/">
            <Image src="/logo_Knowledge.svg" fill alt="Knowledge" />
          </a>
        </h1>
      </div>
    </header>
  );
};

export default Header;
