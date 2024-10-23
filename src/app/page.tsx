
import AddPost from "@/components/x/AddPost";
import Feed from "@/components/x/feed/Feed";
import LeftMenu from "@/components/x/leftMenu/LeftMenu";
import RightMenu from "@/components/x/rightMenu/RightMenu";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";

const Homepage = async () => {

  const user = await currentUser();
  if (!user) redirect("/login");
  // if (!user?.onboarded) redirect("/onboarding");
  
  return (
    <div className="flex gap-6 pt-6">
      <div className="hidden xl:block w-[20%]">
        <LeftMenu type="home" />
      </div>
      <div className="w-full lg:w-[70%] xl:w-[50%]">
        <div className="flex flex-col gap-6">
          {/* <Stories /> */}
          <AddPost />
          <Feed />
        </div>
      </div>
      <div className="hidden lg:block w-[30%]">
        <RightMenu />
      </div>
    </div>
  );
};

export default Homepage;
