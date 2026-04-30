import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGlobalStore = defineStore('global', () => {
  const globalSettings = ref<any>(null);
  const user = ref<any>(null);
  const isDemo = ref(false);

  function setGlobalSettings(settings: any) {
    globalSettings.value = settings;
  }

  function setUser(currentUser: any) {
    user.value = currentUser;
  }

  function setDemoMode(demo: boolean) {
    isDemo.value = demo;
  }

  return {
    globalSettings,
    user,
    isDemo,
    setGlobalSettings,
    setUser,
    setDemoMode,
  };
});
