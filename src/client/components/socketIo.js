const socketIo = {
  Data: {
    elements: {},
  },
  init: function () {
    this.socket = io(ioHost);

    this.socket.on('connect', () => {
      console.log(`socket.io event: connect | session id: ${this.socket.id}`);
    });

    this.socket.on('connect_error', (err) => {
      console.log(`socket.io event: connect_error | reason: ${err.message}`);
    });

    this.socket.on('disconnect', (reason) => {
      console.log(`socket.io event: disconnect | reason: ${reason}`);
      this.Data.elements = {};
      pixi.removeAll();
    });

    types.map((type) =>
      this.socket.on(type, (...args) => {
        // console.log(`socket.io event: update ${type} | reason: ${args}`);
        const element = JSON.parse(args);
        if (!this.Data.elements[type]) this.Data.elements[type] = [];
        let indexElement = this.Data.elements[type].findIndex((e) => e.id === element.id);

        switch (element.status) {
          case 'disconnect':
            if (indexElement > -1) {
              this.Data.elements[type].splice(indexElement, 1);
              pixi.remove(type, element, indexElement);
              return;
            }
            break;
          case 'new':
            if (indexElement === -1) {
              this.Data.elements[type].push(element);
              indexElement = this.Data.elements[type].length - 1;
              pixi.update(type, element, indexElement);
            }
            break;
          case 'update':
            if (
              this.Data.elements[type][indexElement].x !== element.x ||
              this.Data.elements[type][indexElement].y !== element.y
            ) {
              const direction = getJoystickDirection(
                this.Data.elements[type][indexElement].x,
                this.Data.elements[type][indexElement].y,
                element.x,
                element.y
              );
              Object.keys(element).map((attr) => {
                this.Data.elements[type][indexElement][attr] = element[attr];
              });
              pixi.update(type, this.Data.elements[type][indexElement], indexElement, direction);
            }
            break;
          default:
            break;
        }
      })
    );
  },
};

socketIo.init();
