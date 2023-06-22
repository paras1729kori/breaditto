"use client";

import { FC, startTransition } from "react";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import { SubscribeToSubredditPayload } from "@/lib/validators/subReddit";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useRouter } from "next/navigation";

interface SubscribeLeaveToggleProps {
  isSubscribed: boolean;
  subRedditId: string;
  subRedditName: string;
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({
  isSubscribed,
  subRedditId,
  subRedditName,
}) => {
  const { loginToast } = useCustomToast();
  const router = useRouter();
  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subRedditId,
      };
      const { data } = await axios.post("/api/subReddit/subscribe", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        // unauthorized
        if (err.response?.status === 401) {
          return loginToast();
        }

        toast({
          title: "There was a problem.",
          description: "Something went wrong, please try again.",
          variant: "destructive",
        });
      }
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: "Subscribed",
        description: `You are now subscribed to r/${subRedditName}`,
        variant: "default",
      });
    },
  });

  const { mutate: unsubscribe, isLoading: isUnSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subRedditId,
      };
      const { data } = await axios.post("/api/subReddit/unsubscribe", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        // unauthorized
        if (err.response?.status === 401) {
          return loginToast();
        }

        toast({
          title: "There was a problem.",
          description: "Something went wrong, please try again.",
          variant: "destructive",
        });
      }
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: "Unsubscribed",
        description: `You are now unsubscribed to r/${subRedditName}`,
        variant: "default",
      });
    },
  });
  return isSubscribed ? (
    <Button
      className="w-full mt-1 mb-4"
      isLoading={isUnSubLoading}
      onClick={() => unsubscribe()}
    >
      Leave community
    </Button>
  ) : (
    <Button
      className="w-full mt-1 mb-4"
      onClick={() => subscribe()}
      isLoading={isSubLoading}
    >
      Join to post
    </Button>
  );
};

export default SubscribeLeaveToggle;
