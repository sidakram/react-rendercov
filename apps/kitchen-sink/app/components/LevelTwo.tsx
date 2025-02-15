import { useContext, useRef, useState, type PropsWithChildren } from "react";
import DataContext from "~/contexts/Data";
import MemoText from "~/widgets/MemoText";
import BlankText from "./BlankTest";

export default function LevelTwo({ children }: PropsWithChildren) {
    const [count, setCount] = useState(0);
    const contextData = useContext(DataContext);

    const ref = useRef(0);

    ref.current += 1;
    console.log("log.LevelTwo.count", ref.current);

    return (
        <>
            <div>Level Two - <MemoText text={count} /> : <button className="local-btn-prim" data-testid="btn-level-Two" onClick={() => setCount(c => c + 1)}>inc</button></div>
            <BlankText text="Level Two" />
            <div>
                {contextData.name} : <button className="local-btn-prim" data-testid="btn-level-Two" onClick={() => contextData.setter(d => ({
                    ...d,
                    name: `${d.name.split('.')[0]}.${Math.random().toString().slice(-2)}`
                }))}>Change Name</button>
            </div>
            {children}
        </>
    )
}