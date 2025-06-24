import React from "react";

import { Viewport } from "@/types/article";

import styles from "@/styles/components/atoms/switchBtns.module.css";

type Props = {
  viewType: Viewport;
  setViewType: (type: Viewport) => void;
};

const SwitchBtns: React.FC<Props> = ({ viewType, setViewType }) => {
  return (
    <div
      className={`z-50 w-full fixed top-[143px] right-0 bg-white flex justify-end px-common-sp pb-[15px]`}
    >
      <div className={`${styles.btns} flex w-[190px] font-hel`}>
        <button
          type="button"
          className={`${styles.btn} ${
            viewType === "list" ? styles.active : ""
          } p-[4px]`}
          onClick={() => setViewType("list")}
        >
          List
        </button>
        <button
          type="button"
          className={`${styles.btn} ${
            viewType === "image" ? styles.active : ""
          } p-[4px]`}
          onClick={() => setViewType("image")}
        >
          Image
        </button>
      </div>
    </div>
  );
};

export default SwitchBtns;
