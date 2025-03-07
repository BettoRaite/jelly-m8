import AnimatedGradientBackground from "@/components/Backgrounds/AnimatedGradientBackground";
import GlassyBackground from "@/components/Backgrounds/GlassyBackground";
import { GoBack } from "@/components/GoBack";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router";

export default function About() {
  return (
    <main className="flex flex-col items-center pt-10  pb-10 relative  min-h-screen text-gray-800">
      <AnimatedGradientBackground />
      <GoBack />
      <div className="p-8 rounded-2xl relative shadow-lg max-w-md mx-auto mt-10 mb-40 border border-white/30 transform hover:scale-102 transition-transform duration-300">
        <GlassyBackground className=" -z-10 rounded-xl bg-white/20" />
        <p className="text-white text-xl font-bold mb-6 text-center font-jost italic">
          С искренней благодарностью ❤️
        </p>
        <ul className="space-y-4">
          <li className="text-white text-lg relative pl-8 before:content-['✨'] before:absolute before:left-0">
            Моей{" "}
            <span className="text-pink-500 font-bold font-inter">маме</span> за
            помощь в дизайне/поддержке меня через весь проект
          </li>
          <li className="text-white text-lg relative pl-8 before:content-['🙌'] before:absolute before:left-0">
            <span className="text-pink-500 font-bold font-inter">Артуру</span>{" "}
            за поддержку
          </li>
          <li className="text-white text-lg relative pl-8 before:content-['🙌'] before:absolute before:left-0">
            <span className="text-pink-500 font-bold font-inter">Соне</span> за
            быстродействия ответа
          </li>
        </ul>
      </div>
      <div className="z-10 text-white">
        <h1 className="text-2xl font-bold mb-4 font-jost">
          А кст gривет-привет, меня зовут BettoRaite
        </h1>
        <p className="text-lg ">Вкратце обо мне....я</p>
        <span className="opacity-0 active:opacity-100 transition-all duration-1000 cursor-pointer mb-8">
          human being, came here to decide the fate of this world
        </span>
        {/* GitHub Link */}
        <Link
          to="https://github.com/BettoRaite/jelly-m8"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center text-white hover:text-gray-900 transition-colors"
        >
          <FaGithub className="mr-2" size={24} />
          <span>Сорс проекта находится в публичном доступе</span>
        </Link>
        <img
          className="rounded-xl mt-10"
          src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2Nuc3gybXgzNDBoczFucGpjbThrZzdmODhiejN2cmh6Y3QzOTdxNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qoiWO21rDrgErPiJQt/giphy.gif"
          alt=""
        />
      </div>
    </main>
  );
}
