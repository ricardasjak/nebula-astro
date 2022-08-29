import React, { useCallback, useState } from 'react';

export function Toggle() {
    const [toggle, setToggle] = useState(false);

    const handleToggle = useCallback(() => {
        setToggle(v => !v);
    }, [])

    return <button onClick={handleToggle}>Toggle me {toggle ? 'ON' : 'OFF'}</button>
}
