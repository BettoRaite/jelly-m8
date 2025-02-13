import CozyBackground from "@/components/Backgrounds/CozyBackground";
import ErrorScreen from "@/components/ErrorScreen";
import { GoBack } from "@/components/GoBack";
import ProfileCard from "@/components/ProfileCard";
import SearchBar from "@/components/SearchBar";
import useProfileQuery from "@/hooks/useProfileQuery";
import { QUERY_KEYS } from "@/lib/config";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const { data: profiles, status } = useProfileQuery({
    type: "profiles",
    searchParams: `gender=female|displayName=${searchQuery}`,
  });
  useEffect(() => {
    return () => {
      if (timeoutIdRef.current !== null) {
        clearTimeout(timeoutIdRef.current as number);
      }
    };
  }, []);
  const timeoutIdRef = useRef<number | unknown>(null);
  if (status === "error") {
    return <ErrorScreen description="Не получилось загрузить профили" />;
  }
  function onSearch(q: string) {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current as number);
    }
    setSearchQuery(q);
    timeoutIdRef.current = setTimeout(() => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PROFILES],
      });
    }, 500);
  }
  return (
    <main className="pt-52 relative min-h-screen bg-white">
      <GoBack
        to="/"
        theme="light"
        className="text-purple-600 lg:text-white text-sm md:text-lg"
      />
      <CozyBackground className="hidden lg:block" />
      <h1
        className="mb-20 w-full text-center text-7xl md:text-5xl font-bold text-pink-400
        drop-shadow-[0_0_10px_rgba(255,192,203,0.8)] sticky top-4 z-30 font-caveat"
      >
        <span className="bg-gradient-to-r from-pink-400 to-yellow-300 bg-clip-text text-transparent">
          TheGirls.
        </span>
      </h1>
      <div className="flex justify-center px-4">
        <SearchBar onChange={onSearch} className="w-full" />
      </div>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8 max-w-7xl mx-auto
        relative z-20 rounded-xl"
      >
        {profiles?.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>
    </main>
  );
}
