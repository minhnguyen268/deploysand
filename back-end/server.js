const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
// dotenv.config({ path: "./docker.config.env" });

console.log("DATABASE", process.env.DATABASE);

const http = require("http");
const HeThong = require("./models/HeThong");
const TelegramService = require("./services/telegram.service");
const app = require("./app");
const jwt = require("jsonwebtoken");
const { clientEndpoint } = require("./configs/endpoint");
const GameXocDia1PService = require("./services/game.xocdia1p.service");
const GameKeno1PService = require("./services/game.keno1p.service");
const GameKeno3PService = require("./services/game.keno3p.service");
const GameKeno5PService = require("./services/game.keno5p.service");
const GameXucXac1PService = require("./services/game.xucxac1p.service");
const GameXucXac3PService = require("./services/game.xucxac3p.service");
const GameXoSo3PService = require("./services/game.xoso3p.service");
const GameXoSo5PService = require("./services/game.xoso5p.service");
const server = http.createServer(app);

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log("Error: ", err);
  console.log(err.name, err.message);
  process.exit(1);
});

// Database connection
require("./services/mongodb.service");

// Redis connection
const RedisClient = require("./services/redis.service");
const { verifyToken } = require("./utils/verifyToken");

const port = process.env.PORT || 8082;

// Socket IO connection
const io = require("socket.io")(server, {
  cors: {
    origin: clientEndpoint,
  },
  connectionStateRecovery: {
    // the backup duration of the sessions and the packets
    maxDisconnectionDuration: 10 * 60 * 1000,
    // whether to skip middlewares upon successful recovery
    skipMiddlewares: false,
  },
});
global._io = io;

// Socket IO middleware handle authentication
global._io.use(async (socket, next) => {
  const authToken = socket.handshake.auth.token;
  let token;
  try {
    if (authToken && authToken.startsWith("Bearer")) {
      token = authToken.split(" ")[1];
      if (!token) {
        throw new Error("Đăng nhập để tiếp tục");
      }

      const decode = await verifyToken(token);
      socket.join(`${decode.taiKhoan}`);
      global._io.role = decode.role;
      // console.log("ROOM:", global._io.sockets.adapter.rooms);
      next();
    } else {
      throw new Error("Login to continute");
    }
  } catch (err) {
    if (err.message) {
      return next(new Error(err.message));
    }
  }
});
global._io.on("connection", (socket) => {
  global._socket = socket;
  const SocketService = require("./services/socket.service");
  new SocketService().connection(socket);
});

setTimeout(() => {
  // Game Xóc Đĩa
  GameXocDia1PService.startGame();

  // Game Keno
  GameKeno1PService.startGame();
  GameKeno3PService.startGame();
  GameKeno5PService.startGame();

  // Game Tài Xỉu
  GameXucXac1PService.startGame();
  GameXucXac3PService.startGame();

  // Game Xổ Số
  GameXoSo3PService.startGame();
  GameXoSo5PService.startGame();
}, 1000);

// Init Bot Telegram
TelegramService.initBot().then(() => {
  console.log(`Init Successful telegram bot`);
});

const khoiTaoHeThongDB = async () => {
  try {
    await HeThong.findOneAndUpdate(
      {
        systemID: 1,
      },
      {},
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
  } catch (err) {
    console.log("Lỗi tạo hệ thống");
  }
};
khoiTaoHeThongDB();

server.listen(port, () => {
  console.log("Server đang chay tren cong", port);
});
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log("Error: ", err);
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
