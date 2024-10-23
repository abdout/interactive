// serverActions.ts

"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";


export const switchFollow = async (userId: string) => {
  const user = await currentUser();

  if (!user || !user.id) {
    throw new Error("User is not authenticated!");
  }

  const currentUserId = user.id;

  try {
    const existingFollow = await db.follower.findFirst({
      where: {
        followerId: currentUserId,
        followingId: userId,
      },
    });

    if (existingFollow) {
      await db.follower.delete({
        where: {
          id: existingFollow.id,
        },
      });
    } else {
      const existingFollowRequest = await db.followRequest.findFirst({
        where: {
          senderId: currentUserId,
          receiverId: userId,
        },
      });

      if (existingFollowRequest) {
        await db.followRequest.delete({
          where: {
            id: existingFollowRequest.id,
          },
        });
      } else {
        await db.followRequest.create({
          data: {
            senderId: currentUserId,
            receiverId: userId,
          },
        });
      }
    }
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const switchBlock = async (userId: string) => {
  const user = await currentUser();

  if (!user || !user.id) {
    throw new Error("User is not authenticated!");
  }

  const currentUserId = user.id;

  try {
    const existingBlock = await db.block.findFirst({
      where: {
        blockerId: currentUserId,
        blockedId: userId,
      },
    });

    if (existingBlock) {
      await db.block.delete({
        where: {
          id: existingBlock.id,
        },
      });
    } else {
      await db.block.create({
        data: {
          blockerId: currentUserId,
          blockedId: userId,
        },
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const acceptFollowRequest = async (userId: string) => {
  const user = await currentUser();

  if (!user || !user.id) {
    throw new Error("User is not authenticated!");
  }

  const currentUserId = user.id;

  try {
    const existingFollowRequest = await db.followRequest.findFirst({
      where: {
        senderId: userId,
        receiverId: currentUserId,
      },
    });

    if (existingFollowRequest) {
      await db.followRequest.delete({
        where: {
          id: existingFollowRequest.id,
        },
      });

      await db.follower.create({
        data: {
          followerId: userId,
          followingId: currentUserId,
        },
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const declineFollowRequest = async (userId: string) => {
  const user = await currentUser();

  if (!user || !user.id) {
    throw new Error("User is not authenticated!");
  }

  const currentUserId = user.id;

  try {
    const existingFollowRequest = await db.followRequest.findFirst({
      where: {
        senderId: userId,
        receiverId: currentUserId,
      },
    });

    if (existingFollowRequest) {
      await db.followRequest.delete({
        where: {
          id: existingFollowRequest.id,
        },
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const updateProfile = async (payload: {
  name?: string;
  description?: string;
  city?: string;
  school?: string;
  work?: string;
  website?: string;
  cover?: string;
  image?: string;
}) => {
  const Profile = z.object({
    image: z.string().optional(),
    cover: z.string().optional(),
    name: z.string().max(60).optional(),
    description: z.string().max(255).optional(),
    city: z.string().max(60).optional(),
    school: z.string().max(60).optional(),
    work: z.string().max(60).optional(),
    website: z.string().max(60).optional(),
  });

  const validatedFields = Profile.safeParse(payload);

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return { success: false, error: true };
  }

  const user = await currentUser();

  if (!user || !user.id) {
    return { success: false, error: true };
  }

  const currentUserId = user.id;

  try {
    await db.user.update({
      where: {
        id: currentUserId,
      },
      data: validatedFields.data,
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const switchLike = async (postId: string) => {
  const user = await currentUser();

  if (!user || !user.id) {
    throw new Error("User is not authenticated!");
  }

  const currentUserId = user.id;

  try {
    const existingLike = await db.like.findFirst({
      where: {
        postId,
        userId: currentUserId,
      },
    });

    if (existingLike) {
      await db.like.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      await db.like.create({
        data: {
          postId,
          userId: currentUserId,
        },
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong");
  }
};

export const addComment = async (postId: string, desc: string) => {
  const user = await currentUser();

  if (!user || !user.id) {
    throw new Error("User is not authenticated!");
  }

  const currentUserId = user.id;

  try {
    const createdComment = await db.comment.create({
      data: {
        desc,
        userId: currentUserId,
        postId,
      },
      include: {
        user: true,
      },
    });

    return createdComment;
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const addPost = async (formData: FormData, img: string) => {
  console.log("Received image URL in addPost:", img);
  const desc = formData.get("desc") as string;

  const Desc = z.string().min(1).max(255);

  const validatedDesc = Desc.safeParse(desc);

  if (!validatedDesc.success) {
    console.log("description is not valid");
    return;
  }

  const user = await currentUser();

  if (!user || !user.id) {
    throw new Error("User is not authenticated!");
  }

  const currentUserId = user.id;

  try {
    await db.post.create({
      data: {
        desc: validatedDesc.data,
        userId: currentUserId,
        img,
      },
    });

    revalidatePath("/");
  } catch (err) {
    console.log(err);
  }
};


export const deletePost = async (postId: string) => {
  const user = await currentUser();

  if (!user || !user.id) {
    throw new Error("User is not authenticated!");
  }

  const currentUserId = user.id;

  try {
    await db.post.delete({
      where: {
        id: postId,
        userId: currentUserId,
      },
    });
    revalidatePath("/");
  } catch (err) {
    console.log(err);
  }
};
