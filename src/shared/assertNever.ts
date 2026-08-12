export function assertNever(value: never): never {
    throw new Error(
      `Unexpected value: ${String(value)}`,
    );
  }

  //The never type represents a value that should be impossible.