const ImageAvatar = ({
  profileImage,
  size = 24,
}: {
  profileImage?: string;
  size?: number;
}) => {
  const fallbackImage =
    "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg";
  return (
    <div>
      <img
        src={profileImage || fallbackImage}
        alt="User Avatar"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
    </div>
  );
};

export default ImageAvatar;
