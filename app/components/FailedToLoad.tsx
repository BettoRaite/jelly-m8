import Button from "@/ui/Button";

type Props = {
  description: string;
  reload?: () => void;
};
function FailedToLoad({ description, reload }: Props) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
      <p className="text-sm text-center mt-2 font-comfortaa">{description}</p>
      {reload && (
        <Button onClick={reload} className="mt-4">
          Reload
        </Button>
      )}
    </div>
  );
}

export default FailedToLoad;
