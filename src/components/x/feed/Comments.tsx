// components/Comments.tsx

import CommentList from "./CommentList";
import { db } from "@/lib/db";

const Comments = async ({ postId }: { postId: string }) => {
  const comments = await db.comment.findMany({
    where: {
      postId,
    },
    include: {
      user: true,
    },
  });

  return (
    <div>
      <CommentList comments={comments} postId={postId} />
    </div>
  );
};

export default Comments;
