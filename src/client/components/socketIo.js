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
        pixi.update(type, JSON.parse(args));
      })
    );
  },
};

socketIo.init();
