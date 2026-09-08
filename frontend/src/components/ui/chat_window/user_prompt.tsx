
import { Input } from "../input";
import { Button } from "../button";

type UserPromptProps = {
  onSubmit: (value: string) => void;
};

function UserPrompt({ onSubmit }: UserPromptProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const value = formData.get("userPrompt") as string;
    onSubmit(value);
    event.currentTarget.reset();
  };
  return (
    <form className="mx-auto flex w-full max-w-4xl shrink-0 items-center gap-2 px-4 pt-2 pb-4 sm:px-6" onSubmit={handleSubmit}>
      <Input className="flex-1" type="text" name="userPrompt" aria-label="Prompt the model" placeholder="Prompt the model..." />
      <Button className="shrink-0" type="submit">Submit</Button>
    </form>
  );
}

export { UserPrompt }
