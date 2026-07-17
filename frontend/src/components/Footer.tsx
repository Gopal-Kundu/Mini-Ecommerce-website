

export default function Footer() {
  return (
    <footer className="flex items-center justify-center bg-black text-white p-4 italic font-sans">
      <div className="max-w-screen-xl mx-auto flex items-center justify-center w-full px-4">
        <p className="text-sm">
          Thank you for visiting... Made by{" "}
          <span className="font-semibold not-italic text-indigo-400"> Gopal Kundu </span>
        </p>
        <div>
          <a
            className="inline-block text-white hover:text-indigo-400 transition-colors cursor-pointer"
            href="https://www.linkedin.com/in/gopalcodes/"
            target="_blank"
            rel="noopener noreferrer"
          >
          </a>
        </div>
      </div>
    </footer>
  );
}
