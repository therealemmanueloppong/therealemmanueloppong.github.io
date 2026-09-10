"use client";

import { Terminal } from "@/components/terminal";
import { portfolioContext } from "@/lib/portfolio";

export default function Home() { return <Terminal context={portfolioContext} />; }
