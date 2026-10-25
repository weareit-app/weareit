// The chosen futures' first-person lines as one sentence, in the order the
// lines are given (callers pass content order, which is written to follow a
// day or a cause, not the order of taps): "I drift off without a fight,
// sleep through the night, and wake up ready." A line that follows another
// "I …" line drops its own "I"; "I'm …" and other subjects keep theirs.
export function joinFutureLines(lines: string[]) {
  const bare = lines.map((line) => line.trim().replace(/[.!]$/, ""));
  const parts = bare.map((line, i) => {
    const previous = bare[i - 1];
    if (previous === undefined) return line;
    if (/^I /.test(line) && /^I /.test(previous)) return line.slice(2);
    return /^I\b/.test(line)
      ? line
      : line.charAt(0).toLowerCase() + line.slice(1);
  });
  if (parts.length < 2) return parts[0] ? `${parts[0]}.` : "";
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}.`;
  return `${parts.slice(0, -1).join(", ")}, and ${parts.at(-1)}.`;
}
