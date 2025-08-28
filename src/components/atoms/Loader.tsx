import React, { CSSProperties, forwardRef } from "react";
import { PulseLoader } from "react-spinners";

const Loader = forwardRef<HTMLDivElement>((_, ref) => (
  <div ref={ref} className="h-20 bg-transparent grid place-items-center">
    <PulseLoader color="#000000" speedMultiplier={0.6} size={10} />
  </div>
));

Loader.displayName = "Loader";

export default Loader;
