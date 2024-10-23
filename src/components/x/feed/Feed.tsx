// components/x/feed/Feed.tsx

import { auth } from "../../../../auth";
import Post from "./Post";
import { db } from "@/lib/db";


interface FeedProps {
  userId?: string;
}

const Feed = async ({ userId }: FeedProps) => {
  const session = await auth();
  const currentUserId = session?.user?.id;

  let posts: any[] = [];

  if (userId) {
    // Fetch posts for a specific user by userId
    posts = await db.post.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: true,
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } else if (currentUserId) {
    // Fetch posts from the current user and users they are following
    const following = await db.follower.findMany({
      where: {
        followerId: currentUserId,
      },
      select: {
        followingId: true,
      },
    });

    const followingIds = following.map((f) => f.followingId);
    const ids = [currentUserId, ...followingIds];

    posts = await db.post.findMany({
      where: {
        userId: {
          in: ids,
        },
      },
      include: {
        user: true,
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } else {
    // If no user is logged in, you might want to fetch public posts or show a message
    posts = [];
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex flex-col gap-12">
      {posts.length ? (
        posts.map((post) => <Post key={post.id} post={post} />)
      ) : (
        <p>No posts found!</p>
      )}
    </div>
  );
};

export default Feed;
