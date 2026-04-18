<template>
    <AppLayout>
        <Head title="Landing Page Settings" />
        <FlashMessage />

        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Landing Page Settings</h1>
                    <p class="text-sm text-gray-500 mt-0.5">Customize your public landing page</p>
                </div>
                <div class="flex items-center gap-2">
                    <a :href="route('home')" target="_blank"
                        class="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all">
                        <Eye :size="16" /> View Page
                    </a>
                    <button @click="saveSettings" :disabled="saving"
                        class="inline-flex items-center gap-2 px-4 py-2 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50">
                        <Loader2 v-if="saving" :size="16" class="animate-spin" />
                        <Save v-else :size="16" />
                        {{ saving ? 'Saving…' : 'Save Changes' }}
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <!-- Sidebar Navigation -->
                <div class="lg:col-span-1">
                    <nav class="bg-white border border-gray-100 rounded-2xl shadow-card p-2 space-y-0.5">
                        <div v-for="tab in tabs" :key="tab.id">
                            <p class="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-3 pt-3 pb-1">{{ tab.group }}</p>
                            <button v-for="item in tab.items" :key="item.id" @click="activeSection = item.id"
                                class="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
                                :class="activeSection === item.id ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'">
                                <component :is="item.icon" :size="15" :class="activeSection === item.id ? 'text-primary-600' : 'text-gray-400'" />
                                {{ item.label }}
                            </button>
                        </div>
                    </nav>
                </div>

                <!-- Content -->
                <div class="lg:col-span-3 space-y-4">
                    <!-- General -->
                    <div v-if="activeSection === 'general'" class="bg-white border border-gray-100 rounded-2xl shadow-card p-6 space-y-4">
                        <h3 class="font-semibold text-gray-900">Company Information</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <InputLabel value="Company Name" />
                                <TextInput v-model="form.company_name" type="text" class="mt-1.5" placeholder="Your Company" />
                            </div>
                            <div>
                                <InputLabel value="Contact Email" />
                                <TextInput v-model="form.contact_email" type="email" class="mt-1.5" placeholder="support@company.com" />
                            </div>
                            <div>
                                <InputLabel value="Contact Phone" />
                                <TextInput v-model="form.contact_phone" type="tel" class="mt-1.5" placeholder="+1 555 123 4567" />
                            </div>
                            <div>
                                <InputLabel value="Address" />
                                <TextInput v-model="form.contact_address" type="text" class="mt-1.5" placeholder="123 Business Ave" />
                            </div>
                        </div>
                        <div>
                            <h4 class="text-sm font-semibold text-gray-700 mb-3">Theme Colors</h4>
                            <div class="grid grid-cols-3 gap-4">
                                <div v-for="color in colorFields" :key="color.key">
                                    <InputLabel :value="color.label" />
                                    <div class="flex items-center gap-2 mt-1.5">
                                        <input type="color" v-model="form.config_sections.theme[color.key]" class="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
                                        <TextInput v-model="form.config_sections.theme[color.key]" type="text" class="flex-1 text-xs" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Hero -->
                    <div v-if="activeSection === 'hero'" class="bg-white border border-gray-100 rounded-2xl shadow-card p-6 space-y-4">
                        <div class="flex items-center justify-between">
                            <h3 class="font-semibold text-gray-900">Hero Section</h3>
                            <div class="flex items-center gap-2">
                                <span class="text-sm text-gray-500">Enable</span>
                                <input type="checkbox" v-model="form.config_sections.section_visibility.hero" class="rounded border-gray-300 text-primary-600" />
                            </div>
                        </div>
                        <div class="grid grid-cols-1 gap-4">
                            <div>
                                <InputLabel value="Hero Title" />
                                <TextInput v-model="heroSection.title" type="text" class="mt-1.5" placeholder="Your main headline" />
                            </div>
                            <div>
                                <InputLabel value="Hero Subtitle" />
                                <textarea v-model="heroSection.subtitle" rows="3"
                                    class="mt-1.5 w-full rounded-xl border border-[hsl(var(--border))] bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 resize-none"
                                    placeholder="Supporting text..." />
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel value="Primary Button Text" />
                                    <TextInput v-model="heroSection.primary_button_text" type="text" class="mt-1.5" placeholder="Get Started" />
                                </div>
                                <div>
                                    <InputLabel value="Secondary Button Text" />
                                    <TextInput v-model="heroSection.secondary_button_text" type="text" class="mt-1.5" placeholder="Sign In" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Features -->
                    <div v-if="activeSection === 'features'" class="bg-white border border-gray-100 rounded-2xl shadow-card p-6 space-y-4">
                        <div class="flex items-center justify-between">
                            <h3 class="font-semibold text-gray-900">Features Section</h3>
                            <div class="flex items-center gap-2">
                                <span class="text-sm text-gray-500">Enable</span>
                                <input type="checkbox" v-model="form.config_sections.section_visibility.features" class="rounded border-gray-300 text-primary-600" />
                            </div>
                        </div>
                        <div class="grid grid-cols-1 gap-4">
                            <div>
                                <InputLabel value="Section Title" />
                                <TextInput v-model="featuresSection.title" type="text" class="mt-1.5" placeholder="Everything you need" />
                            </div>
                            <div>
                                <InputLabel value="Section Subtitle" />
                                <textarea v-model="featuresSection.subtitle" rows="2"
                                    class="mt-1.5 w-full rounded-xl border border-[hsl(var(--border))] bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 resize-none" />
                            </div>
                        </div>
                        <!-- Feature Items -->
                        <div class="space-y-3">
                            <div v-for="(feature, i) in featuresSection.features ?? []" :key="i" class="p-4 border border-gray-100 rounded-xl space-y-3">
                                <div class="flex items-center justify-between">
                                    <span class="text-sm font-medium text-gray-700">Feature {{ i + 1 }}</span>
                                    <button @click="removeFeature(i)" class="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 :size="14" />
                                    </button>
                                </div>
                                <div class="grid grid-cols-2 gap-3">
                                    <TextInput v-model="feature.title" type="text" placeholder="Feature title" />
                                    <TextInput v-model="feature.icon" type="text" placeholder="Icon name" />
                                </div>
                                <textarea v-model="feature.description" rows="2"
                                    class="w-full rounded-xl border border-[hsl(var(--border))] bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 resize-none"
                                    placeholder="Feature description..." />
                            </div>
                            <button @click="addFeature" class="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium border-2 border-dashed border-primary-200 text-primary-600 rounded-xl hover:bg-primary-50 transition-colors">
                                <Plus :size="16" /> Add Feature
                            </button>
                        </div>
                    </div>

                    <!-- SEO -->
                    <div v-if="activeSection === 'seo'" class="bg-white border border-gray-100 rounded-2xl shadow-card p-6 space-y-4">
                        <h3 class="font-semibold text-gray-900">SEO Settings</h3>
                        <div class="space-y-4">
                            <div>
                                <InputLabel value="Meta Title" />
                                <TextInput v-model="form.config_sections.seo.meta_title" type="text" class="mt-1.5" placeholder="Landing Page Title" />
                            </div>
                            <div>
                                <InputLabel value="Meta Description" />
                                <textarea v-model="form.config_sections.seo.meta_description" rows="3"
                                    class="mt-1.5 w-full rounded-xl border border-[hsl(var(--border))] bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 resize-none"
                                    placeholder="Page description for search engines..." />
                            </div>
                        </div>
                    </div>

                    <!-- Contact -->
                    <div v-if="activeSection === 'contact'" class="bg-white border border-gray-100 rounded-2xl shadow-card p-6 space-y-4">
                        <div class="flex items-center justify-between">
                            <h3 class="font-semibold text-gray-900">Contact Section</h3>
                            <div class="flex items-center gap-2">
                                <span class="text-sm text-gray-500">Enable</span>
                                <input type="checkbox" v-model="form.config_sections.section_visibility.contact" class="rounded border-gray-300 text-primary-600" />
                            </div>
                        </div>
                        <div class="grid grid-cols-1 gap-4">
                            <div>
                                <InputLabel value="Section Title" />
                                <TextInput v-model="contactSection.title" type="text" class="mt-1.5" placeholder="Get in Touch" />
                            </div>
                            <div>
                                <InputLabel value="Section Subtitle" />
                                <textarea v-model="contactSection.subtitle" rows="2"
                                    class="mt-1.5 w-full rounded-xl border border-[hsl(var(--border))] bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 resize-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Head, router, usePage } from '@inertiajs/vue3';
import { Eye, Save, Loader2, Plus, Trash2, Settings, Globe, Layout, Star, Mail, HelpCircle, FileText, Search } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import TextInput from '@/components/ui/TextInput.vue';

const props = defineProps<{ settings?: any }>();

const saving = ref(false);
const activeSection = ref('general');

const form = ref({
    company_name: props.settings?.company_name ?? '',
    contact_email: props.settings?.contact_email ?? '',
    contact_phone: props.settings?.contact_phone ?? '',
    contact_address: props.settings?.contact_address ?? '',
    config_sections: {
        theme: {
            primary_color: props.settings?.config_sections?.theme?.primary_color ?? '#7C3AED',
            secondary_color: props.settings?.config_sections?.theme?.secondary_color ?? '#9F67FF',
            accent_color: props.settings?.config_sections?.theme?.accent_color ?? '#10b981',
        },
        seo: {
            meta_title: props.settings?.config_sections?.seo?.meta_title ?? '',
            meta_description: props.settings?.config_sections?.seo?.meta_description ?? '',
        },
        section_visibility: {
            hero: props.settings?.config_sections?.section_visibility?.hero ?? true,
            features: props.settings?.config_sections?.section_visibility?.features ?? true,
            contact: props.settings?.config_sections?.section_visibility?.contact ?? true,
        },
        sections: props.settings?.config_sections?.sections ?? [],
    },
});

const getSectionData = (key: string) => form.value.config_sections.sections.find((s: any) => s.key === key) ?? { key };

const updateSectionData = (key: string, updates: any) => {
    const sections = [...form.value.config_sections.sections];
    const idx = sections.findIndex((s: any) => s.key === key);
    if (idx >= 0) {
        sections[idx] = { ...sections[idx], ...updates };
    } else {
        sections.push({ key, ...updates });
    }
    form.value.config_sections.sections = sections;
};

const heroSection = computed({
    get: () => getSectionData('hero'),
    set: (v) => updateSectionData('hero', v),
});

const featuresSection = computed({
    get: () => getSectionData('features'),
    set: (v) => updateSectionData('features', v),
});

const contactSection = computed({
    get: () => getSectionData('contact'),
    set: (v) => updateSectionData('contact', v),
});

const addFeature = () => {
    const current = getSectionData('features');
    updateSectionData('features', { features: [...(current.features ?? []), { title: '', description: '', icon: '' }] });
};

const removeFeature = (i: number) => {
    const current = getSectionData('features');
    updateSectionData('features', { features: (current.features ?? []).filter((_: any, idx: number) => idx !== i) });
};

const colorFields = [
    { key: 'primary_color', label: 'Primary Color' },
    { key: 'secondary_color', label: 'Secondary Color' },
    { key: 'accent_color', label: 'Accent Color' },
];

const tabs = [
    {
        group: 'Setup',
        items: [
            { id: 'general', label: 'General', icon: Settings },
            { id: 'seo', label: 'SEO', icon: Search },
        ],
    },
    {
        group: 'Sections',
        items: [
            { id: 'hero', label: 'Hero', icon: Layout },
            { id: 'features', label: 'Features', icon: Star },
            { id: 'contact', label: 'Contact', icon: Mail },
        ],
    },
];

const saveSettings = () => {
    saving.value = true;
    router.post(route('landing-page.settings.update'), form.value, {
        preserveScroll: true,
        onFinish: () => { saving.value = false; },
    });
};
</script>
