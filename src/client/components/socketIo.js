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
        console.log(`socket.io event: update ${type} | reason: ${args}`);
        const element = JSON.parse(args);
        if (!this.Data.elements[type]) this.Data.elements[type] = [];
        let indexElement = this.Data.elements[type].findIndex((e) => e.id === element.id);
        if (indexElement === -1) {
          this.Data.elements[type].push(element);
          indexElement = this.Data.elements[type].length - 1;
        } else this.Data.elements[type][indexElement] = element;

        pixi.update(element, indexElement);
      })
    );
  },
};

socketIo.init();
