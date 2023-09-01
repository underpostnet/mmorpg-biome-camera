const index = {
  init: function () {
    append(
      'body',
      html`
        <style>
          body {
            background: black;
            color: white;
            font-family: monospace;
          }
          menu {
            top: 10px;
            left: 10px;
            padding: 0px;
            margin: 0px;
            z-index: 1;
          }
          button {
            background: rgba(0, 0, 0, 0.8);
            /* outline: auto; */
            outline: none !important;
            padding: 8px;
            color: yellow;
            border: 2px solid yellow;
            cursor: pointer;
            text-transform: capitalize;
            margin: 3px;
            width: -webkit-fill-available;
            text-align: left;
            /* 
            text-transform: uppercase;
            text-transform: lowercase; 
            */
          }
          button:hover {
            color: white;
            border: 2px solid white;
          }
        </style>
        <menu class="abs"></menu>
      `
    );
    setTimeout(() => {
      this.ResponsiveController.init();
      this.KeysController.init();
    });
  },
  ResponsiveController: {
    Data: {
      Interval: 15,
      Responsive: {},
    },
    getResponsiveData: function () {
      return newInstance(this.Data.Responsive);
    },
    getResponsiveDataAmplitude: function () {
      const ResponsiveDataAmplitude = newInstance(this.Data.Responsive);
      ResponsiveDataAmplitude.minValue = ResponsiveDataAmplitude.minValue * matrixCellsAmplitude;
      ResponsiveDataAmplitude.maxValue = ResponsiveDataAmplitude.maxValue * matrixCellsAmplitude;
      return ResponsiveDataAmplitude;
    },
    Event: {},
    init: function () {
      this.CallBack = () => {
        const Data = getResponsiveData();
        if (Data.minValue !== this.Data.Responsive.minValue || Data.maxValue !== this.Data.Responsive.maxValue) {
          this.Data.Responsive = Data;
          Object.keys(this.Event).map((key) => this.Event[key]());
        }
      };
      this.CallBack();
      this.Interval = setInterval(() => this.CallBack(), this.Data.Interval);
    },
  },
  KeysController: {
    Data: {
      activeKey: {},
    },
    init: function () {
      window.onkeydown = (e) => (console.log('onkeydown', e.key), (this.Data.activeKey[e.key] = true));
      window.onkeyup = (e) => (console.log('onkeyup', e.key), delete this.Data.activeKey[e.key]);
      setInterval(() => {
        if (socketIo.Data.elements.user && socketIo.Data.elements.user[0]) {
          const originElement = newInstance(socketIo.Data.elements.user[0]);
          if (this.Data.activeKey['ArrowLeft']) {
            socketIo.Data.elements.user[0].x -= socketIo.Data.elements.user[0].vel;
          }
          if (this.Data.activeKey['ArrowRight']) {
            socketIo.Data.elements.user[0].x += socketIo.Data.elements.user[0].vel;
          }
          if (this.Data.activeKey['ArrowUp']) {
            socketIo.Data.elements.user[0].y -= socketIo.Data.elements.user[0].vel;
          }
          if (this.Data.activeKey['ArrowDown']) {
            socketIo.Data.elements.user[0].y += socketIo.Data.elements.user[0].vel;
          }

          if (socketIo.Data.elements.user[0].x < 0) socketIo.Data.elements.user[0].x = 0;
          if (socketIo.Data.elements.user[0].y < 0) socketIo.Data.elements.user[0].y = 0;
          if (socketIo.Data.elements.user[0].x > matrixCells - socketIo.Data.elements.user[0].dimFactor)
            socketIo.Data.elements.user[0].x = matrixCells - socketIo.Data.elements.user[0].dimFactor;
          if (socketIo.Data.elements.user[0].y > matrixCells - socketIo.Data.elements.user[0].dimFactor)
            socketIo.Data.elements.user[0].y = matrixCells - socketIo.Data.elements.user[0].dimFactor;

          if (!objectEquals(originElement, socketIo.Data.elements.user[0])) {
            if (validateBiomeCollision(socketIo.Data.elements.user[0])) {
              socketIo.Data.elements.user[0] = originElement;
              return;
            }

            const direction = getJoystickDirection(
              originElement.x,
              originElement.y,
              socketIo.Data.elements.user[0].x,
              socketIo.Data.elements.user[0].y
            );
            socketIo.Data.elements.user[0].direction = direction;

            pixi.update('user', socketIo.Data.elements.user[0], 0, direction);
            grid.viewMatrixController();
            socketIo.socket.emit('user', JSON.stringify(socketIo.Data.elements.user[0]));
          }
        }
      }, 15);
    },
  },
};

index.init();
