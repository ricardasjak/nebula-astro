import React, { useState, useCallback } from "react";

export function Counter(): React.ReactElement {
  const [count, setCount] = useState(100);
  const handleClick = useCallback(() => setCount((p) => p + 1), []);

  return <h1 onClick={handleClick}>{count}</h1>;
}

