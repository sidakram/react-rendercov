import { useRef, useState, type PropsWithChildren } from "react";
import MemoText from "../widgets/MemoText";

function LevelFive({ children }: PropsWithChildren) {
    const [count, setCount] = useState(0);

    const ref = useRef(0);

    ref.current += 1;
    console.log("log.LevelFive.count", ref.current);

    return (
        <>
            <div>Level Five - <MemoText text={count} /> : <button className="local-btn-prim" data-testid="btn-level-Five" onClick={() => setCount(c => c+1)}>inc</button></div>
            {children}
        </>
    )
}

export default LevelFive;