const srcFormatted = (src) => src.replaceAll('html`', '`').replaceAll('css`', '`');

const pathViewFormatted = (path) => (path === '/' ? path : `${path}/`);

const JSONweb = (data) => 'JSON.parse(`' + JSON.stringify(data) + '`)';

export { srcFormatted, pathViewFormatted, JSONweb };
