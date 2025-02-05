import type { Compliment } from "@/lib/types";
import { joinClasses } from "@/lib/utils/strings";

function ComplimentCard({ compliment }: { compliment: Compliment }) {
  return (
    <article
      className={joinClasses(
        "group relative flex flex-col gap-4 rounded-xl p-4",
        "bg-white/80 backdrop-blur-sm transition-all hover:bg-white/90",
        "shadow-lg shadow-gray-200/40 hover:shadow-gray-200/60",
        "border border-gray-100/70 hover:border-gray-100/90"
      )}
    >
      <div className="flex items-center gap-4">
        <img
          src={compliment.author.profileImageUrl || "/default-avatar.png"}
          alt={compliment.author.displayName}
          className="h-14 w-14 rounded-full object-cover border-2 border-white/80 shadow-md"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {compliment.author.displayName}
          </h3>
          <p className="text-sm text-gray-500">
            @{compliment.author.displayName}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold text-gray-700">{compliment.title}</h2>
        <p className="text-gray-700 leading-relaxed">{compliment.content}</p>
      </div>

      <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          {/* <span>{new Date(compliment.createdAt).toLocaleDateString()}</span> */}
        </div>
      </div>
    </article>
  );
}

export default ComplimentCard;
