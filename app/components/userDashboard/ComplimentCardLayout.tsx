import useComplimentQuery from "@/hooks/useComplimentQuery";
import ComplimentCard from "./ComplimentCard";
import { useAuth } from "@/hooks/useAuth";
import { AnimatePresence } from "motion/react";

type Props = {
  profileId: number;
};

function ComplimentCardLayout({ profileId }: Props) {
  const { data: user } = useAuth();
  const {
    data: items,
    status,
    refetch,
  } = useComplimentQuery({
    type: "compliments",
    profileId: profileId,
  });
  if (status === "pending") {
    return "loading";
  }
  if (status === "error") {
    return "Error";
  }
  // const adminCompliments = [];
  const userCompliments = [];
  const compliments = [];
  for (const c of items) {
    if (c.userId === user?.id) {
      userCompliments.push(
        <ComplimentCard
          key={c.id}
          initialCompliment={c}
          className="border-yellow-400 hover:border-yellow-400"
          isOwner={true}
          onRefetchCompliments={refetch}
        />
      );
    } else {
      compliments.push(
        <ComplimentCard
          key={c.id}
          initialCompliment={c}
          isOwner={false}
          onRefetchCompliments={refetch}
        />
      );
    }
  }
  return (
    <div className="mt-12 mb-20 flex flex-col gap-8 w-full">
      <AnimatePresence>
        {userCompliments}
        {compliments}
      </AnimatePresence>
    </div>
  );
}
export default ComplimentCardLayout;
