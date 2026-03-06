import About from "./About";
import Competencies from "./Competencies";
import Decisions from "./Decisions";
import Experience from "./Experience";
import Footer from "./Footer";
import Future from "./Future";
import ChatSection from "./ChatSection";
import Header from "./Header";
import Hero from "./Hero";
import Learnings from "./Learnings";
import ProblemSolving from "./ProblemSolving";
import TechStack from "./TechStack";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <About />
        <Competencies />
        <Experience />
        <ProblemSolving />
        <TechStack />
        <Decisions />
        <Learnings />
        <Future />
        <ChatSection />
      </main>
      <Footer />
    </div>
  );
}
