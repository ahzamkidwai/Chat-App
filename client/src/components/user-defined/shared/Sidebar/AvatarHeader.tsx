import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitialsFromFullName } from "@/utils/auth";

interface AvatarHeaderProps {
  profileImageUrl?: string;
  username?: string;
}

const AvatarHeader = ({ profileImageUrl, username }: AvatarHeaderProps) => {
  return (
    <div>
      <Avatar className="w-10 h-10">
        <AvatarImage
          className="w-full h-full object-cover rounded-full"
          src={
            profileImageUrl || "https://randomuser.me/api/portraits/men/32.jpg"
          }
          alt={username || "User"}
        />
        <AvatarFallback>
          {getInitialsFromFullName(username as string)}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default AvatarHeader;
