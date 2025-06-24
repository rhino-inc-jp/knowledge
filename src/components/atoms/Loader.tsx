import React, { forwardRef } from "react";

const Loader: React.FC = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className="h-10 bg-transparent text-center">
      Loading...
    </div>
  );
});

Loader.displayName = "Loader";

export default Loader;
