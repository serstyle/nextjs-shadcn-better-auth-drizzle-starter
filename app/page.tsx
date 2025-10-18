import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-sans sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-[32px] text-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <h1 className="text-2xl font-bold">
          Starter - Next.js + Better-Auth + Drizzle + Postgres
        </h1>
        <p className="text-sm text-muted-foreground">
          A starter kit for building web applications with Next.js, Better Auth,
          and Drizzle Postgres.
        </p>
        <Button asChild>
          <Link href="/dashboard">Get Started</Link>
        </Button>
      </main>
      <footer className="row-start-3 flex flex-wrap items-center justify-center gap-[24px]">
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          target="_blank"
          href="https://nextjs.org"
        >
          Next.js
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          target="_blank"
          href="https://better-auth.com"
        >
          Better-Auth
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          target="_blank"
          href="https://drizzle.team"
        >
          Drizzle
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          target="_blank"
          href="https://postgres.org"
        >
          Postgres
        </Link>
      </footer>
    </div>
  );
}
