import Link from "next/link";

type Variant = "primary" | "secondary" | "outline";

interface ButtonProps {
  href?: string;
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
}

const variants: Record<Variant, string> = {
  primary: "bg-copper hover:bg-copper-light text-white font-semibold",
  secondary: "bg-ink hover:bg-[#1A1A1A] text-white font-semibold",
  outline: "border border-copper text-copper hover:bg-copper hover:text-white font-semibold",
};

const base =
  "font-display inline-flex items-center justify-center px-6 py-3 rounded-sm transition-colors text-sm tracking-wide gap-2";

export default function Button({
  href,
  variant = "primary",
  children,
  className = "",
  type = "button",
  disabled,
  onClick,
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={cls} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
