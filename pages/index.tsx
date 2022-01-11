import Speak from "../components/Speak";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <Header />
        <Speak />
      </main>
      <Footer />
    </div>
  );
}

const Header = () => {
  return (
    <h1 className="text-3xl font-bold">
      Type <span className="text-blue-600">n</span> Speak
    </h1>
  );
};

const Footer = () => {
  return (
    <footer className="flex items-center justify-center w-full h-24 border-t">
      <a
        className="flex items-center justify-center gap-x-2"
        href="https://alphaolomi.com?utm_source=type-n-speack&utm_medium=default-template&utm_campaign=type-n-speak"
        target="_blank"
        rel="noopener noreferrer"
      >
        Made with 💖 by <span className="text-blue-700">Alpha Olomi</span>
      </a>
    </footer>
  );
};
