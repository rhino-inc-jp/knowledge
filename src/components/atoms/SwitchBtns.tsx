import React from "react";

import { Viewport } from "@/types/article";

import styles from "@/styles/components/atoms/switchBtns.module.css";

type Props = {
  viewType: Viewport;
  setViewType: (type: Viewport) => void;
};

const SwitchBtns = ({ viewType, setViewType }: Props) => (
  <div
    className={`${styles.btnsWrap} z-50 fixed top-[143px] right-0 flex justify-end px-common-sp`}
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

export default SwitchBtns;
