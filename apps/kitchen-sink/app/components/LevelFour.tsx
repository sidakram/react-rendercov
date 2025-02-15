import { memo, useRef, useState, type PropsWithChildren } from "react";

function LevelFourChildOne({ parentCount }: { parentCount: number }) {
    const [count, setCount] = useState(0);

    const ref = useRef(0);

    ref.current += 1;
    console.log("log.LevelFourChildOne.count", ref.current, parentCount);

    return (
        <>
            <div>Level LevelFourChildOne - {count} - P{parentCount} : <button className="local-btn-prim" data-testid="btn-level-FourChildOne" onClick={() => setCount(c => c+1)}>inc</button></div>
        </>
    )
}

function LevelFour({ children }: PropsWithChildren) {
    const [count, setCount] = useState(0);

    const ref = useRef(0);

    ref.current += 1;
    console.log("log.LevelFour.count", ref.current);

    return (
        <>
            <div>Level Four - {count} : <button className="local-btn-prim" data-testid="btn-level-"onClick={() => setCount(c => c+1)}>inc</button></div>
            <LevelFourChildOne parentCount={count}/>
            {children}
        </>
    )
}

export default memo(LevelFour);