import React, { forwardRef } from "react";

const Loader = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className="h-10 bg-transparent text-center">
      Loading...
    </div>
  );
});

export default Loader;
