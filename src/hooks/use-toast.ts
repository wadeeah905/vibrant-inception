
// Simple toast hook to prevent errors in the contact form
export const useToast = () => {
  const toast = ({ title, description }: { title: string, description: string }) => {
    console.log(`Toast: ${title} - ${description}`);
    // In a real app, this would show a toast notification
  };

  return { toast };
};
