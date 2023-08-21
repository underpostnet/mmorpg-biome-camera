viewRender = (data) => html`
  <!DOCTYPE html>
  <html dir="ltr">
    <head>
      <title>${data.title}</title>
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <meta charset="UTF-8" />
      <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      ${data.jsDists
        .map((node_module) => html`<script type="application/javascript" src="${node_module}"></script>`)
        .join('')}
    </head>
    <body>
      <script async type="module" src="./app.js"></script>
    </body>
  </html>
`;
