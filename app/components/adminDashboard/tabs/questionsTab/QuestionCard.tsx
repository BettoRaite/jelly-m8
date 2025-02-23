import { useState } from "react";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { IoIosRemove } from "react-icons/io";
import { MdCheckCircle, MdCancel } from "react-icons/md";
import { motion } from "motion/react";
import { BiCopy } from "react-icons/bi";
import toast from "react-hot-toast";
import useQuestionQuery from "@/hooks/useQuestionQuery"; // Custom hook for fetching question data
import { useQuestionMutation } from "@/hooks/useQuestionMutation";
import ItemLoader from "@/components/ItemLoader";
import FailedToLoad from "@/components/FailedToLoad";
import type { Question } from "@/lib/types";

type Props = {
  question: Question;
};

export function QuestionCard({ question }: Props) {
  const [panelUnlocked, setPanelUnlocked] = useState(false);
  const questionMutation = useQuestionMutation();

  function handleDeleteQuestionClick() {
    questionMutation.mutate({
      type: "delete",
      questionId: question?.id as number,
    });
  }

  function handleUnlockClick() {
    setPanelUnlocked(!panelUnlocked);
  }

  const { content, userId, isApproved, createdAt, id } = question;
  return (
    <motion.section
      animate={{
        scale: [0, 1],
      }}
      className="flex flex-col md:flex-row p-6 items-center bg-white rounded-lg shadow-md
      hover:shadow-lg transition-shadow duration-300 gap-4 relative"
    >
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold text-gray-800">
          Question {question.id}
        </h1>
        <p className="text-gray-600 flex">
          <span className="font-medium bg-gray-100 p-1 rounded break-words max-w-96">
            {content}
          </span>
        </p>
        <p className="text-gray-600 mt-1">
          Status:{" "}
          <span
            className={`font-medium ${
              isApproved ? "text-green-600" : "text-red-600"
            }`}
          >
            {isApproved ? "Approved" : "Pending"}
          </span>
        </p>
        <p className="text-gray-600 mt-1">
          Created At:{" "}
          <span className="font-medium">
            {new Date(createdAt).toLocaleDateString()}
          </span>
        </p>
      </div>

      <button
        className="rounded-full p-2 border border-gray-300 bg-white shadow-lg hover:border-purple-300
        transition duration-300 ease-in-out transform hover:scale-105 absolute  -top-2 -right-2"
        type="button"
        onClick={handleDeleteQuestionClick}
      >
        <IoIosRemove />
      </button>
    </motion.section>
  );
}
