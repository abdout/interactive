// app/profile/[id]/page.tsx

import Feed from "@/components/x/feed/Feed";
import LeftMenu from "@/components/x/leftMenu/LeftMenu";
import RightMenu from "@/components/x/rightMenu/RightMenu";
import { db } from "@/lib/db";
import Image from "next/image";
import { notFound } from "next/navigation";
import { auth } from "../../../../auth";

const Profile = async ({ params }: { params: { id: string } }) => {
  const id = params.id;

  // Fetch the user from the database
  const user = await db.user.findFirst({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          followers: true,
          followings: true,
          posts: true,
        },
      },
    },
  });

  // If the user doesn't exist, return a 404 page
  if (!user) return notFound();

  // Get the current session using next-auth
  const session = await auth();
  const currentUserId = session?.user?.id;

  let isBlocked = false;

  // Check if the current user is blocked by the profile owner
  if (currentUserId) {
    const res = await db.block.findFirst({
      where: {
        blockerId: user.id,
        blockedId: currentUserId,
      },
    });

    if (res) isBlocked = true;
  }

  // If the current user is blocked, return a 404 page
  if (isBlocked) return notFound();

  return (
    <div className="flex gap-6 pt-6">
      <div className="hidden xl:block w-[20%]">
        <LeftMenu type="profile" />
      </div>
      <div className="w-full lg:w-[70%] xl:w-[50%]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center justify-center">
            <div className="w-full h-64 relative">
              <Image
                src={user.cover || "/noCover.png"}
                alt="Cover Photo"
                fill
                className="rounded-md object-cover"
              />
              <Image
                src={user.image || "/noAvatar.png"}
                alt="Profile Avatar"
                width={128}
                height={128}
                className="w-32 h-32 rounded-full absolute left-0 right-0 m-auto -bottom-16 ring-4 ring-white object-cover"
              />
            </div>
            {/* <h1 className="mt-20 mb-4 text-2xl font-medium">
              {user.name && user.surname
                ? `${user.name} ${user.surname}`
                : user.username}
            </h1> */}
            <div className="flex items-center justify-center gap-12 mb-4">
              <div className="flex flex-col items-center">
                <span className="font-medium">{user._count.posts}</span>
                <span className="text-sm">Posts</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-medium">{user._count.followers}</span>
                <span className="text-sm">Followers</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-medium">{user._count.followings}</span>
                <span className="text-sm">Following</span>
              </div>
            </div>
          </div>
          <Feed userId={user.id} />
        </div>
      </div>
      <div className="hidden lg:block w-[30%]">
        <RightMenu user={user} />
      </div>
    </div>
  );
};

export default Profile;
