import GlassyBackground from "@/components/Backgrounds/GlassyBackground";
import ErrorScreen from "@/components/ErrorScreen";
import { GoBack } from "@/components/GoBack";
import { HeartLoader } from "@/components/HeartLoader";
import SearchBar from "@/components/SearchBar";
import ComplimentCard from "@/components/complimentCard/ComplimentCard";
import { getAuth, useAuth } from "@/hooks/useAuth";
import useComplimentQuery from "@/hooks/useComplimentQuery";
import {
  constructSearchPattern,
  constructSortConfig,
  joinClasses,
} from "@/lib/utils/strings";
import Button from "@/ui/Button";
import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaFilter } from "react-icons/fa";
import { HiChevronUp } from "react-icons/hi";
type Filters = {
  showOnlyOwned: boolean;
  likes: "desc" | "asc";
  createdAt: "desc" | "asc";
};
const INITIAL_FILTERS: Filters = {
  showOnlyOwned: false,
  likes: "desc",
  createdAt: "desc",
};
export default function Page() {
  const user = getAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const {
    data: items,
    status,
    refetch,
  } = useComplimentQuery({
    type: "compliments",
    searchPattern: constructSearchPattern({
      title: searchQuery,
      ...constructSortConfig(filters),
    }),
  });
  useEffect(() => {
    if (status === "error") {
      toast.error("Ошибка загрузки комлиментов", {
        position: "bottom-center",
      });
    }
  }, [status]);
  if (status === "pending") {
    return <HeartLoader />;
  }
  function onSearch(q: string) {
    setSearchQuery(q);
    refetch();
  }
  function createApplyFiltersHandler(filtersToApply: Partial<Filters>) {
    return () =>
      setFilters({
        ...filters,
        ...filtersToApply,
      });
  }
  function handleRemoveFiltersClick() {
    setFilters({} as Filters);
  }
  return (
    <main className="pt-60 bg-transparent relative">
      <GoBack to="/" theme="dark" />
      <GlassyBackground className="-z-20 bg-gray-200" />
      <section className="w-[90%] m-auto">
        <h1
          className="text-center mb-20 sm:text-5xl text-4xl  font-caveat relative
          bg-gradient-to-tl from-pink-400 to-pink-500 bg-clip-text text-transparent"
        >
          Discover compliments
        </h1>
        <span className="h-[1px] rounded-xl bg-slate-400 bg-opacity-35 w-9/12 block mb-20 mx-auto shadow-lg" />
        <div className=" flex flex-col items-center xl:items-start xl:grid xl:grid-cols-[auto_1fr] px-2 sm:px-10 gap-20 min-h-screen">
          {/* =========================== Filter menu */}
          <div className="min-w-[280px] bg-white xl:w-full h-min pb-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center flex-col p-6">
            <p className="mb-8 text-2xl font-semibold flex items-center text-gray-700">
              <FaFilter className="mr-2 text-blue-500" />
              Фильтр
            </p>
            <SearchBar onSearch={onSearch} className="w-full" />
            {user && (
              <Button
                onClick={createApplyFiltersHandler({
                  showOnlyOwned: !filters.showOnlyOwned,
                })}
                variant="outline"
                className="mt-4 border bg-slate-300 hover:scale-105 font-bold text-slate-600"
              >
                Показать только мои{filters.showOnlyOwned ? " ✅" : " ❌"}
              </Button>
            )}
            <div className="flex gap-4">
              <Button
                onClick={createApplyFiltersHandler({
                  likes: filters.likes === "desc" ? "asc" : "desc",
                })}
                variant="solid"
                className={joinClasses(
                  "mt-4 border hover:scale-105 font-bold  transition-transform duration-300",
                  {
                    "bg-blue-500 text-white": filters.likes,
                    "bg-slate-200 text-slate-950 text-opacity-40 hover:bg-slate-400":
                      !filters.likes,
                  }
                )}
                aria-pressed={filters.likes !== INITIAL_FILTERS.likes}
              >
                ❤ Лайки
                <span
                  className={joinClasses("transform duration-200 text-lg", {
                    "rotate-180": filters.likes === "asc",
                  })}
                >
                  <HiChevronUp />
                </span>
              </Button>
              <Button
                onClick={createApplyFiltersHandler({
                  createdAt: filters.createdAt === "desc" ? "asc" : "desc",
                })}
                variant="solid"
                className={joinClasses(
                  "mt-4 border hover:scale-105 font-bold  transition-transform duration-300",
                  {
                    "bg-blue-500 text-white": filters.createdAt,
                    "bg-slate-200 text-slate-950 text-opacity-40 hover:bg-slate-400":
                      !filters.createdAt,
                  }
                )}
                aria-pressed={filters.createdAt !== INITIAL_FILTERS.createdAt}
              >
                ⌛ Время
                <span
                  className={joinClasses("transform duration-200 text-lg", {
                    "rotate-180": filters.createdAt === "asc",
                  })}
                >
                  <HiChevronUp />
                </span>
              </Button>
            </div>
            <Button
              onClick={handleRemoveFiltersClick}
              variant="solid"
              className={joinClasses(
                "mt-4 border hover:scale-105 font-bold bg-slate-400 hover:text-white hover:bg-red-500 text-slate-800 text-opacity-60 transition-all duration-300"
              )}
            >
              Убрать фильтры
            </Button>
          </div>
          {/* =========================== Filter menu end */}

          {/* =========================== Cards layout */}
          <AnimatePresence>
            <div className="mb-20 flex flex-col gap-8 w-full justify-center">
              {items?.map((c) => {
                const isOwned = c.userId === user?.id;
                if (filters.showOnlyOwned && !isOwned) {
                  return null;
                }

                return (
                  <ComplimentCard
                    key={c.id}
                    initialCompliment={c}
                    className={joinClasses({
                      "border-yellow-400 hover:border-yellow-400 max-w-[680px] justify-self":
                        isOwned && !c.isAdmin,
                      "max-w-[680px] justify-self": c.isAdmin,
                    })}
                    isOwner={isOwned}
                    variant={c.isAdmin ? "special" : "default"}
                  />
                );
              })}
              <div
                className={joinClasses("flex justify-center", {
                  hidden: (items?.length ?? 0) > 0,
                })}
              >
                <p className="text-2xl mt-4 text-gray-500 font-bold font-comfortaa">
                  {status === "pending" ? "ща сек..." : "Пусто..."}
                </p>
              </div>
            </div>
          </AnimatePresence>
          {/* =========================== Cards layout end */}
        </div>
      </section>
    </main>
  );
}
