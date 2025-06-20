import React from "react"
import styles from "@/styles/components/atoms/switchBtns.module.scss"

type Props = {
  viewType: "list" | "image";
  setViewType: (type: "list" | "image") => void;
}

const SwitchBtns: React.FC<Props> = ({ viewType, setViewType }) => {
  return (
    <div className={`${ styles.wrapper } flex justify-end`}>
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