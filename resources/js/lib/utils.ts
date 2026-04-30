type ClassValue = string | number | boolean | undefined | null | Record<string, boolean> | ClassValue[];

function clsx(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      classes.push(clsx(...input));
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }

  return classes.join(' ');
}

function twMerge(className: string): string {
  // Simple implementation - just return the className
  // In a full implementation, this would deduplicate Tailwind classes
  return className;
}

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(...inputs));
}
