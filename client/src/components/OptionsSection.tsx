import { useSettingsStore } from '@/stores/settingsStore';
import { Switch } from '@/components/ui/switch';
import { useUserStore } from '@/stores/userStore';
import { useEffect } from 'react';
import { requestNotificationPermission } from '@/utils/notifications';

const OptionsSection = () => {
  const { 
    settings, 
    updateSetting 
  } = useSettingsStore();
  
  const { user } = useUserStore();

  // Request notification permission if enableNotifications is true
  useEffect(() => {
    if (settings.enableNotifications) {
      requestNotificationPermission();
    }
  }, [settings.enableNotifications]);

  const handleStartWithSystemChange = (checked: boolean) => {
    updateSetting('startWithSystem', checked);
  };

  const handleEnableNotificationsChange = (checked: boolean) => {
    updateSetting('enableNotifications', checked);
    
    // If enabling notifications, request permission
    if (checked) {
      requestNotificationPermission();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Notificaciones</h3>
            <p className="text-sm text-gray-500">Permitir notificaciones del navegador</p>
          </div>
          <Switch 
            checked={settings.enableNotifications} 
            onCheckedChange={handleEnableNotificationsChange}
          />
        </div>
      </div>
    </div>
  );
};

export default OptionsSection;
