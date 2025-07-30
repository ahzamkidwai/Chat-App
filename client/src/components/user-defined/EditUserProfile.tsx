"use client";

import React, { useState } from "react";
import { Camera, Pencil, Trash2 } from "lucide-react";

const EditUserProfile = () => {
  // Profile image
  const [profileImage, setProfileImage] = useState<string | null>(null);

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
  const [status, setStatus] = useState("Hey there! I’m using this app.");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImageDelete = () => setProfileImage(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const basicProfile = {
      profileImage,
      firstName,
      middleName,
      lastName,
      email,
      phone,
    };

    const extendedProfile = {
      occupation,
      dateOfBirth,
      bio,
      website,
      city,
      country,
      status,
    };

    console.log("Basic Profile:", basicProfile);
    console.log("Extended Profile:", extendedProfile);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Profile Image */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-600">
            {profileImage ? (
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

          {profileImage && (
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
