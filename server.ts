import express from 'express';
import http from 'http';
import path from 'path';
import { Server as SocketIOServer } from 'socket.io';
import { createServer as createViteServer } from 'vite';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser, getUserByUid, getAllUsers } from './src/db/users.ts';
import { getFeedPosts, createPost, toggleLikePost, addPostComment, getDirectMessages, sendDirectMessage } from './src/db/posts.ts';

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const io = new SocketIOServer(server, {
    cors: { origin: '*' },
  });

  const PORT = 3000;

  app.use(express.json());

  // Socket.io Real-Time Engine (Chat, Typing, Calling)
  io.on('connection', (socket) => {
    socket.on('join_user_room', (userId: string) => {
      socket.join(`user_${userId}`);
    });

    socket.on('send_message', (data: { receiverId: string; senderId: string; message: any }) => {
      io.to(`user_${data.receiverId}`).emit('receive_message', data);
      socket.emit('message_sent', data);
    });

    socket.on('typing', (data: { receiverId: string; senderId: string; isTyping: boolean }) => {
      io.to(`user_${data.receiverId}`).emit('user_typing', data);
    });

    socket.on('initiate_call', (data: { caller: any; recipientId: string; isVideo: boolean }) => {
      io.to(`user_${data.recipientId}`).emit('incoming_call', data);
    });

    socket.on('end_call', (data: { recipientId: string }) => {
      io.to(`user_${data.recipientId}`).emit('call_terminated', data);
    });
  });

  // REST API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', engine: 'PostgreSQL + Cloud SQL + Socket.io' });
  });

  // User synchronization with Firebase Auth & PostgreSQL
  app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { uid, email, name, picture } = req.user!;
      const username = req.body.username || email?.split('@')[0] || `user_${uid.slice(0, 6)}`;
      const displayName = req.body.displayName || name || username;

      const user = await getOrCreateUser({
        uid,
        email: email || '',
        username,
        displayName,
        avatar: picture || '',
        bio: req.body.bio || '',
      });

      res.json({ success: true, user });
    } catch (error: any) {
      console.error('Error syncing user:', error);
      res.status(500).json({ error: error.message || 'Failed to sync user' });
    }
  });

  // Fetch all users for discovery & messaging
  app.get('/api/users', async (req, res) => {
    try {
      const usersList = await getAllUsers();
      res.json(usersList);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch users' });
    }
  });

  // Get Feed Posts
  app.get('/api/posts', async (req, res) => {
    try {
      const feed = await getFeedPosts();
      res.json(feed);
    } catch (error: any) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch feed' });
    }
  });

  // Create New Post
  app.post('/api/posts', requireAuth, async (req: AuthRequest, res) => {
    try {
      const dbUser = await getUserByUid(req.user!.uid);
      if (!dbUser) {
        return res.status(404).json({ error: 'User not registered in database' });
      }

      const { mediaUrl, caption, location, type = 'image' } = req.body;
      if (!mediaUrl) {
        return res.status(400).json({ error: 'Media URL is required' });
      }

      const post = await createPost({
        userId: dbUser.id,
        mediaUrl,
        caption,
        location,
        type,
      });

      // Notify connected clients of new post
      io.emit('new_post_published', { post, author: dbUser });

      res.status(201).json({ success: true, post });
    } catch (error: any) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: error.message || 'Failed to create post' });
    }
  });

  // Toggle Post Like
  app.post('/api/posts/:id/like', requireAuth, async (req: AuthRequest, res) => {
    try {
      const dbUser = await getUserByUid(req.user!.uid);
      if (!dbUser) {
        return res.status(404).json({ error: 'User not registered in database' });
      }

      const postId = parseInt(req.params.id, 10);
      const result = await toggleLikePost(postId, dbUser.id);
      res.json(result);
    } catch (error: any) {
      console.error('Error toggling like:', error);
      res.status(500).json({ error: error.message || 'Failed to toggle like' });
    }
  });

  // Add Comment
  app.post('/api/posts/:id/comment', requireAuth, async (req: AuthRequest, res) => {
    try {
      const dbUser = await getUserByUid(req.user!.uid);
      if (!dbUser) {
        return res.status(404).json({ error: 'User not registered in database' });
      }

      const postId = parseInt(req.params.id, 10);
      const { content } = req.body;
      if (!content) {
        return res.status(400).json({ error: 'Comment content cannot be empty' });
      }

      const comment = await addPostComment(postId, dbUser.id, content);
      res.status(201).json({ success: true, comment, author: dbUser });
    } catch (error: any) {
      console.error('Error adding comment:', error);
      res.status(500).json({ error: error.message || 'Failed to add comment' });
    }
  });

  // Fetch Direct Messages between users
  app.get('/api/messages/:targetUserId', requireAuth, async (req: AuthRequest, res) => {
    try {
      const dbUser = await getUserByUid(req.user!.uid);
      if (!dbUser) {
        return res.status(404).json({ error: 'User not registered in database' });
      }

      const targetUserId = parseInt(req.params.targetUserId, 10);
      const history = await getDirectMessages(dbUser.id, targetUserId);
      res.json(history);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch messages' });
    }
  });

  // Send Direct Message
  app.post('/api/messages', requireAuth, async (req: AuthRequest, res) => {
    try {
      const dbUser = await getUserByUid(req.user!.uid);
      if (!dbUser) {
        return res.status(404).json({ error: 'User not registered in database' });
      }

      const { receiverId, content, mediaUrl } = req.body;
      if (!receiverId || !content) {
        return res.status(400).json({ error: 'Receiver ID and content are required' });
      }

      const message = await sendDirectMessage({
        senderId: dbUser.id,
        receiverId: parseInt(receiverId, 10),
        content,
        mediaUrl,
      });

      // Emit real-time message via socket
      io.to(`user_${receiverId}`).emit('receive_message', { message, sender: dbUser });

      res.status(201).json({ success: true, message });
    } catch (error: any) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: error.message || 'Failed to send message' });
    }
  });

  // Vite Middleware for client frontend
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Gengram Full-Stack Engine running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
