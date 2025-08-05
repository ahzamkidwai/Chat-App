import { EditUserProfileRequest } from "@/types/userProfile";

interface EditUserProfileParams {
  token: string;
  requestBody: EditUserProfileRequest;
}

export const editUserProfile = async (
  token: string,
  requestBody: EditUserProfileRequest
): Promise<EditUserProfileRequest> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/user-profile`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update profile");
  }

  console.log("✅ Profile updated:", data.profile);
  return data.profile;
};
