import { revalidatePath } from "next/cache";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);
export default function QuizForm() {
  async function createQuizAction(formData: FormData) {
    "use server";
    let title = (formData.get("title") as string) ?? "";
    let description = (formData.get("description") as string) ?? "";
    let question = (formData.get("question") as string) ?? "";
    let answers = [1, 2, 3].map((id) => {
      return {
        id,
        answer: formData.get(`answer-${id}`) as string,
        correct: (formData.get(`answer-${id}-correct`) as string) === "on",
      };
    });
    console.log("🦠  file: quiz-form.tsx:8  answers  answers:", answers);

    await sql`
    WITH quiz AS (
      INSERT INTO quizzes (title, description, question_text)
      VALUES (${title}, ${description}, ${question})
      RETURNING quiz_id
    )
      INSERT INTO answers (quiz_id, answer_text, is_correct)
      VALUES 
       ((SELECT quiz_id FROM quiz), ${answers[0].answer}, ${answers[0].correct}),
       ((SELECT quiz_id FROM quiz), ${answers[1].answer}, ${answers[1].correct}),
       ((SELECT quiz_id FROM quiz), ${answers[2].answer}, ${answers[2].correct})
    `;
    console.log("🦠  file: quiz-form.tsx:8  answers  answers:", answers);
    revalidatePath("/");
  }
  return (
    <form className="flex flex-col gap-4 mt-8" action={createQuizAction}>
      <label htmlFor="title">
        Title
        <input
          type="text"
          className="ml-2 bg-transparent  border-b-2 border-gray-500 focus:border-blue-500 focus:outline-none"
          id="title"
          name="title"
        />
      </label>
      <label htmlFor="description">
        Description
        <input
          type="text"
          name="description"
          className="ml-2 bg-transparent  border-b-2 border-gray-500 focus:border-blue-500 focus:outline-none"
        />
      </label>
      <label htmlFor="question">
        Question
        <input
          type="text"
          name="question"
          className="ml-2 bg-transparent  border-b-2 border-gray-500 focus:border-blue-500 focus:outline-none"
        />
      </label>
      <div className="my-5" />
      <Answer id={1} />
      <Answer id={2} />
      <Answer id={3} />

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-1/5"
      >
        Create Quiz
      </button>
    </form>
  );
}

function Answer({ id }: { id: number }) {
  return (
    <label htmlFor={`answer-${id}`}>
      Answer {id}
      <input
        type="text"
        name={`answer-${id}`}
        className="ml-2 bg-transparent  border-b-2 border-gray-500 focus:border-blue-500 focus:outline-none"
      />
      <input
        type="checkbox"
        className="w-4 h-4 text-blue-600 bg-blue-950 border-gray-800 rounded-full focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        name={`answer-${id}-correct`}
      />
    </label>
  );
}
