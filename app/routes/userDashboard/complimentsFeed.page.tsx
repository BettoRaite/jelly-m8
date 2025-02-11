import { GoBack } from "@/components/GoBack";
import ComplimentCardLayout from "@/components/userDashboard/complimentsFeed/ComplimentCardLayout";
import useComplimentQuery from "@/hooks/useComplimentQuery";
import { useAuth } from "@/hooks/useAuth";
import { AnimatePresence } from "motion/react";
import type { Compliment, User } from "@/lib/types";
import ComplimentCard from "@/components/userDashboard/complimentsFeed/ComplimentCard";
import Button from "@/ui/Button";
import SearchBar from "@/components/SearchBar";
import { FiFilter } from "react-icons/fi";
import { FaFilter, FaSearch } from "react-icons/fa";
import { useState } from "react";
import { HeartLoader } from "@/components/HeartLoader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/config";
import ErrorScreen from "@/components/ErrorScreen";
import { h1 } from "motion/react-client";
import { IoIosHeartEmpty } from "react-icons/io";
import { joinClasses } from "@/lib/utils/strings";
import GlassyBackground from "@/components/Backgrounds/GlassyBackground";

export default function Page() {
  const { data: user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOwned, setFilterOwned] = useState(false);
  const {
    data: items,
    status,
    refetch,
  } = useComplimentQuery({
    type: "compliments",
    searchPattern: searchQuery ? `title=${searchQuery}` : "",
  });
  if (status === "error") {
    return "err";
  }
  function onSearch(q: string) {
    setSearchQuery(q);
    refetch();
  }
  const cards = items?.map((c) => {
    const isOwned = c.userId !== user?.id;
    if (filterOwned && isOwned) {
      return null;
    }
    return (
      <ComplimentCard
        key={c.id}
        initialCompliment={c}
        className="border-yellow-400 hover:border-yellow-400 max-w-[680px] justify-self"
        isOwner={isOwned}
        onRefetchCompliments={refetch}
      />
    );
  });
  return (
    <main className="pt-60 bg-transparent relative">
      <GoBack to="/" theme="dark" />
      <GlassyBackground className="-z-20 bg-gray-200" />
      <section className="w-[90%] m-auto">
        <h1 className="text-center mb-40 xl:text-5xl font-comfortaa">
          Compliments
        </h1>
        <div className="flex flex-col items-center xl:items-start xl:grid xl:grid-cols-[auto_1fr] px-10 gap-20 min-h-screen">
          <div className="min-w-[280px] bg-white xl:w-full h-min pb-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center flex-col p-6">
            <p className="mb-8 text-2xl font-semibold flex items-center text-gray-700">
              <FaFilter className="mr-2 text-blue-500" />
              Фильтр
            </p>
            <SearchBar onSearch={onSearch} className="w-full" />
            <Button
              onClick={() => setFilterOwned(!filterOwned)}
              variant="outline"
              className="mt-4 border bg-gray-300 hover:scale-105 font-bold text-gray-600"
            >
              Показать только мои{filterOwned ? " ✅" : " ❌"}
            </Button>
          </div>
          <AnimatePresence>
            <div className="mb-20 flex flex-col gap-8 w-full justify-center">
              {cards}
              <div
                className={joinClasses("flex justify-center", {
                  hidden: (cards?.length ?? 0) > 0,
                })}
              >
                <p className="text-2xl mt-4 text-gray-500 font-bold font-comfortaa">
                  {status === "pending" ? " щас сек" : "Пусто..."}
                </p>
              </div>
            </div>
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
