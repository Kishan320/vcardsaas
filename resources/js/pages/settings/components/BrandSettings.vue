<template>
  <SettingsSection
    :title="t('Brand Settings')"
    :description="t('Customize your application\'s branding and appearance')"
  >
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="flex space-x-2 mb-6">
          <Button
            :variant="activeSection === 'logos' ? 'default' : 'outline'"
            size="sm"
            @click="activeSection = 'logos'"
            class="flex-1"
          >
            <Upload :size="14" class="mr-2" />
            {{ t('Logos') }}
          </Button>
          <Button
            :variant="activeSection === 'text' ? 'default' : 'outline'"
            size="sm"
            @click="activeSection = 'text'"
            class="flex-1"
          >
            <FileText :size="14" class="mr-2" />
            {{ t('Text') }}
          </Button>
          <Button
            :variant="activeSection === 'theme' ? 'default' : 'outline'"
            size="sm"
            @click="activeSection = 'theme'"
            class="flex-1"
          >
            <Palette :size="14" class="mr-2" />
            {{ t('Theme') }}
          </Button>
        </div>

        <!-- Logos Section -->
        <div v-if="activeSection === 'logos'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-3">
              <Label>{{ t('Logo (Dark Mode)') }}</Label>
              <div class="flex flex-col gap-3">
                <div class="border rounded-md p-4 flex items-center justify-center bg-muted/30 h-32">
                  <img v-if="brandSettings.logoDark && !logoErrors.logoDark" :src="getDisplayUrl(brandSettings.logoDark)" alt="Dark Logo" class="max-h-full max-w-full object-contain" @error="logoErrors.logoDark = true" />
                  <div v-else class="text-muted-foreground flex flex-col items-center gap-2">
                    <div class="h-12 w-24 bg-muted flex items-center justify-center rounded border border-dashed">
                      <span class="font-semibold text-muted-foreground">{{ t('Logo') }}</span>
                    </div>
                    <span class="text-xs">{{ logoErrors.logoDark ? t('Failed to load image') : t('No logo selected') }}</span>
                  </div>
                </div>
                <Input v-model="brandSettings.logoDark" :placeholder="t('Enter dark mode logo URL')" />
              </div>
            </div>

            <div class="space-y-3">
              <Label>{{ t('Logo (Light Mode)') }}</Label>
              <div class="flex flex-col gap-3">
                <div class="border rounded-md p-4 flex items-center justify-center bg-muted/30 h-32">
                  <img v-if="brandSettings.logoLight && !logoErrors.logoLight" :src="getDisplayUrl(brandSettings.logoLight)" alt="Light Logo" class="max-h-full max-w-full object-contain" @error="logoErrors.logoLight = true" />
                  <div v-else class="text-muted-foreground flex flex-col items-center gap-2">
                    <div class="h-12 w-24 bg-muted flex items-center justify-center rounded border border-dashed">
                      <span class="font-semibold text-muted-foreground">{{ t('Logo') }}</span>
                    </div>
                    <span class="text-xs">{{ logoErrors.logoLight ? t('Failed to load image') : t('No logo selected') }}</span>
                  </div>
                </div>
                <Input v-model="brandSettings.logoLight" :placeholder="t('Enter light mode logo URL')" />
              </div>
            </div>

            <div class="space-y-3">
              <Label>{{ t('Favicon') }}</Label>
              <div class="flex flex-col gap-3">
                <div class="border rounded-md p-4 flex items-center justify-center bg-muted/30 h-20">
                  <img v-if="brandSettings.favicon && !logoErrors.favicon" :src="getDisplayUrl(brandSettings.favicon)" alt="Favicon" class="h-16 w-16 object-contain" @error="logoErrors.favicon = true" />
                  <div v-else class="text-muted-foreground flex flex-col items-center gap-1">
                    <div class="h-10 w-10 bg-muted flex items-center justify-center rounded border border-dashed">
                      <span class="font-semibold text-xs text-muted-foreground">{{ t('Icon') }}</span>
                    </div>
                    <span class="text-xs">{{ logoErrors.favicon ? t('Failed to load image') : t('No favicon selected') }}</span>
                  </div>
                </div>
                <Input v-model="brandSettings.favicon" :placeholder="t('Enter favicon URL')" />
              </div>
            </div>
          </div>
        </div>

        <!-- Text Section -->
        <div v-if="activeSection === 'text'" class="space-y-6">
          <div class="grid grid-cols-1 gap-6">
            <div class="space-y-3">
              <Label for="titleText">{{ t('Title Text') }}</Label>
              <Input
                id="titleText"
                v-model="brandSettings.titleText"
                placeholder="WorkDo"
              />
              <p class="text-xs text-muted-foreground">
                {{ t('Application title displayed in the browser tab') }}
              </p>
            </div>

            <div class="space-y-3">
              <Label for="footerText">{{ t('Footer Text') }}</Label>
              <Input
                id="footerText"
                v-model="brandSettings.footerText"
                placeholder="© 2025 WorkDo. All rights reserved."
              />
              <p class="text-xs text-muted-foreground">
                {{ t('Text displayed in the footer') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Theme Section -->
        <div v-if="activeSection === 'theme'" class="space-y-6">
          <div class="flex flex-col space-y-8">
            <!-- Theme Color Section -->
            <div class="space-y-4">
              <div class="flex items-center">
                <Palette :size="20" class="mr-2 text-muted-foreground" />
                <h3 class="text-base font-medium">{{ t('Theme Color') }}</h3>
              </div>
              <div class="h-px bg-border my-2" />

              <div class="grid grid-cols-6 gap-2">
                <Button
                  v-for="(hex, color) in themeColors"
                  :key="color"
                  type="button"
                  :variant="brandSettings.themeColor === color ? 'default' : 'outline'"
                  class="h-8 w-full p-0 relative"
                  :style="{ backgroundColor: brandSettings.themeColor === color ? hex : 'transparent' }"
                  @click="brandSettings.themeColor = color"
                >
                  <span class="absolute inset-1 rounded-sm" :style="{ backgroundColor: hex }" />
                </Button>
                <Button
                  type="button"
                  :variant="brandSettings.themeColor === 'custom' ? 'default' : 'outline'"
                  class="h-8 w-full p-0 relative"
                  :style="{ backgroundColor: brandSettings.themeColor === 'custom' ? brandSettings.customColor : 'transparent' }"
                  @click="brandSettings.themeColor = 'custom'"
                >
                  <span class="absolute inset-1 rounded-sm" :style="{ backgroundColor: brandSettings.customColor }" />
                </Button>
              </div>

              <div v-if="brandSettings.themeColor === 'custom'" class="space-y-2 mt-4">
                <Label for="customColor">{{ t('Custom Color') }}</Label>
                <div class="flex gap-2">
                  <div class="relative">
                    <Input
                      id="colorPicker"
                      type="color"
                      v-model="brandSettings.customColor"
                      class="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div class="w-10 h-10 rounded border cursor-pointer" :style="{ backgroundColor: brandSettings.customColor }" />
                  </div>
                  <Input
                    id="customColor"
                    v-model="brandSettings.customColor"
                    placeholder="#3b82f6"
                  />
                </div>
              </div>
            </div>

            <!-- Sidebar Section -->
            <div class="space-y-4">
              <div class="flex items-center">
                <SidebarIcon :size="20" class="mr-2 text-muted-foreground" />
                <h3 class="text-base font-medium">{{ t('Sidebar') }}</h3>
              </div>
              <div class="h-px bg-border my-2" />

              <div class="space-y-6">
                <div>
                  <Label class="mb-2 block">{{ t('Sidebar Variant') }}</Label>
                  <div class="grid grid-cols-3 gap-3">
                    <Button
                      v-for="variant in ['inset', 'floating', 'minimal']"
                      :key="variant"
                      type="button"
                      :variant="brandSettings.sidebarVariant === variant ? 'default' : 'outline'"
                      class="h-10 justify-start"
                      @click="brandSettings.sidebarVariant = variant"
                    >
                      {{ variant.charAt(0).toUpperCase() + variant.slice(1) }}
                      <Check v-if="brandSettings.sidebarVariant === variant" :size="14" class="ml-2" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label class="mb-2 block">{{ t('Sidebar Style') }}</Label>
                  <div class="grid grid-cols-3 gap-3">
                    <Button
                      v-for="style in sidebarStyles"
                      :key="style.id"
                      type="button"
                      :variant="brandSettings.sidebarStyle === style.id ? 'default' : 'outline'"
                      class="h-10 justify-start"
                      @click="brandSettings.sidebarStyle = style.id"
                    >
                      {{ style.name }}
                      <Check v-if="brandSettings.sidebarStyle === style.id" :size="14" class="ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Layout Section -->
            <div class="space-y-4">
              <div class="flex items-center">
                <Layout :size="20" class="mr-2 text-muted-foreground" />
                <h3 class="text-base font-medium">{{ t('Layout') }}</h3>
              </div>
              <div class="h-px bg-border my-2" />

              <div class="space-y-2">
                <Label class="mb-2 block">{{ t('Layout Direction') }}</Label>
                <div class="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    :variant="brandSettings.layoutDirection === 'left' ? 'default' : 'outline'"
                    class="h-10 justify-start"
                    @click="brandSettings.layoutDirection = 'left'"
                  >
                    {{ t('Left-to-Right') }}
                    <Check v-if="brandSettings.layoutDirection === 'left'" :size="14" class="ml-2" />
                  </Button>
                  <Button
                    type="button"
                    :variant="brandSettings.layoutDirection === 'right' ? 'default' : 'outline'"
                    class="h-10 justify-start"
                    @click="brandSettings.layoutDirection = 'right'"
                  >
                    {{ t('Right-to-Left') }}
                    <Check v-if="brandSettings.layoutDirection === 'right'" :size="14" class="ml-2" />
                  </Button>
                </div>
              </div>
            </div>

            <!-- Mode Section -->
            <div class="space-y-4">
              <div class="flex items-center">
                <Moon :size="20" class="mr-2 text-muted-foreground" />
                <h3 class="text-base font-medium">{{ t('Theme Mode') }}</h3>
              </div>
              <div class="h-px bg-border my-2" />

              <div class="space-y-2">
                <div class="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    :variant="brandSettings.themeMode === 'light' ? 'default' : 'outline'"
                    class="h-10 justify-start"
                    @click="brandSettings.themeMode = 'light'"
                  >
                    {{ t('Light') }}
                    <Check v-if="brandSettings.themeMode === 'light'" :size="14" class="ml-2" />
                  </Button>
                  <Button
                    type="button"
                    :variant="brandSettings.themeMode === 'dark' ? 'default' : 'outline'"
                    class="h-10 justify-start"
                    @click="brandSettings.themeMode = 'dark'"
                  >
                    {{ t('Dark') }}
                    <Check v-if="brandSettings.themeMode === 'dark'" :size="14" class="ml-2" />
                  </Button>
                  <Button
                    type="button"
                    :variant="brandSettings.themeMode === 'system' ? 'default' : 'outline'"
                    class="h-10 justify-start"
                    @click="brandSettings.themeMode = 'system'"
                  >
                    {{ t('System') }}
                    <Check v-if="brandSettings.themeMode === 'system'" :size="14" class="ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Preview Column -->
      <div class="lg:col-span-1">
        <div class="sticky top-20 space-y-6">
          <div class="border rounded-md p-4">
            <div class="flex items-center gap-2 mb-4">
              <Palette :size="16" />
              <h3 class="font-medium">{{ t('Live Preview') }}</h3>
            </div>

            <div class="space-y-4">
              <div class="p-4 rounded-lg border" :style="{ backgroundColor: brandSettings.themeColor === 'custom' ? brandSettings.customColor + '20' : themeColors[brandSettings.themeColor] + '20' }">
                <div class="text-sm font-medium" :style="{ color: brandSettings.themeColor === 'custom' ? brandSettings.customColor : themeColors[brandSettings.themeColor] }">
                  {{ brandSettings.titleText }}
                </div>
              </div>

              <div class="pt-4 border-t">
                <div class="text-xs mb-2 text-muted-foreground">{{ t('Title:') }} <span class="font-medium text-foreground">{{ brandSettings.titleText }}</span></div>
                <div class="text-xs text-muted-foreground">{{ t('Footer:') }} <span class="font-medium text-foreground">{{ brandSettings.footerText }}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-end pt-6">
      <Button type="button" @click="saveSettings" :disabled="saving">
        <Loader2 v-if="saving" :size="14" class="mr-1 animate-spin" />
        {{ saving ? t('Saving...') : t('Save Changes') }}
      </Button>
    </div>
  </SettingsSection>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { router, usePage } from '@inertiajs/vue3';
import { useI18n } from 'vue-i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Palette, Upload, Check, Layout, Moon, FileText, Sidebar as SidebarIcon } from 'lucide-vue-next';
import SettingsSection from '@/components/SettingsSection.vue';

const { t } = useI18n();
const page = usePage();
const saving = ref(false);
const activeSection = ref<'logos' | 'text' | 'theme'>('logos');

const globalSettings = (page.props.globalSettings as Record<string, any> || {});

const defaultSettings = {
  logoDark: '/images/logos/logo-dark.png',
  logoLight: '/images/logos/logo-light.png',
  favicon: '/images/logos/favicon.ico',
  titleText: 'WorkDo',
  footerText: '© 2025 WorkDo. All rights reserved.',
  themeColor: 'green',
  customColor: '#10b981',
  sidebarVariant: 'inset',
  sidebarStyle: 'plain',
  layoutDirection: 'left',
  themeMode: 'light'
};

const brandSettings = reactive({
  logoDark: globalSettings.logoDark || defaultSettings.logoDark,
  logoLight: globalSettings.logoLight || defaultSettings.logoLight,
  favicon: globalSettings.favicon || defaultSettings.favicon,
  titleText: globalSettings.titleText || defaultSettings.titleText,
  footerText: globalSettings.footerText || defaultSettings.footerText,
  themeColor: globalSettings.themeColor || defaultSettings.themeColor,
  customColor: globalSettings.customColor || defaultSettings.customColor,
  sidebarVariant: globalSettings.sidebarVariant || defaultSettings.sidebarVariant,
  sidebarStyle: globalSettings.sidebarStyle || defaultSettings.sidebarStyle,
  layoutDirection: globalSettings.layoutDirection || defaultSettings.layoutDirection,
  themeMode: globalSettings.themeMode || defaultSettings.themeMode
});

const logoErrors = reactive({
  logoDark: false,
  logoLight: false,
  favicon: false
});

const themeColors = {
  blue: '#3b82f6',
  green: '#10b981',
  purple: '#8b5cf6',
  orange: '#f97316',
  red: '#ef4444'
};

const sidebarStyles = [
  { id: 'plain', name: 'Plain' },
  { id: 'colored', name: 'Colored' },
  { id: 'gradient', name: 'Gradient' }
];

const getDisplayUrl = (path: string): string => {
  if (!path) return path;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/storage/')) {
    return `${(window as any).appSettings?.baseUrl || ''}${path}`;
  }
  return path.startsWith('/') ? `${(window as any).appSettings?.baseUrl || ''}${path}` : path;
};

const saveSettings = () => {
  saving.value = true;
  router.post(route('settings.brand.update'), { settings: brandSettings }, {
    onFinish: () => {
      saving.value = false;
    }
  });
};
</script>
