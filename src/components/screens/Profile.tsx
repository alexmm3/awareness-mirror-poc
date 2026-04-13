import ScreenWrapper from '@/components/shared/ScreenWrapper';


export default function Profile() {
  return (
      <ScreenWrapper padBottom>
        <div className="text-label mt-4">PROFILE & SETTINGS</div>
        <div className="divider mt-3" />

        <div className="mt-4">
          <div className="text-micro">ACCOUNT</div>
          <div className="text-body text-am-text-primary mt-2">sarah.chen@example.com</div>
        </div>

        <div className="divider mt-6" />

        <div className="mt-4">
          <div className="text-micro">YOUR DATA</div>
          <div className="space-y-3 mt-3">
            <button className="ghost-link block">View my data →</button>
            <button className="ghost-link block">Export (JSON + CSV) →</button>
            <button className="ghost-link block !text-am-red">Delete account →</button>
          </div>
        </div>

        <div className="divider mt-6" />

        <div className="mt-4">
          <div className="text-micro">HRV INTEGRATION</div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-small">Apple Health HRV</span>
            <div className="w-10 h-5 bg-am-bg-tertiary rounded-full flex items-center px-0.5">
              <div className="w-4 h-4 bg-am-text-tertiary rounded-full" />
            </div>
          </div>
          <p className="text-micro mt-1">Enables biometric grounding in a future update</p>
        </div>

        <div className="divider mt-6" />

        <div className="mt-4">
          <div className="text-micro">NOTIFICATIONS</div>
          <div className="text-body text-am-text-secondary mt-2">Daily reminder: 09:00</div>
        </div>

        <div className="divider mt-6" />

        <div className="mt-4 space-y-2">
          <button className="ghost-link block text-[12px]">Terms of Service</button>
          <button className="ghost-link block text-[12px]">Privacy Policy</button>
        </div>

        <div className="text-micro mt-6 mb-8">v1.0.0-prototype</div>
      </ScreenWrapper>
  );
}
