import globalStyles from "@/styles/globalStyles";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const MessagePageHeader = ({ otherUser }: any) => {
  const {
    sidebarBg,
    sidebarText,
    sidebarInputBg,
    sidebarBorder,
    sidebarHeading,
  } = globalStyles.colors;

  const fullName = otherUser?.fullName || "Unknown";
  const phoneNumber = otherUser?.phoneNumber || "No phone number";
  const profilePhoto = otherUser?.profilePhoto;
  const dummyStatus = "Active now"; // You can change to "Online", "Offline", etc.

  return (
    <div
      className="sticky top-0 z-10 flex items-center justify-between p-4"
      style={{
        borderBottom: `1px solid ${sidebarBorder}`,
        backgroundColor: sidebarBg,
      }}
    >
      {/* Left side: back + user info */}
      <div className="flex items-center gap-3">
        {/* Back button */}
        <Link
          href="/message"
          className="hover:text-white"
          style={{ color: sidebarText }}
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        {/* Profile picture */}
        <div
          className="w-10 h-10 rounded-full overflow-hidden"
          style={{ backgroundColor: sidebarInputBg }}
        >
          {profilePhoto ? (
            <Image
              src={profilePhoto}
              alt={fullName}
              width={40}
              height={40}
              className="object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ color: sidebarText }}
            >
              {fullName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Name, phone & status */}
        <div>
          <h2
            className="text-base font-semibold"
            style={{ color: sidebarHeading }}
          >
            {fullName}
          </h2>
          <p className="text-xs" style={{ color: sidebarText }}>
            {phoneNumber}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessagePageHeader;
