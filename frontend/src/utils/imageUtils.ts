export const createLocalImageUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

export const revokeLocalImageUrl = (url: string): void => {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};