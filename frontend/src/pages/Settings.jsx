import React from "react";

export default function Settings() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
        Settings
      </h1>
      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6">
        Basic account and experience settings. This is a placeholder page ready for more detailed
        controls.
      </p>
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Notifications
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Configure how you want to be notified about bookings and updates.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Preferences
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Future options like default currency, language and theme can be managed here.
          </p>
        </div>
      </div>
    </div>
  );
}




