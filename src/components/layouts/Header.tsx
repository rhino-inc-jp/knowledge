import Image from "next/image";
import { useRouter } from "next/navigation"; // ← 追加

const Header = () => {
  return (
    <header className="w-full fixed top-0 left-0 z-[210] px-common-sp md:px-common-pc pt-[28px] pb-[50px] md:pt-[70px] md:pb-[0px] md:z-[500]">
      <div>
        <h1 className="relative w-[240px] h-[65px] md:w-[360px] md:h-[100px]">
          <a href="/">
            <Image src="/logo_Knowledge.svg" fill alt="Knowledge" />
          </a>
        </h1>
      </div>
    </header>
  );
};

export default Header;
