'use client';
import React, { useState } from "react";
import { User } from "@prisma/client";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";
import UpdateButton from "./UpdateButton";
import { updateProfile } from "@/components/actions";

const UpdateUser = ({ user }: { user: User }) => {
  const [cover, setCover] = useState<string>(user.cover || "");
  const [image, setImage] = useState<string>(user.cover || "");
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSuccess(false);
    setError(false);

    const formData = new FormData(e.currentTarget);

    const name = formData.get("name") as string;
    const description = (formData.get("description") as string) || ""; // Handle empty fields
    const city = (formData.get("city") as string) || ""; // Default to empty string if null
    const school = (formData.get("school") as string) || "";
    const work = (formData.get("work") as string) || "";
    const website = (formData.get("website") as string) || "";
    const cover = formData.get("cover") as string || "";
    const image = formData.get("image") as string || "";  

    try {
      const response = await updateProfile({
        name,
        description,
        city,
        school,
        work,
        website,
        cover,
        image,
      });
      if (response.success) {
        setSuccess(true);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  return (
    <div className="p-4">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white rounded-lg shadow-md flex flex-col gap-4 overflow-y-auto max-h-[80vh]" // Make form scrollable
      >
        <h1>Update Profile</h1>
        
        {/* COVER PIC UPLOAD */}
        <CldUploadWidget
          uploadPreset="social"
          onSuccess={(result: any, { widget }: { widget: any }) => {
            if (result.info && result.info.secure_url) {
              setImage(result.info.secure_url);
            } else {
              console.error("Upload failed: result.info or secure_url is undefined");
            }
            widget.close();
          }}
        >
          {({ open }) => (
            <div className="flex flex-col gap-4 my-4" onClick={() => open()}>
              <label htmlFor="">Profile Picture</label>
              <div className="flex items-center gap-2 cursor-pointer">
                <Image
                  src={image || "/noAvatar.png"}
                  alt=""
                  width={48}
                  height={32}
                  className="w-12 h-8 rounded-md object-cover"
                />
                <span className="text-xs underline text-gray-600">
                  Change
                </span>
              </div>
            </div>
          )}
        </CldUploadWidget>
        <CldUploadWidget
          uploadPreset="social"
          onSuccess={(result: any, { widget }: { widget: any }) => {
            if (result.info && result.info.secure_url) {
              setCover(result.info.secure_url);
            } else {
              console.error("Upload failed: result.info or secure_url is undefined");
            }
            widget.close();
          }}
        >
          {({ open }) => (
            <div className="flex flex-col gap-4 my-4" onClick={() => open()}>
              <label htmlFor="">Cover Picture</label>
              <div className="flex items-center gap-2 cursor-pointer">
                <Image
                  src={cover || "/noCover.png"}
                  alt=""
                  width={48}
                  height={32}
                  className="w-12 h-8 rounded-md object-cover"
                />
                <span className="text-xs underline text-gray-600">
                  Change
                </span>
              </div>
            </div>
          )}
        </CldUploadWidget>

        {/* INPUT FIELDS */}
        <div className="flex flex-col gap-4">
          <label htmlFor="name" className="text-xs text-gray-500">First Name</label>
          <input
            type="text"
            defaultValue={user.name || ""}
            placeholder="John"
            className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
            name="name"
          />
        </div>

        <div className="flex flex-col gap-4">
          <label htmlFor="description" className="text-xs text-gray-500">Description</label>
          <input
            type="text"
            defaultValue={user.description || ""}
            placeholder="Life is beautiful..."
            className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
            name="description"
          />
        </div>

        <div className="flex flex-col gap-4">
          <label htmlFor="city" className="text-xs text-gray-500">City</label>
          <input
            type="text"
            defaultValue={user.city || ""}
            placeholder="New York"
            className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
            name="city"
          />
        </div>

        <div className="flex flex-col gap-4">
          <label htmlFor="school" className="text-xs text-gray-500">School</label>
          <input
            type="text"
            defaultValue={user.school || ""}
            placeholder="MIT"
            className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
            name="school"
          />
        </div>

        <div className="flex flex-col gap-4">
          <label htmlFor="work" className="text-xs text-gray-500">Work</label>
          <input
            type="text"
            defaultValue={user.work || ""}
            placeholder="Apple Inc."
            className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
            name="work"
          />
        </div>

        <div className="flex flex-col gap-4">
          <label htmlFor="website" className="text-xs text-gray-500">Website</label>
          <input
            type="text"
            defaultValue={user.website || ""}
            placeholder="www.website.com"
            className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
            name="website"
          />
        </div>

        {/* UPDATE BUTTON */}
        <UpdateButton />

        {/* SUCCESS/ERROR MESSAGES */}
        {success && <span className="text-green-500">Profile has been updated!</span>}
        {error && <span className="text-red-500">Something went wrong!</span>}
      </form>
    </div>
  );
};

export default UpdateUser;
