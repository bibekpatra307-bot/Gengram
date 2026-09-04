import { db } from './index.ts';
import { posts, comments, likes, users, messages } from './schema.ts';
import { desc, eq, and, or } from 'drizzle-orm';

export async function getFeedPosts() {
  try {
    const allPosts = await db
      .select({
        id: posts.id,
        type: posts.type,
        mediaUrl: posts.mediaUrl,
        caption: posts.caption,
        location: posts.location,
        likesCount: posts.likesCount,
        commentsCount: posts.commentsCount,
        createdAt: posts.createdAt,
        author: {
          id: users.id,
          uid: users.uid,
          username: users.username,
          displayName: users.displayName,
          avatar: users.avatar,
          isVerified: users.isVerified,
        },
      })
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .orderBy(desc(posts.createdAt))
      .limit(50);

    return allPosts;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    throw new Error('Failed to fetch feed posts', { cause: error });
  }
}

export async function createPost(data: {
  userId: number;
  type: string;
  mediaUrl: string;
  caption?: string;
  location?: string;
}) {
  try {
    const result = await db.insert(posts).values(data).returning();
    return result[0];
  } catch (error) {
    console.error('Failed to create post:', error);
    throw new Error('Failed to create post', { cause: error });
  }
}

export async function toggleLikePost(postId: number, userId: number) {
  try {
    const existing = await db
      .select()
      .from(likes)
      .where(and(eq(likes.postId, postId), eq(likes.userId, userId)))
      .limit(1);

    if (existing.length > 0) {
      await db
        .delete(likes)
        .where(and(eq(likes.postId, postId), eq(likes.userId, userId)));
      return { liked: false };
    } else {
      await db.insert(likes).values({ postId, userId });
      return { liked: true };
    }
  } catch (error) {
    console.error('Failed to toggle post like:', error);
    throw new Error('Failed to toggle post like', { cause: error });
  }
}

export async function addPostComment(postId: number, userId: number, content: string) {
  try {
    const result = await db
      .insert(comments)
      .values({ postId, userId, content })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Failed to add comment:', error);
    throw new Error('Failed to add comment', { cause: error });
  }
}

export async function getDirectMessages(user1Id: number, user2Id: number) {
  try {
    const msgs = await db
      .select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, user1Id), eq(messages.receiverId, user2Id)),
          and(eq(messages.senderId, user2Id), eq(messages.receiverId, user1Id))
        )
      )
      .orderBy(messages.createdAt);
    return msgs;
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    throw new Error('Failed to fetch messages', { cause: error });
  }
}

export async function sendDirectMessage(data: {
  senderId: number;
  receiverId: number;
  content: string;
  mediaUrl?: string;
}) {
  try {
    const result = await db.insert(messages).values(data).returning();
    return result[0];
  } catch (error) {
    console.error('Failed to send message:', error);
    throw new Error('Failed to send message', { cause: error });
  }
}
