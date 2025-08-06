"use client";

import { FormEvent, useEffect, useState } from "react";
import { Camera, Pencil, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useRouter } from "next/navigation";
import { editUserProfile } from "@/services/userService";
import { EditUserProfileRequest } from "@/types/userProfile";
import { setReload, setUserDetails } from "@/redux/slices/userSlice";

const EditUserProfile = () => {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.user.userId);
  const authToken = useSelector((state: RootState) => state.user.token);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Profile image states
  const [profileImage, setProfileImage] = useState<string>("");
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Basic fields
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Extended fields
  const [occupation, setOccupation] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState("Hey there! I'm using this app.");

  const token = useSelector((state: RootState) => state.user.token);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setSelectedImageFile(file);
  };

  const handleImageDelete = () => {
    setImagePreview("");
    setSelectedImageFile(null);
    if (profileImage) {
      // Only clear profileImage if we want to remove the existing image
      setProfileImage("");
    }
  };

  const uploadProfileImage = async () => {
    if (!selectedImageFile || !userId) return null;

    const formData = new FormData();
    formData.append("file", selectedImageFile);
    formData.append("userId", userId);

    try {
      const response = await fetch(
        `${API_URL}/uploads/profile-image?userId=${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (data.success) {
        return data.fileUrl;
      } else {
        console.error("Upload failed:", data.message);
        return null;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let imageUrl = profileImage;

      // Upload new image if selected
      if (selectedImageFile) {
        const uploadedUrl = await uploadProfileImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const requestBody: EditUserProfileRequest = {
        profilePhotoUrl: imageUrl || "",
        personal_details: {
          firstName,
          middleName,
          lastName,
          dob: dateOfBirth,
        },
        contact_information: {
          email,
          phone,
          city,
          country,
        },
        professional_details: {
          occupation,
          website,
        },
        additional_information: {
          statusMessage: status,
          bio,
        },
      };

      const data = await editUserProfile(token ?? "", requestBody);

      const fullName = `${data.personal_details.firstName} ${data.personal_details.middleName} ${data.personal_details.lastName}`;

      dispatch(
        setUserDetails({
          username: fullName,
          email: data.contact_information.email,
          phoneNumber: data.contact_information.phone,
          userId: userId || "",
        })
      );

      dispatch(setReload());

      // Clean up image preview if we have one
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      router.push("/");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/user-profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch user profile");
        }

        setFirstName(data.profile?.personal_details?.firstName || "");
        setMiddleName(data.profile?.personal_details?.middleName || "");
        setLastName(data.profile?.personal_details?.lastName || "");
        setDateOfBirth(data.profile?.personal_details?.dob || "");
        setEmail(data.profile?.contact_information?.email || "");
        setPhone(data.profile?.contact_information?.phone || "");
        setCity(data.profile?.contact_information?.city || "");
        setCountry(data.profile?.contact_information?.country || "");
        setOccupation(data.profile?.professional_details?.occupation || "");
        setWebsite(data.profile?.professional_details?.website || "");
        setStatus(data.profile?.additional_information?.statusMessage || "");
        setBio(data.profile?.additional_information?.bio || "");
        setProfileImage(data?.profile?.profilePhotoUrl || "");
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [token]);

  // Clean up image preview when component unmounts
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Profile Image */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-600">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="object-cover w-full h-full"
              />
            ) : profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                <Camera className="w-10 h-10" />
              </div>
            )}
          </div>

          <label className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow cursor-pointer hover:bg-blue-100 transition">
            <Pencil className="w-5 h-5 text-blue-600" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          {(imagePreview || profileImage) && (
            <button
              type="button"
              onClick={handleImageDelete}
              className="absolute top-0 right-0 bg-red-600 p-1 rounded-full text-white hover:bg-red-700 transition"
              title="Delete Image"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Info */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "First Name", value: firstName, setter: setFirstName },
              {
                label: "Middle Name",
                value: middleName,
                setter: setMiddleName,
              },
              { label: "Last Name", value: lastName, setter: setLastName },
            ].map((field, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  placeholder={field.label}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          {/* DOB */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </section>

        {/* Contact Info */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Contact Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Email Address", value: email, setter: setEmail },
              { label: "Phone Number", value: phone, setter: setPhone },
              { label: "City", value: city, setter: setCity },
              { label: "Country / Region", value: country, setter: setCountry },
            ].map((field, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  placeholder={field.label}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Professional Info */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Professional Details
          </h2>

          {[
            { label: "Occupation", value: occupation, setter: setOccupation },
            {
              label: "Website / Portfolio",
              value: website,
              setter: setWebsite,
            },
          ].map((field, index) => (
            <div key={index} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type="text"
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                placeholder={field.label}
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </section>

        {/* Additional Info */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Additional Information
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status Message
            </label>
            <input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your status"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              About / Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </section>

        <button
          type="submit"
          className="w-full py-2 rounded-full bg-blue-600 text-white text-lg font-medium hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditUserProfile;
