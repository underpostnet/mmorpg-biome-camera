const socketIo = {
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
    });

    types.map((type) =>
      this.socket.on(type, (...args) => {
        console.log(`socket.io event: update ${type} | reason: ${args}`);
        const element = JSON.parse(args);

        let indexElement = elements[type].findIndex((e) => e.id === element.id);
        if (indexElement === -1) {
          elements[type].push(element);
          indexElement = elements[type].length - 1;
        } else elements[type][indexElement] = element;

        pixi.update(type, elements[type][indexElement]);
      })
    );
  },
};

socketIo.init();
