interface ChangelogMarkProps {
  className?: string;
}

export default function ChangelogMark({ className }: ChangelogMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m12 1.75 10.25 10.25L12 22.25 1.75 12 12 1.75Z"
        fill="currentColor"
        opacity=".16"
      />
      <path
        d="m12 1.75 10.25 10.25L12 22.25 1.75 12 12 1.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="m7.75 12 2.55 2.55 5.95-5.95"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}
