const SocketIO = require('./Socket');

exports.core = kernel => {
  let timeout = null;
  function loadSocketService() {
    if (kernel.httpServer) {
      clearTimeout(timeout);
      // must setup first
      SocketIO.setup(kernel.httpServer);
      SocketIO.init();
    } else {
      timeout = setTimeout(loadSocketService, 1000);
    }
  }

  loadSocketService();
};

exports.services = {
  Socket: {
    emitToUsers: SocketIO.emitToUsers,
    getUserConnecting: SocketIO.getUserConnecting
  }
};
