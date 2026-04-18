<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 h-screen">
    <!-- Left Side - Configuration -->
    <div class="space-y-6 overflow-y-auto">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ mode === 'create' ? `Create ${template.name} vCard` : `Edit ${business?.name}` }}
          </h1>
          <div class="flex items-center space-x-2 mt-2">
            <Badge variant="secondary">{{ template.name }}</Badge>
            <Badge v-if="business?.category" variant="outline">{{ business.category.name }}</Badge>
          </div>
        </div>
      </div>

      <form @submit="onSubmit" class="space-y-6">
        <!-- Basic Information -->
        <Card>
          <CardHeader>
            <CardTitle>{{ t("Basic Information") }}</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div v-if="mode === 'create'" class="space-y-2">
              <Label>{{ t("Business Type") }}</Label>
              <select
                v-model="businessType"
                @change="handleBusinessTypeChange"
                class="w-full p-2 border rounded"
              >
                <option value="freelancer">Freelancer</option>
                <option value="restaurant">Restaurant</option>
                <option value="doctor">Doctor/Medical</option>
                <option value="real-estate">Real Estate</option>
                <option value="fitness-trainer">Fitness Trainer</option>
                <option value="social-influencer">Social Influencer</option>
              </select>
            </div>
            
            <div class="space-y-2">
              <Label for="name">{{ t("Business Name") }} *</Label>
              <Input
                id="name"
                v-model="data.name"
                required
              />
              <p v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</p>
            </div>
          </CardContent>
        </Card>

        <!-- Domain Configuration -->
        <DomainConfig
          :data="data"
          :setData="setData"
          :errors="errors"
        />

        <!-- Section Manager -->
        <VCardSectionManager
          :sections="getBusinessTemplate(businessType)?.sections || []"
          :template-config="data.template_config || {}"
          :on-update-section="updateTemplateConfig"
          :on-toggle-section="handleToggleSection"
          :on-reorder-sections="handleReorderSections"
          :plan-features="planFeatures"
          :is-super-admin="isSuperAdmin"
        />

        <!-- Color & Font Settings -->
        <Card>
          <CardHeader>
            <CardTitle>{{ t("Appearance") }}</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <Label>{{ t("Font") }}</Label>
              <select
                :value="configSections.font || template.defaultFont"
                @change="updateFont($event.target.value)"
                class="w-full p-2 border rounded"
              >
                <option value="Inter, sans-serif">Inter</option>
                <option value="Roboto, sans-serif">Roboto</option>
                <option value="Open Sans, sans-serif">Open Sans</option>
                <option value="Montserrat, sans-serif">Montserrat</option>
                <option value="Poppins, sans-serif">Poppins</option>
              </select>
            </div>

            <div class="space-y-2">
              <Label>{{ t("Primary Color") }}</Label>
              <Input
                type="color"
                :value="configSections.colors?.primary || template.defaultColors?.primary"
                @input="updateColors({ ...configSections.colors, primary: $event.target.value })"
              />
            </div>

            <div class="space-y-2">
              <Label>{{ t("Secondary Color") }}</Label>
              <Input
                type="color"
                :value="configSections.colors?.secondary || template.defaultColors?.secondary"
                @input="updateColors({ ...configSections.colors, secondary: $event.target.value })"
              />
            </div>
          </CardContent>
        </Card>

        <!-- Submit Button -->
        <div class="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            @click="$inertia.visit(route('vcard-builder.index'))"
          >
            {{ t("Cancel") }}
          </Button>
          <Button
            type="submit"
            :disabled="processing"
          >
            {{ processing ? t("Saving...") : (mode === 'create' ? t("Create vCard") : t("Update vCard")) }}
          </Button>
        </div>
      </form>
    </div>

    <!-- Right Side - Preview -->
    <div class="space-y-6 overflow-y-auto">
      <div class="sticky top-0">
        <h2 class="text-lg font-semibold mb-4">{{ t("Live Preview") }}</h2>
        
        <div class="border rounded-lg overflow-hidden bg-gray-100">
          <VCardPreview
            :business-type="businessType"
            :data="data"
            :template="template"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import VCardPreview from '@/pages/vcard-builder/components/VCardPreview.vue';
import VCardSectionManager from '@/components/VCardSectionManager.vue';
import DomainConfig from '@/components/DomainConfig.vue';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';

interface VCardBuilderProps {
  mode: 'create' | 'edit';
  businessType: string;
  template: any;
  businessCategories: any[];
  data: any;
  setData: (key: string, value: any) => void;
  onSubmit: (e: Event) => void;
  processing: boolean;
  errors: any;
  business?: any;
  planFeatures?: { business_template_sections?: string[] };
  isSuperAdmin?: boolean;
}

const props = defineProps<VCardBuilderProps>();
const { t } = useI18n();

const configSections = computed(() => props.data.config_sections || {});

const updateTemplateConfig = (section: string, field: string, value: any) => {
  props.setData('config_sections', {
    ...props.data.config_sections,
    [section]: {
      ...props.data.config_sections[section],
      [field]: value
    }
  });
};

const updateColors = (colors: any) => {
  props.setData('config_sections', {
    ...props.data.config_sections,
    colors: colors
  });
};

const updateFont = (font: string) => {
  props.setData('config_sections', {
    ...props.data.config_sections,
    font: font
  });
};

const handleToggleSection = (sectionKey: string, enabled: boolean) => {
  props.setData('config_sections', {
    ...props.data.config_sections,
    [sectionKey]: {
      ...props.data.config_sections[sectionKey],
      enabled
    }
  });
};

const handleReorderSections = (sections: any[]) => {
  const sectionSettings = {};
  sections.forEach((section) => {
    sectionSettings[section.key] = {
      ...props.data.template_config.sectionSettings?.[section.key],
      enabled: section.enabled,
      order: section.order
    };
  });
  
  props.setData('template_config', {
    ...props.data.template_config,
    sectionSettings
  });
};

const handleBusinessTypeChange = (event: Event) => {
  const newType = (event.target as HTMLSelectElement).value;
  const defaultData = {
    freelancer: { 
      header: { name: 'John Doe', title: 'Professional Freelancer' }, 
      contact: { phone: '+1 (555) 123-4567', email: 'john@example.com' }, 
      about: { description: 'Experienced freelancer' }, 
      services: { enabled: true } 
    },
    restaurant: { 
      header: { name: 'Delicious Bistro', title: 'Fine Dining Restaurant' }, 
      contact: { phone: '+1 (555) 123-4567', email: 'info@bistro.com' }, 
      about: { description: 'Award-winning restaurant' }, 
      menu: { enabled: true } 
    },
    doctor: { 
      header: { name: 'Dr. Smith', title: 'Family Medicine' }, 
      contact: { phone: '+1 (555) 123-4567', email: 'dr.smith@clinic.com' }, 
      about: { description: 'Experienced family doctor' }, 
      appointments: { enabled: true } 
    }
  };
  
  props.setData('config_sections', { 
    ...props.data.config_sections, 
    ...defaultData[newType as keyof typeof defaultData] 
  });
};
</script>

<style scoped>
.vcard-builder {
  max-width: 100%;
}
</style>
