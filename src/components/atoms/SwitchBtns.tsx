import React from "react"

import { Viewport } from "@/types/article";

import styles from "@/styles/components/atoms/switchBtns.module.scss"

type Props = {
  viewType: Viewport;
  setViewType: (type: Viewport) => void;
}

const SwitchBtns: React.FC<Props> = ({ viewType, setViewType }) => {
  return (
    <div className={`${ styles.wrapper } flex justify-end px-common-sp`}>
      <div className={`${ styles.btns } flex`}>
        <button
          type="button"
          className={`${ styles.btn } ${ viewType === "list" ? styles.active : "" }`}
          onClick={() => setViewType("list")}
        >List</button>
        <button
          type="button"
          className={`${ styles.btn } ${ viewType === "image" ? styles.active : "" }`}
          onClick={() => setViewType("image")}
        >Image</button>
      </div>
    </div>
  )
}

export default SwitchBtns;