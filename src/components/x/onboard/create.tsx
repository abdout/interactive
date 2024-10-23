"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";
import {
 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

import { currentUser } from "@/lib/auth";
import SelectPopover from "@/components/atom/popover/popover";
import { rank, ranks } from "./rank";
import { interest, interests } from "./interest";
import { skill, skills } from "./skill";
import UpdateUser from "../rightMenu/UpdateUser";

const formSchema = z.object({
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms",
  }),
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  dob: z.string().regex(/^\d{4}$/, "Year of birth must be exactly 4 digits"),
  address: z.string().min(1, "Address is required"),
  gender: z.enum(["ذكر", "أنثى"]),
  rank: z.string().min(1, "Rank is required"),
  interest: z.string().min(1, "Interest is required"),
  skill: z.string().min(1, "Skill is required"),
  club: z.string().optional(),
  image: z.string().optional(),
  cover: z.string().optional(),
  contact: z.object({
    phone: z.string().min(1, "Phone number is required"),
    facebook: z.string().optional(),
    whatsapp: z.string().optional(),
  }),
});

type FormData = z.infer<typeof formSchema>;

const Onboarding: React.FC = () => {
  const { register, handleSubmit, control, watch, formState } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      terms: false,
      name: "",
      username: "",
      dob: "",
      address: "",
      rank: "",
      interest: "",
      skill: "",
      club: "",
      image: "",
      cover: "",
      contact: {
        phone: "",
        facebook: "",
        whatsapp: "",
      },
    },
  });

  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [selectedRank, setSelectedRank] = useState<rank | null>(null);
  const [selectedInterest, setSelectedInterest] = useState<interest | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<skill | null>(null);
  const [image, setImage] = useState<string>("");
  const [cover, setCover] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    setProgress((step / 4) * 100);
  }, [step]);

  const onSubmit = async (data: FormData) => {
    const user = await currentUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // Include uploaded images
    data.image = image;
    data.cover = cover;

    try {
      await UpdateUser({
        userId: user.id,
        ...data,
        onboarded: true,
      });

      router.push("/");
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen registration-page">
      <div className="flex flex-col items-start justify-start gap-2 mt-4">
        <h1>مرحبا بيك</h1>
        <p className="text-xl font-light">سيكون لنا متسع من الموت للنوم</p>
      </div>
      <Form>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md flex flex-col gap-6 relative">
          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              disabled={step === 1}
              onClick={() => setStep((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={step === 4}
              onClick={() => setStep((prev) => Math.min(prev + 1, 4))}
            >
              Next
            </Button>
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <>
              <p>
                لا تستثني الحركة احداَ من عامة السودانين الصالحين في ان تتقدم لهم بدعوتها، وهي كذلك تحرص على أن ينتمي لقياداتها وصفها من عرف عنه نظافة اليد، وصالح المسعى، ومن يتقي معوج المسلك وفاسد العمل.
              </p>
              <div className="flex items-center gap-2 pt-8">
                <Checkbox id="terms" {...register("terms")} />
                <label htmlFor="terms" className="text-sm font-medium">
                  اقرأ{" "}
                  <a href="#" className="text-blue-800">
                    ارشادات
                  </a>{" "}
                  و{" "}
                  <a href="#" className="text-blue-800">
                    اوراق
                  </a>{" "}
                  الحركة قبل البدء
                </label>
              </div>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              {/* Name */}
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="الاسم الكامل" {...field} />
                    </FormControl>
                    <FormMessage>{formState.errors.name?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Username */}
              <FormField
                control={control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="اسم المستخدم" {...field} />
                    </FormControl>
                    <FormMessage>{formState.errors.username?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Gender */}
              <FormField
                control={control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الجنس</FormLabel>
                    <FormControl>
                      <RadioGroup {...field}>
                        <div className="flex space-x-4">
                          <div className="flex items-center">
                            <RadioGroupItem value="ذكر" id="male" />
                            <Label htmlFor="male">ذكر</Label>
                          </div>
                          <div className="flex items-center">
                            <RadioGroupItem value="أنثى" id="female" />
                            <Label htmlFor="female">أنثى</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage>{formState.errors.gender?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Date of Birth */}
              <FormField
                control={control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>سنة الميلاد</FormLabel>
                    <FormControl>
                      <Input placeholder="1990" {...field} />
                    </FormControl>
                    <FormMessage>{formState.errors.dob?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Address */}
              <FormField
                control={control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العنوان</FormLabel>
                    <FormControl>
                      <Input placeholder="المدينة" {...field} />
                    </FormControl>
                    <FormMessage>{formState.errors.address?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              {/* Rank */}
              <FormField
                control={control}
                name="rank"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>التخصص</FormLabel>
                    <FormControl>
                      <SelectPopover
                        items={ranks}
                        selectedItem={selectedRank}
                        setSelectedItem={(item) => {
                          setSelectedRank(item);
                          field.onChange(item?.label);
                        }}
                        label="اختر التخصص"
                      />
                    </FormControl>
                    <FormMessage>{formState.errors.rank?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Skill */}
              <FormField
                control={control}
                name="skill"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المهارة</FormLabel>
                    <FormControl>
                      <SelectPopover
                        items={skills}
                        selectedItem={selectedSkill}
                        setSelectedItem={(item) => {
                          setSelectedSkill(item);
                          field.onChange(item?.label);
                        }}
                        label="اختر المهارة"
                      />
                    </FormControl>
                    <FormMessage>{formState.errors.skill?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Interest */}
              <FormField
                control={control}
                name="interest"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاهتمام</FormLabel>
                    <FormControl>
                      <SelectPopover
                        items={interests}
                        selectedItem={selectedInterest}
                        setSelectedItem={(item) => {
                          setSelectedInterest(item);
                          field.onChange(item?.label);
                        }}
                        label="اختر الاهتمام"
                      />
                    </FormControl>
                    <FormMessage>{formState.errors.interest?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <>
              {/* Contact Information */}
              <FormField
                control={control}
                name="contact.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الهاتف</FormLabel>
                    <FormControl>
                      <Input placeholder="رقم الهاتف" {...field} />
                    </FormControl>
                    <FormMessage>{formState.errors.contact?.phone?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="contact.whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>واتساب</FormLabel>
                    <FormControl>
                      <Input placeholder="واتساب" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image Uploads */}
              {/* <FormItem>
                <FormLabel>صورة الملف الشخصي</FormLabel>
                <CldUploadWidget
                  uploadPreset="your_upload_preset"
                  onSuccess={(result, { widget }) => {
                    setImage(result.info.secure_url);
                    widget.close();
                  }}
                >
                  {({ open }) => (
                    <Button type="button" onClick={() => open()}>
                      تحميل الصورة
                    </Button>
                  )}
                </CldUploadWidget>
                {image && <Image src={image} alt="Profile" width={100} height={100} />}
              </FormItem> */}

              {/* <FormItem>
                <FormLabel>صورة الغلاف</FormLabel>
                <CldUploadWidget
                  uploadPreset="your_upload_preset"
                  onSuccess={(result, { widget }) => {
                    setCover(result.info.secure_url);
                    widget.close();
                  }}
                >
                  {({ open }) => (
                    <Button type="button" onClick={() => open()}>
                      تحميل الغلاف
                    </Button>
                  )}
                </CldUploadWidget>
                {cover && <Image src={cover} alt="Cover" width={100} height={100} />}
              </FormItem> */}
            </>
          )}

          {/* Submit Button */}
          {step === 4 && (
            <Button type="submit" className="mt-4">
              طلب العضوية
            </Button>
          )}

          {/* Progress Bar */}
          <Progress value={progress} className="mt-4" />
        </form>
      </Form>
    </div>
  );
};

export default Onboarding;
