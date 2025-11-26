import Image from "next/image";

const Header = () => {
  return (
    <header className="w-full fixed top-0 left-0 z-[100] p-[14px_70px_14px_25px] md:p-[30px_0_0_140px]">
      <div>
        <h1 className="relative w-[150px] h-[44px] md:w-[200px] md:h-[75px]">
          <a href="/">
            <Image src="/logo_Nowledge.svg" fill alt="Nowledge" />
          </a>
        </h1>
      </div>
    </header>
  );
};

export default Header;
