// components/ProfileCard.tsx
import { db } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { auth } from "../../../../auth";

const ProfileCard = async () => {
  // Get the current session using next-auth
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  // Fetch the user from the database
  const user = await db.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      _count: {
        select: {
          followers: true,
        },
      },
    },
  });

  if (!user) return null;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-6">
      <div className="h-20 relative">
        {/* <Image
          src={user.cover || "/noCover.png"}
          alt="Cover Image"
          fill
          className="rounded-md object-cover"
        /> */}
        <Image
          src={user.image || "/noAvatar.png"}
          alt="User Avatar"
          width={48}
          height={48}
          className="rounded-full object-cover w-12 h-12 absolute left-0 right-0 m-auto -bottom-6 ring-1 ring-white z-10"
        />
      </div>
      <div className="h-20 flex flex-col gap-2 items-center">
        {/* <span className="font-semibold">
          {user.name && user.surname
            ? `${user.name} ${user.surname}`
            : user.username}
        </span> */}
        <div className="flex items-center gap-4">
          <div className="flex">
            {/* Replace with dynamic follower avatars if available */}
            <Image
              src="/noAvatar.png"
              alt="Follower Avatar"
              width={12}
              height={12}
              className="rounded-full object-cover w-3 h-3"
            />
            <Image
              src="/noAvatar.png"
              alt="Follower Avatar"
              width={12}
              height={12}
              className="rounded-full object-cover w-3 h-3"
            />
            <Image
              src="/noAvatar.png"
              alt="Follower Avatar"
              width={12}
              height={12}
              className="rounded-full object-cover w-3 h-3"
            />
          </div>
          <span className="text-xs text-gray-500">
            {user._count.followers} Followers
          </span>
        </div>
        <Link href={`/profile/${user.id}`}>
          <button className="bg-blue-500 text-white text-xs p-2 rounded-md">
            My Profile
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProfileCard;
