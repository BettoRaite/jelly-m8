import { useState } from "react";
import { getAuth } from "@/hooks/useAuth";
import useComplimentQuery from "@/hooks/useComplimentQuery";
import ComplimentCard from "./complimentCard/ComplimentCard";
import Button from "@/ui/Button";

function PrivateComplimentsTab() {
  const user = getAuth();
  const [showPrivateOnly, setShowPrivateOnly] = useState(false);

  const { data: compliments } = useComplimentQuery({
    type: "user/compliments",
    userId: user?.id as number,
  });

  // Filter compliments based on the toggle state
  const filteredCompliments = showPrivateOnly
    ? compliments?.filter((c) => c.visibility === "private")
    : compliments;

  return (
    <main className="flex flex-col items-center w-full p-4 min-h-screen">
      {/* Stats Section */}

      {/* Toggle Button */}
      <Button
        type="button"
        variant="outline"
        className="text-slate-500"
        onClick={() => setShowPrivateOnly(!showPrivateOnly)}
      >
        {showPrivateOnly
          ? "Показать все комплименты"
          : "Показать только приватные"}
      </Button>

      {/* Compliments List */}
      <div className="w-full max-w-[600px] mt-10 space-y-4">
        {filteredCompliments?.map((c) => (
          <ComplimentCard
            className="w-full transform hover:scale-[1.02] transition-transform duration-200"
            key={c.id}
            initialCompliment={c}
            isOwner={false}
            variant={c.isAdmin ? "special" : "default"}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredCompliments?.length === 0 && (
        <div className="flex flex-col items-center mt-12 space-y-4">
          <div className="text-6xl">😕</div>
          <p className="text-gray-500 text-lg font-bold">
            Пока что здесь пусто...
          </p>
        </div>
      )}
    </main>
  );
}

export default PrivateComplimentsTab;
