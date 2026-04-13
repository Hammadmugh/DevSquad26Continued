export default function AdminFooter() {
  return (
    <div className="flex flex-col gap-4 pt-2">
      <hr style={{ borderColor: "rgba(35,35,33,0.2)" }} />
      <div className="flex items-center justify-between">
        <span
          className="text-[13px] font-semibold"
          style={{ fontFamily: "'Open Sans'", color: "#232321" }}
        >
          © 2023 - pulstron Dashboard
        </span>
        <div className="flex items-center gap-4">
          {["About", "Careers", "Policy", "Contact"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-[13px] font-semibold hover:opacity-70 transition-opacity"
              style={{ fontFamily: "'Open Sans'", color: "#232321" }}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
