const index = {
  init: function () {
    append(
      'body',
      html`
        <style>
          @font-face {
            font-family: 'retro-font';
            src: URL('/fonts/PressStart2P.ttf') format('truetype');
          }
          body {
            background: black;
            color: white;
            font-family: 'retro-font';
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
            font-family: 'retro-font';
            /*
            text-transform: uppercase;
            text-transform: lowercase;
            */
          }
          button:hover {
            color: white;
            border: 2px solid white;
          }
          .global-loading-content {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 1;
            color: black;
            ${borderChar(2, 'white')};
          }
          .global-loading-img {
            width: 30px;
            height: 30px;
          }
        </style>
        <menu class="abs"></menu>
        <div class="fix center global-loading-content" style="display: none">
          <div class="abs center">
            LOADING
            <br />
            <img class="inl global-loading-img" src="/gifts/points-loading.gif" />
          </div>
        </div>
      `
    );
    setTimeout(() => {
      this.ResponsiveController.init();
      this.KeysController.init();
    });
  },
  ResponsiveController: {
    Data: {
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
      this.Interval = setInterval(() => this.CallBack(), globalTimeEventInterval);
    },
  },
  KeysController: {
    Data: {
      activeKey: {},
    },
    Event: {
      'main-user': {
        ArrowLeft: () => (socketIo.Data.elements.user[0].x -= socketIo.Data.elements.user[0].vel),
        ArrowRight: () => (socketIo.Data.elements.user[0].x += socketIo.Data.elements.user[0].vel),
        ArrowUp: () => (socketIo.Data.elements.user[0].y -= socketIo.Data.elements.user[0].vel),
        ArrowDown: () => (socketIo.Data.elements.user[0].y += socketIo.Data.elements.user[0].vel),
      },
    },
    StartValidator: {
      'main-user': () =>
        socketIo.Data.elements.user && socketIo.Data.elements.user[0]
          ? newInstance(socketIo.Data.elements.user[0])
          : false,
    },
    EndValidator: {
      'main-user': (StartValidator) => {
        if (socketIo.Data.elements.user[0].x < 0) socketIo.Data.elements.user[0].x = 0;
        if (socketIo.Data.elements.user[0].y < 0) socketIo.Data.elements.user[0].y = 0;
        if (socketIo.Data.elements.user[0].x > matrixCells - socketIo.Data.elements.user[0].dimFactor)
          socketIo.Data.elements.user[0].x = matrixCells - socketIo.Data.elements.user[0].dimFactor;
        if (socketIo.Data.elements.user[0].y > matrixCells - socketIo.Data.elements.user[0].dimFactor)
          socketIo.Data.elements.user[0].y = matrixCells - socketIo.Data.elements.user[0].dimFactor;

        if (!objectEquals(StartValidator, socketIo.Data.elements.user[0])) {
          if (validateBiomeCollision(socketIo.Data.elements.user[0])) {
            socketIo.Data.elements.user[0] = StartValidator;
            return;
          }

          const direction = getJoystickDirection(
            StartValidator.x,
            StartValidator.y,
            socketIo.Data.elements.user[0].x,
            socketIo.Data.elements.user[0].y
          );
          socketIo.Data.elements.user[0].direction = direction;

          pixi.update('user', socketIo.Data.elements.user[0], 0, direction);
          grid.viewMatrixController();
          socketIo.socket.emit(
            'user',
            JSON.stringify({
              x: socketIo.Data.elements.user[0].x,
              y: socketIo.Data.elements.user[0].y,
              id: socketIo.Data.elements.user[0].id,
              direction,
              status: 'update',
            })
          );
        }
      },
    },
    init: function () {
      window.onkeydown = (e) => (console.log('onkeydown', e.key), (this.Data.activeKey[e.key] = true));
      window.onkeyup = (e) => (console.log('onkeyup', e.key), delete this.Data.activeKey[e.key]);
      setInterval(() => {
        Object.keys(this.StartValidator).map((key) => {
          const StartValidator = this.StartValidator[key]();
          if (!StartValidator) return;
          Object.keys(this.Data.activeKey).map((activeKey) =>
            this.Event[key][activeKey] ? this.Event[key][activeKey]() : null
          );
          this.EndValidator[key](StartValidator);
        });
      }, globalTimeEventInterval);
    },
  },
};

index.init();
