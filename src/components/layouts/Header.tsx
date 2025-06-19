import React from "react";
import Image from "next/image"

import styles from "@/styles/components/layouts/header.module.css"

const Header: React.FC = () => {
  return (
    <header
      className={`${styles.header} px-common-5p md:px-common-8p`}
    >
      <div>
        <h1 className="logo">
          <Image
            src="/logo_Knowledge.svg"
            width={358}
            height={100}
            alt="Knowledge"
          />
        </h1>
      </div>
    </header>
  );
}

export default Header
