// vanilla-js thin layer

/*

Name: es6-string-html
Id: Tobermory.es6-string-html
Description: Syntax highlighting in es6 multiline strings
Version: 2.12.1
Publisher: Tobermory
VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html

Name: es6-string-css
Id: bashmish.es6-string-css
Description: Highlight CSS language in ES6 template literals
Version: 0.1.0
Publisher: Mikhail Bashkirov
VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=bashmish.es6-string-css

Name: lit-html
Id: bierner.lit-html
Description: Syntax highlighting and IntelliSense for html inside of JavaScript and TypeScript tagged template strings
Version: 1.11.1
Publisher: Matt Bierner
VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=bierner.lit-html

*/

const s = (el) => document.querySelector(el);
const htmls = (el, html) => (s(el).innerHTML = html);
const append = (el, html) => s(el).insertAdjacentHTML('beforeend', html);
const prepend = (el, html) => s(el).insertAdjacentHTML('afterbegin', html);
const sa = (el) => document.querySelectorAll(el); // .forEach((currentValue, currentIndex, listObj)

// el.classList.remove(targetClass);
// el.classList.add(targetClass);

const borderChar = (px, color) => html`
  text-shadow: ${px}px -${px}px ${px}px ${color}, -${px}px ${px}px ${px}px ${color}, -${px}px -${px}px ${px}px ${color},
  ${px}px ${px}px ${px}px ${color};
`;

const renderTable = (data, options) =>
  data[0]
    ? html`
        <table>
          <tr>
            ${Object.keys(data[0])
              .map((key) => html`<th class="header-table">${key}</th>`)
              .join('')}
            ${options && options.actions ? (options.actionsHeader ? options.actionsHeader : '<th></th>') : ''}
          </tr>
          ${data
            .map(
              (row) =>
                html`<tr>
                  ${Object.keys(data[0])
                    .map((key) => html`<th>${row[key]}</th>`)
                    .join('') + (options && options.actions ? options.actions(row) : '')}
                  '
                </tr>`
            )
            .join('')}
        </table>
      `
    : '';

const copyData = (data) =>
  new Promise((resolve, reject) =>
    navigator.clipboard.writeText(data).then(
      () => resolve(true),
      () => reject(false)
    )
  );

const pasteData = () => new Promise((resolve) => navigator.clipboard.readText().then((clipText) => resolve(clipText)));

const renderMediaQuery = (mediaData) => {
  //  first limit should be '0'
  return html`
    <style>
      ${mediaData
        .map(
          (mediaState) => css`
            @media only screen and (min-width: ${mediaState.limit}px) {
              ${mediaState.css}
            }
          `
        )
        .join('')}
    </style>
  `;
};

const setURI = (uri, objData, title) => history.pushState(objData, title, uri);

const getURI = () => location.pathname;

const serviceRequest = (url, options) => {
  if (typeof url === 'function') url = url();
  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then(async (res) => {
        let raw = await res.clone();
        raw = await raw.text();
        if (options && options.log) console.log(`${url} raw: `, raw);
        if (options && options.raw === true) return raw;
        let returnObj;
        try {
          returnObj = await res.json();
        } catch (error) {
          return raw;
        }
        return { ...returnObj, codeStatus: res.status, raw };
      })
      .then((res) => {
        if (options && options.log) console.log('fetch success', url, res);
        return resolve(res);
      })
      .catch((error) => {
        if (options && options.log) console.error('fetch error ', url, error);
        return reject(error);
      });
  });
};

const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  let querys_ = {};
  for (const param of params) {
    querys_[param[0]] = param[1];
  }
  return querys_;
};

const generateBlobSrc = (rawContent, mimeType) =>
  window.URL.createObjectURL(new Blob([rawContent], { type: mimeType }));

const preHTML = (raw) => raw.replaceAll('&', '&amp').replaceAll('<', '&lt').replaceAll('>', '&gt');

const disableOptionsClick = (element, types) => {
  if (types.includes('menu'))
    s(element).oncontextmenu = function () {
      return false;
    };
  if (types.includes('drag'))
    s(element).ondragstart = function () {
      return false;
    };
  if (types.includes('select'))
    s(element).onselectstart = function () {
      return false;
    };
};

const checkFullScreen = () => {
  // document.fullscreen
  return document.fullscreenElement ? true : false;
};

const fullScreenOut = () => {
  document.exitFullscreen();
};

const fullScreenIn = () => {
  const el = document.documentElement;
  const rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;
  if (typeof rfs != 'undefined' && rfs) {
    rfs.call(el);
  } else if (typeof window.ActiveXObject != 'undefined') {
    const wscript = new ActiveXObject('WScript.Shell');
    if (wscript != null) {
      wscript.SendKeys('{F11}');
    }
  }
};

const dimState = () =>
  window.innerWidth > window.innerHeight
    ? { minValue: window.innerHeight, maxValue: window.innerWidth, minType: 'height', maxType: 'width' }
    : { minValue: window.innerWidth, maxValue: window.innerHeight, minType: 'width', maxType: 'height' };

const isElement = (element) => element instanceof Element || element instanceof HTMLDocument;

const downloader = (name, mime, raw) => {
  let content;
  if (isElement(raw)) content = raw.toDataURL(mime);
  else if (typeof raw === 'object') content = generateBlobSrc(JSON.stringify(raw, null, 4), mime);
  else if (typeof raw === 'string') content = generateBlobSrc(raw, mime);
  else return;
  const idDownload = 'downloader-' + s4() + s4();
  append('body', html`<a class="${idDownload}" style="display: none"></a>`);
  s(`.${idDownload}`).href = content;
  s(`.${idDownload}`).download = name;
  s(`.${idDownload}`).click();
  s(`.${idDownload}`).remove();
};
