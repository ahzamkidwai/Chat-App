// app/message/layout.tsx

export default function MessageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* <div className="w-72 border-r"><Sidebar /></div> */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
