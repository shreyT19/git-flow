// Helper function to handle retries with exponential backoff
const retryWithExponentialBackoff = async <T>(
  operation: () => Promise<T>,
  maxAttempts = 3,
  initialDelay = 1000,
): Promise<T> => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("429") &&
        attempt < maxAttempts
      ) {
        // Calculate delay with exponential backoff
        const delay = initialDelay * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw new Error("Max retry attempts reached");
};

export { retryWithExponentialBackoff };
