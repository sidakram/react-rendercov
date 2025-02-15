import { memo } from "react";

function Text({ text }: { text: number; }) {
    return <span><strong>{text}</strong></span>;
}

Text.displayName = 'MemoText';

export default memo(Text);