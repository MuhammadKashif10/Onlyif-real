const socketConnection = (io, app) => {
    let users = [];
    console.log("🚀 ~ socketConnection ~ users:", users)

const addUser = (userId, socketId) => {
  userId = userId.toString(); // force string
  const existing = users.find((user) => user.userId === userId);
  if (!existing) {
    users.push({ userId, socketId });
  } else {
    users = users.map(u =>
      u.userId === userId ? { userId, socketId } : u
    );
  }
  if (app) app.set("connectedUsers", users);
};

const findUser = (userId) => {
  console.log("🚀 ~ findUser ~ userId:", userId)
  userId = userId.toString();
  return users.find((user) => user.userId === userId);
};


  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
    if (app) app.set('connectedUsers', users);
  };

io.on('connection', (socket) => {
  console.log(`✅ New connection: ${socket.id}`);

  // client sends their userId after connecting
  socket.on('add-user', (userId) => {
    if (userId) {
        addUser(userId, socket.id);

      socket.join(userId.toString()); // join personal room
      console.log(`User ${userId} joined room`);
    }
  });




    // Send message to receiver
    socket.on('send-message', (data) => {
      // data = { sender, receiver, text }
      console.log('📩 send-message:', data);

      const user = findUser(data.receiver);
      console.log('Target user:', user);

      if (user) {
        const sid = user.socketId;
        console.log("🚀 ~ socketConnection ~ sid:", sid)
        // simulate DB _id for message
        data._id = Math.random();
        console.log('Sent message ✅', data);
        io.to(sid).emit('receive-message', data);
      }
    });

    // Manual removal
    socket.on('remove-user', () => {
      removeUser(socket.id);
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('❌ User disconnected');
      removeUser(socket.id);
    });
  });
};

module.exports = socketConnection;
