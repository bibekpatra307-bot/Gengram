import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export interface UserInput {
  uid: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
}

export async function getOrCreateUser(input: UserInput) {
  try {
    const result = await db.insert(users)
      .values({
        uid: input.uid,
        email: input.email,
        username: input.username,
        displayName: input.displayName,
        avatar: input.avatar || '',
        bio: input.bio || '',
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email: input.email,
          displayName: input.displayName,
          ...(input.avatar ? { avatar: input.avatar } : {}),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Failed in getOrCreateUser:', error);
    throw new Error('User synchronization failed', { cause: error });
  }
}

export async function getUserByUid(uid: string) {
  try {
    const result = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Failed to get user by UID:', error);
    throw new Error('Failed to retrieve user', { cause: error });
  }
}

export async function getAllUsers() {
  try {
    return await db.select().from(users);
  } catch (error) {
    console.error('Failed to retrieve users:', error);
    throw new Error('Failed to retrieve users', { cause: error });
  }
}
