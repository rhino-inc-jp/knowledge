import React, { forwardRef } from "react";

const Loader = forwardRef<HTMLDivElement>((_, ref) => (
  <div ref={ref} className="h-10 bg-transparent text-center">
    Loading...
  </div>
));

Loader.displayName = "Loader";

export default Loader;
