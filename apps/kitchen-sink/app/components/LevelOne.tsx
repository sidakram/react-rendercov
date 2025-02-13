import { useRef, useState, type PropsWithChildren } from "react";

export default function LevelOne({ children }: PropsWithChildren) {
    const [count, setCount] = useState(0);
    const ref = useRef(0);

    ref.current += 1;
    console.log("log.LevelOne.count", ref.current);
  

    return (
        <>
            <div>Level One - {count} : <button className="local-btn-prim" data-testid="btn-level-One" onClick={() => setCount(c => c+1)}>inc</button></div>
            {children}
        </>
    )
}