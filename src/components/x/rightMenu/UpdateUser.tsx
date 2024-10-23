"use client";
import { User } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
// import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";
import UpdateButton from "./UpdateButton";
import { updateProfile } from "@/components/actions";

const UpdateUser = ({ user }: { user: User }) => {
  const [open, setOpen] = useState(false);
  const [cover, setCover] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
    if (success) {
      router.refresh();
      setSuccess(false); // Reset success state
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    setSuccess(false);
    setError(false);
  
    const formData = new FormData(e.currentTarget);
  
    const name = formData.get("name") as string;
    // const surname = formData.get("surname") as string;
    const description = formData.get("description") as string;
    const city = formData.get("city") as string;
    const school = formData.get("school") as string;
    const work = formData.get("work") as string;
    const website = formData.get("website") as string;
  
    try {
      const response = await updateProfile({
        name,
        // surname,
        description,
        city,
        school,
        work,
        website,
        cover,
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
    <div className="">
      <span
        className="text-blue-500 text-xs cursor-pointer"
        onClick={() => setOpen(true)}
      >
        Update
      </span>
      {open && (
        <div className="absolute w-screen h-screen top-0 left-0 bg-black bg-opacity-65 flex items-center justify-center z-50 ">
          <form
            onSubmit={handleSubmit}
            className="p-12 bg-white rounded-lg shadow-md flex flex-col gap-2 w-full md:w-1/2 xl:w-1/3 relative"
          >
            {/* TITLE */}
            <h1>Update Profile</h1>
            <div className="mt-4 text-xs text-gray-500">
              Use the navbar profile to change the avatar or username.
            </div>
            {/* COVER PIC UPLOAD */}
            {/* Uncomment and configure the Cloudinary widget if needed */}
            {/* <CldUploadWidget
              uploadPreset="social"
              onSuccess={(result) => setCover(result.info.secure_url)}
            >
              {({ open }) => {
                return (
                  <div
                    className="flex flex-col gap-4 my-4"
                    onClick={() => open()}
                  >
                    <label htmlFor="">Cover Picture</label>
                    <div className="flex items-center gap-2 cursor-pointer">
                      <Image
                        src={cover || user.cover || "/noCover.png"}
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
                );
              }}
            </CldUploadWidget> */}

            {/* WRAPPER */}
            <div className="flex flex-wrap justify-between gap-2 xl:gap-4">
              {/* INPUT */}
              <div className="flex flex-col gap-4">
                <label htmlFor="name" className="text-xs text-gray-500">
                  First Name
                </label>
                <input
                  type="text"
                  defaultValue={user.name || ""}
                  placeholder="John"
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  name="name"
                />
              </div>
              <div className="flex flex-col gap-4">
                <label htmlFor="surname" className="text-xs text-gray-500">
                  Surname
                </label>
                {/* Uncomment if surname is used */}
                {/* <input
                  type="text"
                  defaultValue={user.surname || ""}
                  placeholder="Doe"
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  name="surname"
                /> */}
              </div>
              {/* INPUT */}
              <div className="flex flex-col gap-4">
                <label htmlFor="description" className="text-xs text-gray-500">
                  Description
                </label>
                <input
                  type="text"
                  defaultValue={user.description || ""}
                  placeholder="Life is beautiful..."
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  name="description"
                />
              </div>
              {/* INPUT */}
              <div className="flex flex-col gap-4">
                <label htmlFor="city" className="text-xs text-gray-500">
                  City
                </label>
                <input
                  type="text"
                  defaultValue={user.city || ""}
                  placeholder="New York"
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  name="city"
                />
              </div>
              {/* INPUT */}

              <div className="flex flex-col gap-4">
                <label htmlFor="school" className="text-xs text-gray-500">
                  School
                </label>
                <input
                  type="text"
                  defaultValue={user.school || ""}
                  placeholder="MIT"
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  name="school"
                />
              </div>
              {/* INPUT */}

              <div className="flex flex-col gap-4">
                <label htmlFor="work" className="text-xs text-gray-500">
                  Work
                </label>
                <input
                  type="text"
                  defaultValue={user.work || ""}
                  placeholder="Apple Inc."
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  name="work"
                />
              </div>
              {/* INPUT */}

              <div className="flex flex-col gap-4">
                <label htmlFor="website" className="text-xs text-gray-500">
                  Website
                </label>
                <input
                  type="text"
                  defaultValue={user.website || ""}
                  placeholder="lama.dev"
                  className="ring-1 ring-gray-300 p-[13px] rounded-md text-sm"
                  name="website"
                />
              </div>
            </div>
            <UpdateButton />
            {success && (
              <span className="text-green-500">
                Profile has been updated!
              </span>
            )}
            {error && (
              <span className="text-red-500">Something went wrong!</span>
            )}
            <div
              className="absolute text-xl right-2 top-3 cursor-pointer"
              onClick={handleClose}
            >
              X
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateUser;
