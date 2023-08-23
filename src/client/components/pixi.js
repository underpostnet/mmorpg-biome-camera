const pixi = {
  Data: {
    dim: 1200,
  },
  init: function () {
    append('body', html` <style class="css-controller-pixi"></style> `);
    this.app = new PIXI.Application({
      width: this.Data.dim,
      height: this.Data.dim,
      background: 'gray',
    });
    s('body').appendChild(this.app.view);
    s('canvas').classList.add('abs');
    s('canvas').classList.add('pixi-canvas');
    index.ResponsiveController.Event['pixi'] = () => {
      const ResponsiveData = index.ResponsiveController.Data.Responsive;
      htmls(
        '.css-controller-pixi',
        css`
          .pixi-canvas {
            width: ${ResponsiveData.minValue}px;
            height: ${ResponsiveData.minValue}px;
          }
          ${ResponsiveData.minType === 'height'
            ? css`
                .pixi-canvas {
                  top: 0px;
                  left: ${ResponsiveData.maxValue / 2 - ResponsiveData.minValue / 2}px;
                }
              `
            : css`
                .pixi-canvas {
                  top: ${ResponsiveData.maxValue / 2 - ResponsiveData.minValue / 2}px;
                  left: 0px;
                }
              `}
        `
      );
    };
  },
};

pixi.init();
