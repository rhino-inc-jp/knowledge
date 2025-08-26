import React from "react";

import { ViewType } from "@/constants/viewTypes";

import styles from "@/styles/components/atoms/switchBtns.module.css";

type Props = {
  viewType: ViewType;
  setViewType: (type: ViewType) => void;
};

const SwitchBtns = ({ viewType, setViewType }: Props) => (
  <div
    className={`${styles.btnsWrap} z-50 fixed top-[143px] md:top-0 md:left-[95.2%] max-md:right-0 flex justify-end max-md:mr-[4.2%]`}
  >
    <div className={`${styles.btns} flex w-[190px] font-hel`}>
      <button
        type="button"
        className={`${styles.btn} ${
          viewType === "list" ? styles.active : ""
        } p-[4px] md:order-1 md:border-l max-md:border-r border-black`}
        onClick={() => setViewType("list")}
      >
        List
      </button>
      <button
        type="button"
        className={`${styles.btn} ${
          viewType === "image" ? styles.active : ""
        } p-[4px] md:order-0`}
        onClick={() => setViewType("image")}
      >
        Image
      </button>
    </div>
  </div>
);

export default SwitchBtns;
