import React from "react";

import { ViewType } from "@/constants/viewTypes";

import styles from "@/styles/components/atoms/switchBtns.module.css";

type Props = {
  viewType: ViewType;
  setViewType: (type: ViewType) => void;
};

const SwitchBtns = ({ viewType, setViewType }: Props) => (
  <div
    className={`${styles.btnsWrap} z-50 fixed top-[72px] md:left-[94.8%] md:top-[30px] max-md:right-0 flex justify-end max-md:mr-[15px]`}
  >
    <div className={`${styles.btns} flex w-[200px] md:w-[220px] font-hel`}>
      <button
        type="button"
        className={`${styles.btn} ${
          viewType === "list" ? styles.active : ""
        } p-[2px_4px] md:order-1 md:border-l max-md:border-r border-black`}
        onClick={() => setViewType("list")}
      >
        List
      </button>
      <button
        type="button"
        className={`${styles.btn} ${
          viewType === "image" ? styles.active : ""
        } p-[2px_4px] md:order-0`}
        onClick={() => setViewType("image")}
      >
        Image
      </button>
    </div>
  </div>
);

export default SwitchBtns;
