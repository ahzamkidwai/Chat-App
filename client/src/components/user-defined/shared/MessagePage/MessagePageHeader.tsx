import globalStyles from "@/styles/globalStyles";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const MessagePageHeader = ({ otherUser }: any) => {
  const {
    sidebarBg,
    sidebarText,
    dmOnline,
    dmIdle,
    dmDnd,
    dmOffline,
    sidebarInputBg,
    sidebarBorder,
    sidebarHeading,
  } = globalStyles.colors;

  const profile = otherUser || {};
  const personal = profile.personal_details || {};
  const contact = profile.contact_information || {};

  const fullName = `${personal.firstName || ""} ${personal.middleName || ""} ${
    personal.lastName || ""
  }`.trim();

  return (
    <div
      className="sticky top-0 z-10 flex items-center gap-3 p-4"
      style={{
        borderBottom: `1px solid ${sidebarBorder}`,
        backgroundColor: sidebarBg,
      }}
    >
      <Link
        href="/message"
        className="hover:text-white"
        style={{ color: sidebarText }}
      >
        <ArrowLeft className="w-5 h-5" />
      </Link>

      {/* Profile Picture */}
      <div className="relative">
        <div
          className="w-10 h-10 rounded-full overflow-hidden"
          style={{ backgroundColor: sidebarInputBg }}
        >
          {profile.profilePhotoUrl ? (
            <Image
              src={profile.profilePhotoUrl}
              alt={fullName || "User"}
              width={40}
              height={40}
              className="object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ color: sidebarText }}
            >
              {fullName?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        {/* <span
          className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
          style={{
            backgroundColor:
              otherUser.status === "online"
                ? dmOnline
                : otherUser.status === "idle"
                ? dmIdle
                : otherUser.status === "dnd"
                ? dmDnd
                : dmOffline,
            borderColor: sidebarBg,
          }}
        ></span> */}
      </div>

      {/* Name & Phone */}
      <div>
        <h2
          className="text-base font-semibold"
          style={{ color: sidebarHeading }}
        >
          {fullName || "Unknown"}
        </h2>
        <p className="text-xs" style={{ color: sidebarText }}>
          {contact.phone || "No phone number"}
        </p>
      </div>
    </div>
  );
};

export default MessagePageHeader;
