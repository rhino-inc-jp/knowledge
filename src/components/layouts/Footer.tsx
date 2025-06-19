import React from "react";
import Image from "next/image";

import styles from "@/styles/components/layouts/footer.module.css"

const Footer: React.FC = () => {
  return (
    <footer
      className={`${styles.footer} px-common-5p md:px-common-8p`}
    >
      <div>
        <p className="text-right">
          <Image
            className="inline-block"
            src="/logo_rhino-inc.svg"
            width={122}
            height={100}
            alt="&copy; Rhino Inc."
          />
        </p>
      </div>
    </footer>
  );
}

export default Footer;