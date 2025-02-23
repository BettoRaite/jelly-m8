import { useComplimentMutation } from "@/hooks/useComplimentMutation";
import useComplimentQuery from "@/hooks/useComplimentQuery";
import { HiDotsVertical } from "react-icons/hi";
import {
  type CreateComplimentPayload,
  createComplimentSchema,
} from "@/lib/schemas/compliment.schema";
import type { Profile, Question } from "@/lib/types";
import Button from "@/ui/Button";
import { FormField } from "@/ui/formField/FormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { MdClose, MdSend } from "react-icons/md";
import SelectInput from "@/ui/form/SelectInput";
import { joinClasses } from "@/lib/utils/strings";
import toast from "react-hot-toast";
import { getAuth } from "@/hooks/useAuth";
import useQuestionQuery from "@/hooks/useQuestionQuery";

type Props = {
  profile: Profile;
  onClose: () => void;
};

const SPECIAL_QUESTION: Question = {
  id: Number.MAX_SAFE_INTEGER,
  userId: 1,
  isApproved: true,
  content: "Ты что-то хотел мне сказать?",
  createdAt: new Date(),
};
function ComplimentForm({ profile, onClose }: Props) {
  const user = getAuth();
  const { data: compliments, status: complimentsLoadStatus } =
    useComplimentQuery({
      type: "profile/compliments",
      profileId: profile.id,
      searchPattern: `userId=${user?.id}|asc=createdAt`,
    });
  const { data: questions } = useQuestionQuery(
    {
      type: "questions",
    },
    {
      initialData: profile.occupation === "teacher" ? [SPECIAL_QUESTION] : [],
      enabled: profile.occupation !== "teacher",
    }
  );
  const timeoutRef = useRef(null);
  const [hasMessaged, setHasMessaged] = useState(false);
  const [message, setMessage] = useState("");
  const [hasComplimented, setHasComplimented] = useState(false);
  const [showQuestions, setShowQuestions] = useState(true);
  const chatContainerRef = useRef<null | HTMLDivElement>();
  const methods = useForm<CreateComplimentPayload>({
    resolver: zodResolver(createComplimentSchema),
    defaultValues: {
      title: "If I were you, I would not touch this.",
    },
  });

  const mutation = useComplimentMutation();

  async function handleCreateCompliment(payload: CreateComplimentPayload) {
    try {
      await mutation.mutateAsync({
        type: "create",
        profileId: profile.id,
        payload: {
          ...payload,
          title: message,
        },
      });
      setHasComplimented(true);
      methods.reset();
    } catch (err) {
      setHasMessaged(false);
      toast("Что-то пошло не так");
      console.error(err);
    }
  }
  useEffect(() => {
    if (!showQuestions) {
      timeoutRef.current = setTimeout(() => {
        setHasMessaged(true);
      }, 2000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [showQuestions]);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight, // Scroll to the bottom
        behavior: "instant", // Use "smooth" for smooth scrolling
      });
    }
  });
  return (
    <FormProvider {...methods}>
      <motion.form
        initial={{ y: 100, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          transition: { type: "spring", stiffness: 260, damping: 20 },
        }}
        exit={{ y: 100, opacity: 0, scale: [1, 0.8] }}
        onSubmit={methods.handleSubmit(handleCreateCompliment)}
        className={joinClasses(
          "fixed bottom-10 bg-gradient-to-br from-gray-100 to-gray-200  rounded-xl shadow-xl max-w-96 w-11/12 flex flex-col h-[400px]"
        )}
      >
        {showQuestions && (
          <div className="rounded-xl  bg-gradient-to-br from-gray-100 to-gray-200  shadow-lg absolute z-10 w-full h-full flex justify-start items-center flex-col p-6">
            <p className="text-2xl font-bold text-slate-800 mb-6">Тема</p>
            <ul className="bg-white rounded-xl shadow-inner w-full max-w-md p-6 overflow-y-auto custom-scrollbar">
              {questions?.map((question) => {
                const isPrevQuestion = compliments?.find(
                  (c) => c.title === question.content
                );
                if (isPrevQuestion) return null;
                return (
                  <li
                    key={question.id}
                    className="group mb-4 last:mb-0 p-4 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                  >
                    <label className="flex items-center space-x-4 cursor-pointer">
                      <input
                        type="radio"
                        name="question"
                        value={question.id}
                        onChange={() => setMessage(question.content)}
                        className="form-radio h-5 w-5 text-blue-600 border-2 border-gray-300 group-hover:border-blue-500 transition-colors duration-200"
                      />
                      <span className="text-slate-700 text-sm sm:text-[1rem] md:text-lg font-bold group-hover:text-blue-600 transition-colors duration-200">
                        {question.content}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
            <Button
              variant="solid"
              className={`mt-4 ${!message && "opacity-60"} bg-blue-500`}
              disabled={
                !message ||
                complimentsLoadStatus !== "success" ||
                compliments.length === 3
              }
              onClick={() => setShowQuestions(false)}
            >
              Начать
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <MdClose size={20} />
            </button>
            {compliments?.length === 3 && (
              <span className="text-center mt-4 text-gray-500">
                Ты написал максимальное количество комлиментов на одного
                человека
              </span>
            )}
          </div>
        )}

        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-xl flex justify-between items-center">
          <div className="flex items-center gap-2 relative">
            <img
              src={profile.profileImageUrl}
              alt={profile.profileImageUrl}
              className="h-10 w-10 rounded-full"
            />
            <h3 className="font-bold text-slate-700">{profile.displayName}</h3>
            {!hasMessaged && (
              <div className="absolute -bottom-2 left-12 text-sm text-slate-600 text-opacity-70">
                пишет
                <span className="animate-ping">.</span>
                <span className="animate-ping">.</span>
                <span className="animate-ping">.</span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Chat Messages Area */}
        <div
          className="p-4 flex-1 space-y-4 max-h-[400px] overflow-y-auto"
          ref={chatContainerRef}
        >
          {/* System Message */}
          {compliments?.map((c, index) => {
            if (c.profileId !== profile.id) return null;
            return (
              <motion.div key={c.id}>
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-2 rounded-2xl max-w-[80%]">
                    <p className="text-slate-600">{c.title}</p>
                  </div>
                </div>
                <div className="flex justify-end mt-3">
                  <div className="bg-blue-300 px-4 py-2 rounded-2xl max-w-[80%]">
                    <p className="text-slate-700">{c.content}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
          {hasMessaged && !hasComplimented && (
            <motion.div
              animate={{
                scale: [0, 1],
              }}
              className="flex justify-start"
            >
              <div className="bg-gray-200 px-4 py-2 rounded-2xl max-w-[80%] relative">
                <p className="text-slate-600">{message}</p>
              </div>
            </motion.div>
          )}
          {hasMessaged && hasComplimented && (
            <motion.div
              animate={{
                scale: [0, 1],
              }}
              className="flex justify-start"
            >
              <div className="bg-gray-200 px-4 py-2 rounded-2xl max-w-[80%] relative">
                <p className="text-slate-600">Спасибки!</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-100 relative rounded-b-xl overflow-hidden">
          <div
            className="absolute bg-blue-500 bg-clip-padding backdrop-filter  backdrop-blur bg-opacity-10
          backdrop-saturate-100 backdrop-contrast-100 w-full h-full -z-10 top-0 left-0"
          />
          <div className="grid grid-cols-[1fr_auto] gap-10">
            <FormField<CreateComplimentPayload> fieldName="content">
              <FormField.TextArea
                placeholder="Напиши что-нибудь..."
                rows={3}
                className="resize-none rounded-2xl bg-white px-4 py-2 hover:border-blue-200 focus:border-blue-400"
              />
            </FormField>
            <Button
              type="submit"
              variant="solid"
              className="mb-1 px-3 py-3 rounded-xl "
              disabled={
                mutation.isPending ||
                hasComplimented ||
                complimentsLoadStatus !== "success"
              }
            >
              <MdSend size={18} />
            </Button>
          </div>
        </div>
      </motion.form>
    </FormProvider>
  );
}

export default ComplimentForm;
