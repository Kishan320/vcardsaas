<template>
  <PageTemplate title="Manage Languages" url="/manage-language">
    <div class="space-y-6">
      <!-- Language Selection -->
      <Card>
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">Select Language</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div
              v-for="lang in filteredLanguages"
              :key="lang.code"
              :class="[
                'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                selectedLang === lang.code ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              ]"
              @click="selectLanguage(lang.code)"
            >
              <ReactCountryFlag
                :country-code="lang.countryCode || lang.code.toUpperCase().slice(0, 2)"
                class="w-6 h-4"
              />
              <div>
                <div class="font-medium">{{ lang.name }}</div>
                <div class="text-sm text-gray-500">{{ lang.code }}</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <!-- Search -->
      <div class="flex gap-4">
        <Input
          v-model="search"
          placeholder="Search translations..."
          class="max-w-sm"
        />
        <Button @click="loadTranslations" :disabled="loading">
          {{ loading ? 'Loading...' : 'Load Translations' }}
        </Button>
      </div>

      <!-- Translation Editor -->
      <Card>
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">
              Translations for {{ selectedLangName }}
            </h3>
            <Button @click="saveTranslations" :disabled="saving">
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </Button>
          </div>

          <ScrollArea class="h-[600px]">
            <div class="space-y-4">
              <div
                v-for="(value, key) in filteredLabels"
                :key="key"
                class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg"
              >
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Key
                  </label>
                  <div class="p-2 bg-gray-50 rounded border text-sm">
                    {{ key }}
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Translation
                  </label>
                  <Input
                    v-model="labels[key]"
                    :placeholder="getDefaultValue(key)"
                    class="w-full"
                  />
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </Card>
    </div>
  </PageTemplate>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { usePage, router } from '@inertiajs/vue3';
import PageTemplate from '@/components/page-template.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/custom-toast';
import ReactCountryFlag from 'react-country-flag';
import { cn } from '@/lib/utils';
import axios from '@/utils/axios-config';

interface Language {
  code: string;
  name: string;
  countryCode?: string;
}

interface PageProps {
  languages: Language[];
  defaultLang: string;
  defaultData: Record<string, string>;
  [key: string]: any;
}

const { languages, defaultLang, defaultData } = usePage<PageProps>().props;

// State
const selectedLang = ref(defaultLang);
const labels = ref<{ [key: string]: string }>(defaultData);
const loading = ref(false);
const saving = ref(false);
const search = ref('');

// Computed
const selectedLangName = computed(() => {
  const lang = languages.find(l => l.code === selectedLang.value);
  return lang?.name || selectedLang.value;
});

const filteredLanguages = computed(() => {
  if (!search.value) return languages;
  
  return languages.filter(lang => 
    lang.name.toLowerCase().includes(search.value.toLowerCase()) ||
    lang.code.toLowerCase().includes(search.value.toLowerCase())
  );
});

const filteredLabels = computed(() => {
  if (!search.value) return labels.value;
  
  return Object.fromEntries(
    Object.entries(labels.value).filter(([key]) =>
      key.toLowerCase().includes(search.value.toLowerCase())
    )
  );
});

// Methods
const selectLanguage = async (langCode: string) => {
  selectedLang.value = langCode;
  await loadTranslations();
};

const loadTranslations = async () => {
  loading.value = true;
  
  try {
    // If defaultData is already available for the current language, use it
    if (selectedLang.value === defaultLang && Object.keys(defaultData).length > 0) {
      labels.value = defaultData;
      return;
    }
    
    const response = await axios.get(`/api/translations/${selectedLang.value}`);
    labels.value = response.data;
  } catch (error) {
    console.error('Failed to load translations:', error);
    toast.error('Failed to load translations');
  } finally {
    loading.value = false;
  }
};

const saveTranslations = async () => {
  saving.value = true;
  
  try {
    await axios.post(`/api/translations/${selectedLang.value}`, {
      translations: labels.value
    });
    
    toast.success('Translations saved successfully');
  } catch (error) {
    console.error('Failed to save translations:', error);
    toast.error('Failed to save translations');
  } finally {
    saving.value = false;
  }
};

const getDefaultValue = (key: string) => {
  return defaultData[key] || '';
};

// Watch for language changes
watch(() => selectedLang.value, () => {
  loadTranslations();
});

onMounted(() => {
  loadTranslations();
});
</script>

<style scoped>
.manage-language {
  /* Component styles are handled by Tailwind classes */
}
</style>
