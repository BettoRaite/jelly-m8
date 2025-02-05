import useComplimentQuery from "@/hooks/useComplimentQuery";
import ComplimentCard from "./ComplimentCard";

type Props = {
  profileId: number;
};

function ComplimentCardLayout({ profileId }: Props) {
  const { data: items, status } = useComplimentQuery({
    type: "compliments",
    profileId: profileId,
  });
  if (status === "pending") {
    return "loading";
  }
  if (status === "error") {
    return "error";
  }
  return (
    <div className="mt-12 mb-20 flex flex-col gap-8 w-full">
      {items?.map((c) => {
        return <ComplimentCard key={c.id} compliment={c} />;
      })}
    </div>
  );
}
export default ComplimentCardLayout;
