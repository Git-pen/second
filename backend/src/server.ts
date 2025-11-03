import 'dotenv/config';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import app from './app';
import prisma from './config/database';
import redis from './config/redis';
import { initializeSearchIndexes } from './config/meilisearch';

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

const io = new SocketServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);

  socket.on('join-cart', (userId: string) => {
    socket.join(`cart:${userId}`);
    console.log(`User ${userId} joined cart room`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

export { io };

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    await initializeSearchIndexes();

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 API URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

const gracefulShutdown = async () => {
  console.log('\n🛑 Shutting down gracefully...');

  httpServer.close(async () => {
    await prisma.$disconnect();
    redis.disconnect();
    console.log('✅ Server shut down complete');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('⚠️  Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

startServer();
