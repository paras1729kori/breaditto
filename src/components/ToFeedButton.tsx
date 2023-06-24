"use client";

import { ChevronLeft } from "lucide-react";
import { buttonVariants } from "./ui/Button";
import { usePathname } from "next/navigation";

const ToFeedButton = () => {
  const pathaName = usePathname();

  // if path is /r/mycom, turn into /
  // if path is /r/mycom/post/cligad6jf0003uhest4qqkeco, turn into /r/mycom
  const subRedditPath = getSubRedditPath(pathaName);

  return (
    <a
      href={subRedditPath}
      className={buttonVariants({
        variant: "ghost",
      })}
    >
      <ChevronLeft className="h-4 w-4 mr-1" />
      {subRedditPath === "/" ? "Back home" : "Back to community"}
    </a>
  );
};

const getSubRedditPath = (pathName: string) => {
  const splitPath = pathName.split("/");

  if (splitPath.length > 3) {
    return `/${splitPath[1]}/${splitPath[2]}`;
  }
  // default path, in case pathname does not match expected format
  else {
    return "/";
  }
};

export default ToFeedButton;
