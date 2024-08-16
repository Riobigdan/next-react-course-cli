export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <nav>
      this is navigation
      {children}
    </nav>
  );
}
