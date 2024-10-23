// components/FriendRequests.tsx

import Image from "next/image";
import Link from "next/link";
import FriendRequestList from "./FriendRequestList";
import { db } from "@/lib/db";
import { auth } from "../../../../auth";

const FriendRequests = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  const requests = await db.followRequest.findMany({
    where: {
      receiverId: userId,
    },
    include: {
      sender: true,
    },
  });

  if (requests.length === 0) return null;
  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
      {/* TOP */}
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">Friend Requests</span>
        <Link href="/" className="text-blue-500 text-xs">
          See all
        </Link>
      </div>
      {/* USER */}
      <FriendRequestList requests={requests} />
    </div>
  );
};

export default FriendRequests;
