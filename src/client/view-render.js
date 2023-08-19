viewRender = (data) => html`
  <!DOCTYPE html>
  <html dir="ltr">
    <head>
      <title>${data.title}</title>
      <meta charset="UTF-8" />
      <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
    </head>
    <body>
      <script async type="module" src="./app.js"></script>
    </body>
  </html>
`;
