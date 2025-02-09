interface Window {
    __RENDER_COVERAGE__?: Map<
        string,
        {
            [K in number]?: import('./types').Render;
        }
    >;
}
