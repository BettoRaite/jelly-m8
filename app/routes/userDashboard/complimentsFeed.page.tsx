import GlassyBackground from "@/components/Backgrounds/GlassyBackground";
import { GoBack } from "@/components/GoBack";
import SearchBar from "@/components/SearchBar";
import ComplimentCard from "@/components/userDashboard/ComplimentCard";
import { getAuth } from "@/hooks/useAuth";
import useComplimentQuery from "@/hooks/useComplimentQuery";
import { joinClasses } from "@/lib/utils/strings";
import Button from "@/ui/Button";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { FaFilter } from "react-icons/fa";

export default function Page() {
  const user = getAuth();
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
  const cards = (items ?? [])
    .map((c) => {
      const isOwned = c.userId === user?.id;
      if (filterOwned && !isOwned) {
        return null;
      }

      return (
        <ComplimentCard
          key={c.id}
          initialCompliment={c}
          className={joinClasses({
            "border-yellow-400 hover:border-yellow-400 max-w-[680px] justify-self":
              !c.isAdmin,
            "max-w-[680px] justify-self": c.isAdmin,
          })}
          isOwner={isOwned}
          theme={c.isAdmin ? "special" : "default"}
          onRefetchCompliments={refetch}
        />
      );
    })
    .filter(Boolean);
  return (
    <main className="pt-60 bg-transparent relative">
      <GoBack to="/" theme="dark" />
      <GlassyBackground className="-z-20 bg-gray-200" />
      <section className="w-[90%] m-auto">
        <h1 className="text-center mb-40 sm:text-5xl text-4xl  font-caveat text-pink-400">
          Compliments:3
        </h1>
        <div className="flex flex-col items-center xl:items-start xl:grid xl:grid-cols-[auto_1fr] px-2 sm:px-10 gap-20 min-h-screen">
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
                  hidden: cards.length > 0,
                })}
              >
                <p className="text-2xl mt-4 text-gray-500 font-bold font-comfortaa">
                  {status === "pending" ? "ща сек..." : "Пусто..."}
                </p>
              </div>
            </div>
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
