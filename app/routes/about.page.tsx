import { GoBack } from "@/components/GoBack";
import { FaGithub } from "react-icons/fa"; // Import GitHub icon
import { Link } from "react-router";

export default function About() {
  return (
    <main className="flex flex-col items-center pt-10 min-h-screen bg-gray-100 text-gray-800">
      <GoBack theme="dark" />
      <h1 className="text-2xl font-bold mb-4 font-jost">
        Привет-привет, меня зовут BettoRaite
      </h1>
      <p className="text-lg ">Вкратце обо мне....я</p>
      <span className="opacity-0 active:opacity-100 transition-all duration-1000 cursor-pointer mb-8">
        human being, came here to decide the fate of this world
      </span>
      {/* GitHub Link */}
      <Link
        to="https://github.com/BettoRaite/jelly-m8" // Replace with your GitHub URL
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors"
      >
        <FaGithub className="mr-2" size={24} />
        <span>Сорс проекта находится в публичном доступе</span>
      </Link>
      <img
        className="rounded-xl mt-10"
        src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2Nuc3gybXgzNDBoczFucGpjbThrZzdmODhiejN2cmh6Y3QzOTdxNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qoiWO21rDrgErPiJQt/giphy.gif"
        alt=""
      />
    </main>
  );
}
