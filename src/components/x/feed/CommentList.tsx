// components/CommentList.tsx

"use client";

import { addComment } from "@/components/actions";
import { useCurrentUser } from "@/components/auth/hooks/use-current-user";
import { Comment, User } from "@prisma/client";
import Image from "next/image";
import { useOptimistic, useState } from "react";

type ExtendedUser = Partial<User> & {
  id: string;
  surname?: string | null;
  username?: string | null;
  image?: string | null;
  // Add any other fields that you need
};

type CommentWithUser = Comment & { user: ExtendedUser };

interface CommentListProps {
  comments: CommentWithUser[];
  postId: string;
}

const CommentList = ({ comments, postId }: CommentListProps) => {
  const user = useCurrentUser();
  const [commentState, setCommentState] = useState(comments);
  const [desc, setDesc] = useState("");

  const [optimisticComments, addOptimisticComment] = useOptimistic(
    commentState,
    (state: CommentWithUser[], value: CommentWithUser) => [value, ...state]
  );

  const add = async () => {
    if (!user || !desc) return;

    // Create an optimistic comment
    const optimisticComment: CommentWithUser = {
      id: Math.random().toString(),
      desc,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user.id,
      postId: postId,
      user: {
        id: user.id,
        username: user.username || "Sending...",
        image: user.image || "/noAvatar.png",
        name: user.name || "",
        // Add any other fields you need
      },
    };

    addOptimisticComment(optimisticComment);

    try {
      const createdComment = await addComment(postId, desc);
      setCommentState((prev) => [createdComment, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {user && (
        <div className="flex items-center gap-4">
          <Image
            src={user.image || "/noAvatar.png"}
            alt="User Avatar"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
          />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              add();
            }}
            className="flex-1 flex items-center justify-between bg-slate-100 rounded-xl text-sm px-6 py-2 w-full"
          >
            <input
              type="text"
              placeholder="Write a comment..."
              className="bg-transparent outline-none flex-1"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <button type="submit">
              <Image
                src="/emoji.png"
                alt="Add Emoji"
                width={16}
                height={16}
                className="cursor-pointer"
              />
            </button>
          </form>
        </div>
      )}
      <div>
        {optimisticComments.map((comment) => (
          <div className="flex gap-4 justify-between mt-6" key={comment.id}>
            {/* AVATAR */}
            <Image
              src={comment.user.image || "/noAvatar.png"}
              alt="User Avatar"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
            />
            {/* DESC */}
            <div className="flex flex-col gap-2 flex-1">
              <span className="font-medium">
                {comment.user.name && comment.user.surname
                  ? `${comment.user.name} ${comment.user.surname}`
                  : comment.user.username}
              </span>
              <p>{comment.desc}</p>
              <div className="flex items-center gap-8 text-xs text-gray-500 mt-2">
                <div className="flex items-center gap-4">
                  <Image
                    src="/like.png"
                    alt="Like"
                    width={12}
                    height={12}
                    className="cursor-pointer w-4 h-4"
                  />
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-500">0 Likes</span>
                </div>
                <div>Reply</div>
              </div>
            </div>
            {/* ICON */}
            <Image
              src="/more.png"
              alt="More Options"
              width={16}
              height={16}
              className="cursor-pointer w-4 h-4"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default CommentList;
