"use client";

import Image from "next/image";
import { useRouter } from "next/navigation"; // ← 追加

const Header = () => {
  const router = useRouter(); // ← 追加

  const handleClickLogo = () => {
    router.push("/"); // ← トップページに遷移
  };

  return (
    <header className="w-full fixed top-0 left-0 z-50 px-common-sp md:px-common-pc pt-[28px] pb-[50px] md:pt-[70px] md:pb-[90px] bg-white">
      <div>
        <h1
          className="relative w-[240px] h-[65px] md:w-[360px] md:h-[100px] cursor-pointer"
          onClick={handleClickLogo} // ← クリックでトップに遷移
        >
          <Image src="/logo_Knowledge.svg" fill alt="Knowledge" />
        </h1>
      </div>
    </header>
  );
};

export default Header;
