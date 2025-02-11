import useComplimentQuery from "@/hooks/useComplimentQuery";
import ComplimentCard from "./ComplimentCard";
import { useAuth } from "@/hooks/useAuth";
import { AnimatePresence } from "motion/react";
import type { Compliment, User } from "@/lib/types";

type Props = {
  compliments: Compliment[];
  user: User;
  onRefetchCompliments: () => void;
};

function ComplimentCardLayout({
  compliments,
  user,
  onRefetchCompliments,
}: Props) {
  // const adminCompliments = [];
  const userCompliments = [];
  for (const c of compliments) {
    userCompliments.push(
      <ComplimentCard
        key={c.id}
        initialCompliment={c}
        className="border-yellow-400 hover:border-yellow-400"
        isOwner={c.userId === user?.id}
        onRefetchCompliments={onRefetchCompliments}
      />
    );
  }
  return (
    <div className="mt-12 mb-20 flex flex-col gap-8 w-full justify-start px-32">
      <AnimatePresence>{userCompliments}</AnimatePresence>
    </div>
  );
}
export default ComplimentCardLayout;
