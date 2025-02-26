import CozyBackground from "@/components/Backgrounds/CozyBackground";
import ErrorScreen from "@/components/ErrorScreen";
import { GoBack } from "@/components/GoBack";
import ProfileCard from "@/components/ProfileCard";
import SearchBar from "@/components/SearchBar";
import useProfileQuery from "@/hooks/useProfileQuery";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: profiles,
    status,
    isFetching,
    refetch,
  } = useProfileQuery({
    type: "profiles",
    searchParams: `gender=female|displayName=${searchQuery}`,
  });
  const timeoutIdRef = useRef<number | null>(null);
  useEffect(() => {
    return () => {
      if (timeoutIdRef.current !== null) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  const handleSearch = (query: string) => {
    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);

    timeoutIdRef.current = window.setTimeout(() => {
      setSearchQuery(query);
    }, 500);
  };

  if (status === "error") {
    return <ErrorScreen description="Не получилось загрузить профили" />;
  }

  return (
    <main className="pt-52 relative min-h-screen bg-white">
      <GoBack
        to="/"
        theme="light"
        className="text-black md:text-white text-sm md:text-lg"
      />
      <CozyBackground />
      <header className="mb-20 sticky top-4 z-30">
        <h1 className="w-full text-center text-4xl sm:text-5xl  font-bold drop-shadow-[0_0_10px_rgba(255,192,203,0.8)] font-caveat">
          <span className="bg-gradient-to-r from-pink-400 to-yellow-300 bg-clip-text text-transparent">
            TheGirls.
          </span>
        </h1>
      </header>

      <div className="flex justify-center px-8 sm:px-4 relative">
        <SearchBar
          onChange={handleSearch}
          className="w-full"
          aria-label="Search profiles"
        />
      </div>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8 max-w-7xl mx-auto
        relative z-20 rounded-xl"
      >
        {profiles?.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
        {!isFetching && profiles?.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500 font-bold">
            Ничего не нашлось..
          </div>
        )}
      </div>
    </main>
  );
}
