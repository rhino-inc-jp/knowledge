import React, { forwardRef } from 'react';

const Loader = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className="h-10 bg-transparent text-center">
      読み込み中...
    </div>
  );
});

Loader.displayName = 'Loader';

export default Loader;
