// components/Sidebar.tsx
"use client";

import Link from "next/link";
import globalStyles from "@/styles/globalStyles";

const { colors } = globalStyles;

const dummyChats = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

const Sidebar = () => {
  return (
    <aside
      className="w-64 min-h-screen border-r px-4 py-6"
      style={{
        background: `linear-gradient(to bottom, ${colors.background}, ${colors.gradientTo})`,
        borderRightColor: colors.border,
      }}
    >
      <h2 className="text-lg font-bold mb-6" style={{ color: colors.primary }}>
        Chats
      </h2>
      <ul className="space-y-4">
        {dummyChats.map((chat) => (
          <li key={chat.id}>
            <Link
              href={`/chat/${chat.id}`}
              className="block py-2 px-3 rounded hover:bg-gray-100 transition"
              style={{ color: colors.text }}
            >
              {chat.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
