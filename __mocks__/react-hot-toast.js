const toast = jest.fn();
toast.success = jest.fn();
toast.error = jest.fn();
toast.loading = jest.fn();

export { toast };
export const Toaster = () => null;
export default toast;
