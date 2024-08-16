import { redirect } from "next/navigation";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

async function Quiz({ id, show }: { id: string; show?: string }) {
  let answers = await sql`
    SELECT 
      q.quiz_id,
      q.title,
      q.question_text,
      q.description,
      a.answer_id,
      a.answer_text,
      a.is_correct
    FROM quizzes as q
    JOIN answers as a ON q.quiz_id = a.quiz_id
    where q.quiz_id = ${id}
    `;
  // console.log("🦠  file: page.tsx:20  Quiz  let:", answers);
  // console.log("🦠  file: page.tsx:15 ID & Show:", id, show);
  return (
    <div>
      <h1>{answers[0].title}</h1>
      <p className="text-gray-500 text-sm mb-2 ml-2">
        {answers[0].description}
      </p>
      <p>{answers[0].question_text}</p>
      {answers.map((answer) => (
        <div key={answer.answer_id}>
          <p>
            {answer.answer_text}
            <span className="text-green-500">
              {show && answer.is_correct ? " ✔" : ""}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}

export default function QuizPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { show?: string };
}) {
  return (
    <div>
      <Quiz id={params.id} show={searchParams.show} />
      <form
        action={async () => {
          "use server";
          redirect(`/quiz/${params.id}?show=true`);
        }}
      >
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transation-all duration-300">
          Submit
        </button>
      </form>
    </div>
  );
}
