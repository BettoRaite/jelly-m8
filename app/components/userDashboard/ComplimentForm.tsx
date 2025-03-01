import { getAuth } from "@/hooks/useAuth";
import { useComplimentMutation } from "@/hooks/useComplimentMutation";
import useComplimentQuery from "@/hooks/useComplimentQuery";
import useQuestionQuery from "@/hooks/useQuestionQuery";
import {
  type CreateComplimentPayload,
  createComplimentSchema,
} from "@/lib/schemas/compliment.schema";
import type { Profile } from "@/lib/types";
import { joinClasses } from "@/lib/utils/strings";
import Button from "@/ui/Button";
import { FormField } from "@/ui/formField/FormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiHeart } from "react-icons/hi";
import {
  MdClose,
  MdOutlinePublic,
  MdOutlinePublicOff,
  MdSend,
} from "react-icons/md";
import ChatMessage from "../chat/ChatMessage";

type Props = {
  profile: Profile;
  onClose: () => void;
};

type ChatState = {
  userHasMessaged: boolean;
  isChatDisabled: boolean;
  botIsTyping: boolean;
  userChoosingQuestion: boolean;
};
const INITIAL_CHAT_STATE = {
  userHasMessaged: false,
  isChatDisabled: false,
  botIsTyping: false,
  userChoosingQuestion: true,
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
      role: profile.occupation,
    },
    {
      initialData: [],
    }
  );
  const [message, setMessage] = useState("");
  const [isComplimentPrivate, setIsComplimentPrivate] = useState(false);
  const [chatState, setChatState] = useState<ChatState>(INITIAL_CHAT_STATE);
  const chatContainerRef = useRef<null | HTMLDivElement>(null);
  const methods = useForm<CreateComplimentPayload>({
    resolver: zodResolver(createComplimentSchema),
    defaultValues: {
      title: "If I were you, I would not touch this.",
    },
  });
  const handleSetChatState = useCallback(
    (s: Partial<ChatState>) => {
      setChatState({
        ...chatState,
        ...s,
      });
    },
    [chatState]
  );

  const mutation = useComplimentMutation();
  async function handleCreateCompliment(payload: CreateComplimentPayload) {
    try {
      await mutation.mutateAsync({
        type: "create",
        profileId: profile.id,
        payload: {
          ...payload,
          title: message,
          visibility: isComplimentPrivate ? "private" : "public",
        },
      });
      setTimeout(() => {
        handleSetChatState({
          isChatDisabled: true,
        });
      }, 4000);

      setMessage(
        profile.occupation === "teacher" ? "Приятно было услышать" : ":3"
      );
      handleSetChatState({
        userHasMessaged: true,
        botIsTyping: true,
      });
      methods.reset();
      methods.setFocus("title");
    } catch (err) {
      handleSetChatState({
        isChatDisabled: true,
      });
      toast("Что-то пошло не так");
      console.error(err);
    }
  }
  function handleResetChatClick() {
    setChatState(INITIAL_CHAT_STATE);
    setMessage("");
  }
  function handleToggleComplimentPrivacy() {
    setIsComplimentPrivate(!isComplimentPrivate);
    toast(
      isComplimentPrivate
        ? "Комлимент стал публичным"
        : "Комплимент стал приватным. Т.е его только сможет прочитать человек которому он был написан"
    );
  }
  useEffect(() => {
    let timeoutId: number | undefined;
    if (!chatState.userChoosingQuestion && chatState.botIsTyping) {
      timeoutId = setTimeout(() => {
        handleSetChatState({
          botIsTyping: false,
        });
      }, 2000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [
    chatState.userChoosingQuestion,
    chatState.botIsTyping,
    handleSetChatState,
  ]);

  // Scroll to chat bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "instant",
      });
    }
  });
  // Compliments user written compliment to the user of the current viewed profile
  const unexploredQuestions = (questions ?? []).filter((q) => {
    return !compliments?.some((c) => {
      return c.title === q.content;
    });
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
        <motion.button
          animate={{
            scale: [0, 1],
          }}
          type="button"
          onClick={onClose}
          className={joinClasses(
            "absolute top-4 right-4 text-blue-400 hover:text-blue-600 transition-colors z-50",
            {
              "text-blue-400": true,
            }
          )}
        >
          <MdClose size={20} />
        </motion.button>
        {chatState.isChatDisabled && (
          <motion.div
            animate={{
              scale: [0, 1],
            }}
            className="rounded-xl bg-white flex justify-center items-center  shadow-lg absolute z-10 w-full h-full"
          >
            <HiHeart
              onClick={handleResetChatClick}
              className="text-4xl text-pink-400 hover:text-6xl cursor-pointer transition-all duration-300"
            />
          </motion.div>
        )}

        {/* Questions aka topics */}
        {chatState.userChoosingQuestion && (
          <div className="rounded-xl  bg-gradient-to-br from-gray-100 to-gray-200  shadow-lg absolute z-10 w-full h-full flex justify-start items-center flex-col p-6">
            <p className="text-2xl font-bold text-slate-800 mb-6">Тема</p>
            <ul className="bg-white rounded-xl shadow-inner w-full max-w-md p-6 overflow-y-auto custom-scrollbar">
              {unexploredQuestions?.length === 0 && (
                <p className="text-center text-gray-400">Пусто...</p>
              )}
              {unexploredQuestions?.map((question) => {
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
              className={`mt-4 ${!message && "opacity-60"} ${
                compliments?.length === 3 && "bg-gray-400 opacity-60"
              } bg-blue-500`}
              disabled={
                !message ||
                complimentsLoadStatus !== "success" ||
                compliments.length === 3
              }
              onClick={() =>
                handleSetChatState({
                  userChoosingQuestion: false,
                  botIsTyping: true,
                })
              }
            >
              Начать
            </Button>

            {compliments?.length === 3 && (
              <span className="text-center mt-4 text-gray-500">
                Ты написал максимальное количество комлиментов на одного
                человека
              </span>
            )}
          </div>
        )}

        {/* Avatar */}
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-xl flex justify-between items-center">
          <div className="flex items-center gap-2 relative">
            <img
              src={profile.profileImageUrl}
              alt={profile.profileImageUrl}
              className="h-10 w-10 rounded-full object-cover"
            />
            <h3 className="font-bold text-slate-700">{profile.displayName}</h3>
            {chatState.botIsTyping && (
              <div className="absolute -bottom-2 left-12 text-sm text-slate-600 text-opacity-70">
                пишет
                <span className="animate-ping">.</span>
                <span className="animate-ping">.</span>
                <span className="animate-ping">.</span>
              </div>
            )}
          </div>
        </div>

        {/* Chat Messages Area */}
        <div
          className="p-4 flex-1 space-y-4 max-h-[400px] overflow-y-auto"
          ref={chatContainerRef}
        >
          {/* Prev Message */}
          {compliments?.map((c, index) => {
            if (c.profileId !== profile.id) return null;
            return (
              <motion.div key={c.id}>
                <ChatMessage cancelAnimation={true} variant="other">
                  {c.title}
                </ChatMessage>
                <ChatMessage variant="user">{c.content}</ChatMessage>
              </motion.div>
            );
          })}
          {/* Bot message */}
          {!chatState.botIsTyping && (
            <ChatMessage variant="other">{message}</ChatMessage>
          )}
        </div>

        {/* Toggle compliment privacy */}
        <Button
          type="button"
          roundedness="rounded-full"
          padding="px-2 py-2"
          variant="solid"
          onClick={handleToggleComplimentPrivacy}
          className={joinClasses("absolute right-2 top-20 border-blue-500", {
            "": isComplimentPrivate,
          })}
        >
          {isComplimentPrivate ? (
            <MdOutlinePublicOff />
          ) : (
            <MdOutlinePublic className="text-white" />
          )}
        </Button>
        {/* Input Area */}
        <div className="p-4 border-t border-gray-100 relative rounded-b-xl overflow-hidden">
          <div
            className="absolute bg-gray-200 bg-clip-padding backdrop-filter  backdrop-blur
          backdrop-saturate-100 backdrop-contrast-100 w-full h-full -z-10 top-0 left-0"
          />
          <div className="grid grid-cols-[1fr_auto] gap-10">
            <FormField<CreateComplimentPayload> fieldName="content">
              <FormField.TextArea
                placeholder="Напиши что-нибудь..."
                rows={3}
                className="resize-none rounded-2xl bg-white px-4 py-2 hover:border-purple-200 focus:border-purple-400"
              />
            </FormField>
            <Button
              type="submit"
              variant="solid"
              className="mb-1 px-3 py-3 rounded-xl bg-opacity-90"
              disabled={
                mutation.isPending ||
                chatState.userHasMessaged ||
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
