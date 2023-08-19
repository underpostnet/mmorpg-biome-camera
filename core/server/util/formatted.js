const srcFormatted = (src) => src.replaceAll('html`', '`').replaceAll('css`', '`');

const pathViewFormatted = (path) => (path === '/' ? path : `${path}/`);

export { srcFormatted, pathViewFormatted };
