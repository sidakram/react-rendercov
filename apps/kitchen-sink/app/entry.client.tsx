
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

startTransition(() => {
    hydrateRoot(
        document,
        // Disabled strict mode to avoid double rendering
        <StrictMode> 
            <HydratedRouter />
        </StrictMode>
    );
});
