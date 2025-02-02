import type { Route } from "./+types/profile.page";
import useProfileQuery from "@/hooks/useProfileQuery";
import { HeartLoader } from "@/components/HeartLoader";

export default function Profile({ params }: Route.LoaderArgs) {
  const { data: profile, status } = useProfileQuery({
    type: "get",
    id: Number.parseInt(params.profileId),
  });
  if (status === "pending") {
    return <HeartLoader />;
  }
  if (status === "error") {
    return "Опс ошибочка";
  }
  return (
    <>
      <img src={profile.profileImageUrl} alt={profile.displayName} />
    </>
  );
}
