import { Logo } from "@/components/logo";
import TaskBoard from "@/components/task-board";


export default function Home() {
  return (
    <div className="mx-auto px-4 py-6 max-w-7xl container">
      <header>
        <div className="ml-8">
          <Logo />
        </div>
      </header>
      <main className="">
        <TaskBoard />
      </main>
    </div>
  );
}
