//Leaderboard Page // Home Page
import Image from "next/image";
import styles from "./page.module.css";
import LeaderboardPage from "./leaderboard/page";
import { ReactNode } from "react";

export default function Home({ children }: { children: ReactNode }) {
  return (
    <main className={styles.main}>
      <LeaderboardPage />
    </main>
  );
}
