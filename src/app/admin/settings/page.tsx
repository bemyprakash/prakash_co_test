export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-[8px] border border-gray-100 shadow-sm p-8 text-center space-y-4">
      <div className="w-16 h-16 bg-brand-light text-brand-primary rounded-full flex items-center justify-center text-2xl font-serif">
        S
      </div>
      <h1 className="text-2xl font-bold font-serif text-charcoal">System Settings</h1>
      <p className="text-muted max-w-md">
        This module is currently under development. Soon, you'll be able to configure global store settings, taxes, and shipping rates.
      </p>
    </div>
  );
}
