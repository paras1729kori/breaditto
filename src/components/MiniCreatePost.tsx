"use client";

import { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import { FC } from "react";
import UserAvatar from "./UserAvatar";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { ImageIcon, Link2 } from "lucide-react";

interface MiniCreatePostProps {
  session: Session | null;
}

const MiniCreatePost: FC<MiniCreatePostProps> = ({ session }) => {
  const router = useRouter();
  const pathName = usePathname();
  return (
    <li className="list-none overflow-hidden rounded-md bg-white shadow">
      <div className="h-full px-6 py-4 flex flex-col sm:flex-row justify-between sm:gap-6 gap-2">
        <div className="relative">
          <UserAvatar
            user={{
              name: session?.user.name || null,
              image: session?.user.image || null,
            }}
          />

          <span className="absolute bottom-0 left-0 rounded-full h-3 w-3 bg-green-500 outline outline-2 outline-white" />
        </div>

        <Input
          readOnly
          onClick={() => router.push(pathName + "/submit")}
          placeholder="Create post"
        />
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => router.push(pathName + "/submit")}
          >
            <ImageIcon className="text-zinc-600" />
          </Button>

          <Button
            variant="ghost"
            onClick={() => router.push(pathName + "/submit")}
          >
            <Link2 className="text-zinc-600" />
          </Button>
        </div>
      </div>
    </li>
  );
};

export default MiniCreatePost;
