
import { Input } from "./../../../components/ui/input";
import { Button } from "./../../../components/ui/button";

type UserPromptProps = {
  onSubmit: (value: string) => void;
  disabled?: boolean;
};

function UserPrompt({ onSubmit, disabled = false }: UserPromptProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (disabled) return;
    const formData = new FormData(event.currentTarget);
    const value = formData.get("userPrompt") as string;
    if (!value.trim()) return;
    onSubmit(value);
    event.currentTarget.reset();
  };
  return (
    <form className="mx-auto flex w-full max-w-4xl shrink-0 items-center gap-2 px-4 pt-2 pb-4 sm:px-6" onSubmit={handleSubmit}>
      <Input className="flex-1" type="text" name="userPrompt" aria-label="Prompt the model" placeholder="Prompt the model..." disabled={disabled} />
      <Button className="shrink-0" type="submit" disabled={disabled}>Submit</Button>
    </form>
  );
}

export { UserPrompt }
