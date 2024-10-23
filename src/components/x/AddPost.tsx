"use client";


// import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useState } from "react";
import AddPostButton from "./AddPostButton";
import { addPost } from "../actions";
import { useCurrentUser } from "../auth/hooks/use-current-user";

const AddPost = () => {
  const user = useCurrentUser();
  const [img, setImg] = useState<any>();

  if (user === undefined) {
    return "Loading...";
  }

  if (!user) {
    return "Please sign in to add a post.";
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex gap-4 justify-between text-sm">
      {/* AVATAR */}
      <Image
        src={user.image || "/noAvatar.png"}
        alt="User Avatar"
        width={48}
        height={48}
        className="w-12 h-12 object-cover rounded-full"
      />
      {/* POST */}
      <div className="flex-1">
        {/* TEXT INPUT */}
        <form
          action={(formData) => addPost(formData, img?.secure_url || "")}
          className="flex gap-4"
        >
          <textarea
            placeholder="What's on your mind?"
            className="flex-1 bg-slate-100 rounded-lg p-2"
            name="desc"
          ></textarea>
          <div className="">
            <Image
              src="/emoji.png"
              alt="Emoji Icon"
              width={20}
              height={20}
              className="w-5 h-5 cursor-pointer self-end"
            />
            <AddPostButton />
          </div>
        </form>
        {/* POST OPTIONS */}
        <div className="flex items-center gap-4 mt-4 text-gray-400 flex-wrap">
          {/* Uncomment and configure the Cloudinary Upload Widget if needed */}
          {/* <CldUploadWidget
            uploadPreset="social"
            onSuccess={(result, { widget }) => {
              setImg(result.info);
              widget.close();
            }}
          >
            {({ open }) => {
              return (
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => open()}
                >
                  <Image src="/addimage.png" alt="Add Image" width={20} height={20} />
                  Photo
                </div>
              );
            }}
          </CldUploadWidget> */}
          <div className="flex items-center gap-2 cursor-pointer">
            <Image src="/addVideo.png" alt="Add Video" width={20} height={20} />
            Video
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <Image src="/poll.png" alt="Create Poll" width={20} height={20} />
            Poll
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <Image src="/addevent.png" alt="Add Event" width={20} height={20} />
            Event
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
