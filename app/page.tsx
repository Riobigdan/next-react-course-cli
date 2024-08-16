import Link from "next/link";
import postgres from "postgres";
import { Suspense } from "react";
import styles from "./home.module.css";
import QuizForm from "./quiz-form";

const sql = postgres(process.env.DATABASE_URL!);

type Quiz = {
  quiz_id: number;
  title: string;
  description: string;
};

async function Quizzes() {
  // wait 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const quizzes: Quiz[] = await sql`select * from quizzes`;

  return (
    <ul>
      {quizzes.map((quiz) => (
        <li key={quiz.quiz_id}>
          <Link href={`/quiz/${quiz.quiz_id}`} className="underline">
            {quiz.title}: {quiz.description}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col items-left justify-center space-y-4">
      <div className="animate-pulse w-1/4 max-w-sm rounded-md shadow-lg bg-gray-300"></div>
      <div className="animate-pulse h-2 bg-gray-400 rounded w-1/4"></div>
      <div className="animate-pulse h-2 bg-gray-400 rounded w-2/12"></div>
      <div className="animate-pulse h-2 bg-gray-400 rounded w-2/12"></div>
    </div>
  );
}

export default function Home() {
  return (
    <section>
      <h1 className={styles.home}>All Quizzes</h1>
      <Suspense fallback={<LoadingSkeleton />}>
        <Quizzes />
        <QuizForm />
      </Suspense>
    </section>
  );
}
