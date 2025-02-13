import { memo, useRef, useState, type PropsWithChildren } from "react";

function LevelThree({ children }: PropsWithChildren) {
    const [count, setCount] = useState(0);

    const ref = useRef(0);

    ref.current += 1;
    console.log("log.LevelThree.count", ref.current);

    return (
        <>
            <div>Level Three - {count} : <button className="local-btn-prim" data-testid="btn-level-Three" onClick={() => setCount(c => c+1)}>inc</button></div>
            {children}
        </>
    )
}

export default memo(LevelThree);