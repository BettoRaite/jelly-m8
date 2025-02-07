import { joinClasses } from "@/lib/utils/strings";
import { motion } from "motion/react";
type Props = {
  description: string;
};

function ErrorScreen({ description }: Props) {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <motion.div
        animate={{
          scale: [0, 1],
        }}
        className="w-11/12 text-center max-w-md p-8 bg-white rounded-2xl shadow-2xl"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Oops!</h1>
        <p className="text-lg text-gray-600 mb-8">{description}</p>
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            onClick={handleGoBack}
            className={joinClasses(
              "text-sm px-6 py-3 md:text-lg text-gray-700 bg-transparent border-2 border-gray-300",
              "rounded-xl hover:bg-gray-800 hover:text-white hover:border-gray-800",
              "transition-all duration-500 ease-in-out"
            )}
          >
            Вернуться обратно
          </button>
          <button
            type="button"
            onClick={handleReload}
            className={joinClasses(
              "text-sm px-2 md:text-lg text-white bg-gradient-to-r from-green-400 to-blue-500",
              "rounded-xl hover:from-green-500 hover:to-blue-600",
              "transition-all duration-300 ease-in-out"
            )}
          >
            Перезагрузить страницу
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default ErrorScreen;
