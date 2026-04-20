<template>
    <AppLayout>
        <Head title="Landing Page Settings" />
        <FlashMessage />

        <!-- Top Bar -->
        <div class="flex items-center justify-between mb-8">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Landing Page Settings</h1>
                <p class="text-sm text-gray-500 mt-1">Customize your landing page content and appearance</p>
            </div>
            <div class="flex items-center gap-3">
                <a :href="route('home')" target="_blank"
                    class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all">
                    <ExternalLink :size="15" /> Preview
                </a>
                <PrimaryButton @click="saveSettings" :disabled="saving" class="h-10 text-sm px-6 bg-emerald-500 hover:bg-emerald-600 border-none shadow-sm">
                    <Loader2 v-if="saving" :size="16" class="animate-spin mr-2" />
                    <Save v-else :size="16" class="mr-2" />
                    Save Changes
                </PrimaryButton>
            </div>
        </div>

        <div class="flex gap-6 items-start">
            <!-- Left Sidebar -->
            <aside class="w-64 shrink-0">
                <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div class="p-4 border-b border-gray-50">
                        <h3 class="text-xs font-bold uppercase tracking-wider text-emerald-600">Navigation</h3>
                    </div>
                    <div class="p-2 space-y-6">
                        <div v-for="group in tabs" :key="group.group">
                            <button @click="toggleGroup(group.group)" class="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-gray-900">
                                {{ group.group }}
                                <ChevronDown :size="14" :class="{ 'rotate-180': expandedGroups[group.group] }" class="transition-transform" />
                            </button>
                            <div v-if="expandedGroups[group.group]" class="mt-1 space-y-0.5">
                                <button v-for="item in group.items" :key="item.id"
                                    @click="activeSection = item.id"
                                    class="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all rounded-xl"
                                    :class="activeSection === item.id
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'">
                                    <component :is="item.icon" :size="16" :class="activeSection === item.id ? 'text-emerald-600' : 'text-gray-400'" />
                                    {{ item.label }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            <!-- Main Content -->
            <div class="flex-1 min-w-0 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <!-- Header -->
                <div class="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <component :is="activeIcon" :size="24" />
                        </div>
                        <div>
                            <h2 class="text-xl font-bold text-gray-900">{{ currentTabLabel }}</h2>
                            <p class="text-sm text-gray-500 mt-0.5">{{ currentTabDescription }}</p>
                        </div>
                    </div>
                    
                    <div v-if="isContentSection" class="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                        <span class="text-sm font-semibold text-gray-700">Section Visibility</span>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" v-model="form.config_sections.section_visibility[activeSection]" class="sr-only peer">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                    </div>
                </div>

                <div class="p-8">
                    <!-- General Tab (Company Info + Branding) -->
                    <div v-if="activeSection === 'general'" class="space-y-10">
                        <!-- Company Info -->
                        <div class="space-y-6">
                            <div class="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                                <Settings :size="18" /> Company Information
                            </div>
                            <div class="grid grid-cols-2 gap-6">
                                <div class="space-y-2">
                                    <InputLabel value="Company Name" />
                                    <TextInput v-model="form.company_name" class="w-full" placeholder="e.g. vCard" />
                                </div>
                                <div class="space-y-2">
                                    <InputLabel value="Contact Email" />
                                    <TextInput v-model="form.contact_email" type="email" class="w-full" placeholder="support@company.com" />
                                </div>
                                <div class="space-y-2">
                                    <InputLabel value="Contact Phone" />
                                    <TextInput v-model="form.contact_phone" type="tel" class="w-full" placeholder="+1 (555) 000-0000" />
                                </div>
                                <div class="space-y-2">
                                    <InputLabel value="Contact Address" />
                                    <TextInput v-model="form.contact_address" class="w-full" placeholder="San Francisco, CA" />
                                </div>
                            </div>
                        </div>

                        <!-- Branding & Theme -->
                        <div class="bg-emerald-50/30 rounded-2xl p-8 border border-emerald-100/50 space-y-8">
                            <div class="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                                <Palette :size="18" /> Branding & Theme
                            </div>
                            
                            <div class="grid grid-cols-2 gap-8">
                                <div class="space-y-4">
                                    <h4 class="text-sm font-bold text-gray-700">Company Logo</h4>
                                    <div class="space-y-6">
                                        <div class="space-y-2">
                                            <InputLabel value="Logo (Light Theme)" />
                                            <MediaPicker :value="form.config_sections.theme.logo_light" :onChange="(val) => form.config_sections.theme.logo_light = val" placeholder="Select logo for light backgrounds..." />
                                            <p class="text-[10px] text-gray-400">Logo displayed on light backgrounds</p>
                                        </div>
                                        <div class="space-y-2">
                                            <InputLabel value="Logo (Dark Theme)" />
                                            <MediaPicker :value="form.config_sections.theme.logo_dark" :onChange="(val) => form.config_sections.theme.logo_dark = val" placeholder="Select logo for dark backgrounds..." />
                                            <p class="text-[10px] text-gray-400">Logo displayed on dark backgrounds</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="space-y-4">
                                    <h4 class="text-sm font-bold text-gray-700">Theme Colors</h4>
                                    <div class="space-y-5">
                                        <div v-for="c in colorFields" :key="c.key" class="space-y-2">
                                            <InputLabel :value="c.label" />
                                            <div class="flex items-center gap-3">
                                                <div class="relative w-12 h-10 overflow-hidden rounded-xl border border-gray-200">
                                                    <input type="color" v-model="form.config_sections.theme[c.key]" class="absolute -inset-2 w-[150%] h-[150%] cursor-pointer border-none p-0" />
                                                </div>
                                                <TextInput v-model="form.config_sections.theme[c.key]" class="flex-1 font-mono text-sm bg-white" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Section Order Tab -->
                    <div v-else-if="activeSection === 'section_order'" class="space-y-6">
                        <div class="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                            <Info :size="20" class="text-blue-500 shrink-0" />
                            <p class="text-sm text-blue-700">Drag and drop the items below to change the layout sequence of your landing page.</p>
                        </div>

                        <div class="space-y-2">
                            <div v-for="(key, index) in form.config_sections.section_order" :key="key"
                                draggable="true"
                                @dragstart="handleDragStart(index)"
                                @dragover.prevent="handleDragOver(index)"
                                @dragend="handleDragEnd"
                                class="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm cursor-move hover:border-emerald-200 hover:bg-emerald-50/10 transition-all transition-transform duration-200"
                                :class="{ 'opacity-50 scale-95': dragIndex === index, 'border-emerald-500 ring-1 ring-emerald-500': dragOverIndex === index }">
                                <GripVertical class="text-gray-300" :size="18" />
                                <div class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 text-xs font-bold">
                                    {{ index + 1 }}
                                </div>
                                <span class="flex-1 font-semibold text-gray-700 capitalize">{{ key.replace(/_/g, ' ') }}</span>
                                <div class="flex items-center gap-2">
                                    <span :class="form.config_sections.section_visibility[key] ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'" class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                                        {{ form.config_sections.section_visibility[key] ? 'Visible' : 'Hidden' }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Advanced Tab -->
                    <div v-else-if="activeSection === 'advanced'" class="space-y-10">
                        <!-- SEO Settings -->
                        <div class="space-y-6">
                            <div class="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                                <Search :size="18" /> SEO Meta Settings
                            </div>
                            <div class="grid grid-cols-1 gap-6 max-w-2xl">
                                <div class="space-y-2">
                                    <InputLabel value="Meta Title" />
                                    <TextInput v-model="form.config_sections.seo.meta_title" class="w-full" />
                                </div>
                                <div class="space-y-2">
                                    <InputLabel value="Meta Description" />
                                    <textarea v-model="form.config_sections.seo.meta_description" rows="3" class="w-full border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl shadow-sm text-sm" placeholder="Page description..."></textarea>
                                </div>
                                <div class="space-y-2">
                                    <InputLabel value="Meta Keywords" />
                                    <TextInput v-model="form.config_sections.seo.meta_keywords" class="w-full" placeholder="keyword1, keyword2" />
                                </div>
                            </div>
                        </div>

                        <!-- Custom Code -->
                        <div class="space-y-6 border-t border-gray-100 pt-10">
                            <div class="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                                <Code :size="18" /> Custom Integrations
                            </div>
                            <div class="grid grid-cols-1 gap-6">
                                <div class="space-y-2">
                                    <InputLabel value="Custom Header CSS" />
                                    <textarea v-model="form.config_sections.custom_css" rows="6" class="w-full font-mono text-xs border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl bg-gray-50 p-4" placeholder="/* CSS styles */"></textarea>
                                </div>
                                <div class="space-y-2">
                                    <InputLabel value="Custom Header JS (Analytics, scripts, etc.)" />
                                    <textarea v-model="form.config_sections.custom_js" rows="6" class="w-full font-mono text-xs border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl bg-gray-50 p-4" placeholder="// Javascript code"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Layout & Content Sections (Dynamic Rendering) -->
                    <div v-else>
                        <div v-if="sectionData" class="space-y-8">
                            <!-- Section Title & Subtitle -->
                            <div class="grid grid-cols-2 gap-6">
                                <template v-for="(val, key) in staticFields(sectionData)" :key="key">
                                    <div :class="{ 'col-span-2' : isFullWidthField(key) }" class="space-y-2">
                                        <InputLabel :value="formatLabel(key)" />
                                        
                                        <!-- Colors -->
                                        <div v-if="key.includes('color')" class="flex items-center gap-3">
                                            <div class="relative w-10 h-10 overflow-hidden rounded-xl border border-gray-200">
                                                <input type="color" v-model="sectionData[key]" class="absolute -inset-2 w-[150%] h-[150%] cursor-pointer border-none p-0" />
                                            </div>
                                            <TextInput v-model="sectionData[key]" class="flex-1 font-mono text-sm" />
                                        </div>
                                        
                                        <!-- Booleans / Toggles -->
                                        <div v-else-if="typeof val === 'boolean'" class="mt-1">
                                            <label class="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" v-model="sectionData[key]" class="sr-only peer">
                                                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                            </label>
                                        </div>

                                        <!-- Selects / Layouts -->
                                        <select v-else-if="key === 'layout'" v-model="sectionData[key]" class="w-full border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl shadow-sm text-sm">
                                            <option value="image-right">Image Right</option>
                                            <option value="image-left">Image Left</option>
                                            <option value="centered">Centered</option>
                                            <option value="grid">Grid</option>
                                            <option value="split">Split</option>
                                        </select>
                                        
                                        <!-- Images / Browse -->
                                        <MediaPicker v-else-if="key === 'image' || key.includes('src') || key.includes('icon') && !isIconSelect(key)" :value="sectionData[key]" :onChange="(v) => sectionData[key] = v" />

                                        <textarea v-else-if="isTextarea(key)" v-model="sectionData[key]" rows="3" class="w-full border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl shadow-sm text-sm"></textarea>
                                        
                                        <TextInput v-else v-model="sectionData[key]" class="w-full text-sm" />
                                    </div>
                                </template>
                            </div>

                            <!-- List Arrays -->
                            <div v-for="listKey in arrayFields(sectionData)" :key="listKey" class="mt-12 border-t border-gray-100 pt-10">
                                <div class="flex items-center justify-between mb-6">
                                    <h3 class="text-lg font-bold text-gray-800">{{ formatLabel(listKey) }} Management</h3>
                                    <button @click="addArrayItem(sectionData, listKey)" type="button" class="text-sm font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl transition-all border border-emerald-100 hover:shadow-sm">
                                        <Plus :size="16" /> Add New {{ formatLabel(listKey).slice(0, -1) }}
                                    </button>
                                </div>
                                
                                <div class="space-y-4">
                                    <div v-if="!sectionData[listKey] || sectionData[listKey].length === 0" class="text-sm text-gray-400 text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/30">
                                        No items have been added to this section yet.
                                    </div>
                                    <div v-for="(item, itemIdx) in sectionData[listKey]" :key="itemIdx" class="p-6 border border-gray-100 rounded-2xl bg-white shadow-sm relative group hover:border-emerald-200 transition-colors">
                                        <button @click="removeArrayItem(sectionData, listKey, itemIdx)" type="button" class="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-all bg-gray-50 p-2 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-red-50">
                                            <Trash2 :size="16" />
                                        </button>
                                        
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start pr-10">
                                            <div v-for="(propVal, propKey) in item" :key="propKey" :class="{ 'col-span-2': isTextarea(propKey) }" class="space-y-2">
                                                <InputLabel :value="formatLabel(propKey)" class="text-[10px] uppercase font-bold text-gray-400 tracking-wider" />
                                                <MediaPicker v-if="propKey === 'image' || propKey === 'icon' || propKey === 'src'" :value="item[propKey]" :onChange="(v) => item[propKey] = v" />
                                                <textarea v-else-if="isTextarea(propKey)" v-model="item[propKey]" rows="2" class="w-full border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl text-sm"></textarea>
                                                <TextInput v-else v-model="item[propKey]" class="w-full text-sm" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
import { Head, router } from '@inertiajs/vue3';
import { 
    ExternalLink, Save, Loader2, User, Palette, Search, Code, PanelTop, 
    Image as ImageIcon, List, Monitor, Star, Layout, Info, Users, MessageSquare, 
    Megaphone, CreditCard, HelpCircle, Mail, Phone, PanelBottom, Plus, Trash2,
    Settings, ArrowUpDown, GripVertical, ChevronDown, LayoutDashboard
} from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import MediaPicker from '@/components/MediaPicker.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';

const props = defineProps<{
    settings: any;
}>();

const saving = ref(false);
const activeSection = ref('general');
const expandedGroups = ref<Record<string, boolean>>({
    'Setup': true,
    'Layout': true,
    'Content': true
});

const toggleGroup = (group: string) => {
    expandedGroups.value[group] = !expandedGroups.value[group];
};

const dragIndex = ref<number | null>(null);
const dragOverIndex = ref<number | null>(null);

const form = ref({
    company_name: props.settings?.company_name || '',
    contact_email: props.settings?.contact_email || '',
    contact_phone: props.settings?.contact_phone || '',
    contact_address: props.settings?.contact_address || '',
    config_sections: props.settings?.config_sections || {
        sections: [],
        theme: {},
        seo: {},
        custom_css: '',
        custom_js: '',
        section_order: [],
        section_visibility: {}
    }
});

const tabs = [
    { group: 'Setup', items: [
        { id: 'general', label: 'General', icon: User },
        { id: 'section_order', label: 'Section Order', icon: ArrowUpDown },
        { id: 'advanced', label: 'Advanced', icon: Settings },
    ]},
    { group: 'Layout', items: [
        { id: 'header', label: 'Header', icon: PanelTop },
        { id: 'hero', label: 'Hero Section', icon: ImageIcon },
        { id: 'footer', label: 'Footer', icon: PanelBottom }
    ]},
    { group: 'Content', items: [
        { id: 'features', label: 'Features', icon: List },
        { id: 'screenshots', label: 'Screenshots', icon: Monitor },
        { id: 'why_choose_us', label: 'Why Choose Us', icon: Star },
        { id: 'templates', label: 'Templates', icon: Layout },
        { id: 'about', label: 'About', icon: Info },
        { id: 'team', label: 'Team', icon: Users },
        { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
        { id: 'active_campaigns', label: 'Active Campaigns', icon: Megaphone },
        { id: 'plans', label: 'Plans', icon: CreditCard },
        { id: 'faq', label: 'FAQ', icon: HelpCircle },
        { id: 'newsletter', label: 'Newsletter', icon: Mail },
        { id: 'contact', label: 'Contact', icon: Phone },
    ]}
];

const colorFields = [
    { key: 'primary_color', label: 'Primary Color' },
    { key: 'secondary_color', label: 'Secondary Color' },
    { key: 'accent_color', label: 'Accent Color' }
];

const currentTabLabel = computed(() => {
    for (const group of tabs) {
        const item = group.items.find(i => i.id === activeSection.value);
        if (item) return item.label;
    }
    return '';
});

const currentTabDescription = computed(() => {
    if (activeSection.value === 'general') return 'Basic company details and branding for your landing page';
    if (activeSection.value === 'section_order') return 'Manage the sequence of sections on your landing page';
    if (activeSection.value === 'advanced') return 'SEO settings and custom code integrations';
    return `Configure the ${currentTabLabel.value.toLowerCase()} section`;
});

const activeIcon = computed(() => {
    for (const group of tabs) {
        const item = group.items.find(i => i.id === activeSection.value);
        if (item) return item.icon;
    }
    return LayoutDashboard;
});

const isContentSection = computed(() => {
    return !['general', 'section_order', 'advanced'].includes(activeSection.value);
});

const sectionData = computed(() => {
    if (!isContentSection.value) return null;
    return form.value.config_sections.sections.find((s: any) => s.key === activeSection.value);
});

const staticFields = (section: any) => {
    const fields = { ...section };
    delete fields.key;
    Object.keys(fields).forEach(key => {
        if (Array.isArray(fields[key])) delete fields[key];
    });
    return fields;
};

const arrayFields = (section: any) => {
    return Object.keys(section).filter(key => Array.isArray(section[key]));
};

const isFullWidthField = (key: string) => {
    return [
        'title', 'subtitle', 'description', 'announcement_text', 'image', 'story_title', 
        'story_content', 'cta_description', 'trust_title', 'form_title', 'info_title', 
        'info_description'
    ].includes(key);
};

const isTextarea = (key: string) => {
    return ['description', 'subtitle', 'story_content', 'content', 'bio', 'answer', 'privacy_text', 'cta_description', 'info_description', 'meta_description'].includes(key);
};

const isIconSelect = (key: string) => {
    return ['icon'].includes(key);
};

const formatLabel = (key: string) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const handleDragStart = (idx: number) => { dragIndex.value = idx; };
const handleDragOver = (idx: number) => { dragOverIndex.value = idx; };
const handleDragEnd = () => {
    if (dragIndex.value !== null && dragOverIndex.value !== null) {
        const items = [...form.value.config_sections.section_order];
        const [removed] = items.splice(dragIndex.value, 1);
        items.splice(dragOverIndex.value, 0, removed);
        form.value.config_sections.section_order = items;
    }
    dragIndex.value = null;
    dragOverIndex.value = null;
};

const addArrayItem = (section: any, listKey: string) => {
    if (!section[listKey]) section[listKey] = [];
    let newItem: any = {};
    if (section[listKey].length > 0) {
        Object.keys(section[listKey][0]).forEach(k => {
            newItem[k] = typeof section[listKey][0][k] === 'number' ? 0 : '';
        });
    } else {
        if (listKey === 'stats') newItem = { value: '', label: '', color: 'blue' };
        else if (listKey === 'features_list') newItem = { title: '', description: '', icon: '' };
        else if (listKey === 'screenshots_list') newItem = { src: '', alt: '', title: '', description: '' };
        else if (listKey === 'reasons') newItem = { title: '', description: '', icon: '' };
        else if (listKey === 'templates_list') newItem = { name: '', category: '' };
        else if (listKey === 'members') newItem = { name: '', role: '', bio: '', image: '', linkedin: '', email: '' };
        else if (listKey === 'testimonials') newItem = { name: '', role: '', company: '', content: '', rating: 5 };
        else if (listKey === 'faqs') newItem = { question: '', answer: '' };
        else newItem = { title: '', description: '' };
    }
    section[listKey].push(newItem);
};

const removeArrayItem = (section: any, listKey: string, idx: number) => {
    section[listKey].splice(idx, 1);
};

const saveSettings = () => {
    saving.value = true;
    router.post(route('landing-page.settings.update'), form.value, {
        preserveScroll: true,
        preserveState: true,
        onFinish: () => { saving.value = false; }
    });
};
</script>

<style scoped>
.shadow-card {
    box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
}
.shadow-card-hover {
    box-shadow: 0 10px 40px -4px rgba(0, 0, 0, 0.1);
}
.animate-fade-in {
    animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
