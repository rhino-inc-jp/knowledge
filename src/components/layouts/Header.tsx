import React from "react";
import Image from "next/image"

import styles from "@/styles/components/layouts/header.module.scss"

const Header: React.FC = () => {
  return (
    <header
      className={`${styles.header} px-common-sp md:px-common-pc`}
    >
      <div>
        <h1 className={`${styles.headerLogo}`}>
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
