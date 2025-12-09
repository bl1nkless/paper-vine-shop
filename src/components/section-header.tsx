type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  alignment?: "left" | "center";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  alignment = "left",
}: Props) {
  const alignmentClass =
    alignment === "center" ? "items-center text-center" : "items-start";

  return (
    <div className={`flex flex-col gap-3 ${alignmentClass}`}>
      {eyebrow ? (
        <span className="pill">{eyebrow}</span>
      ) : (
        <span className="pill">ручна робота</span>
      )}
      <h2 className="text-balance text-3xl font-semibold leading-tight sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-base text-stone-600">{description}</p>
      )}
    </div>
  );
}
