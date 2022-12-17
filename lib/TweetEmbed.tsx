"use client";
import ReactTweetEmbed from "react-tweet-embed";

export function TweetEmbed({ tweetId }: { tweetId: string }) {
  return <ReactTweetEmbed tweetId={tweetId} />;
}
