import { Button } from "@/components/ui/button";
import LinkAccountButton from "@/components/ui/link-account-button";

export default async function Home() {
  return (
    <div>
      <h1 className="text-3xl text-red-700">Hello World</h1>
      <LinkAccountButton />
    </div>
  );
}
