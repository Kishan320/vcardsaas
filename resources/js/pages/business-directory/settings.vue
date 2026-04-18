<template>
    <PageTemplate title="Business Directory Settings" url="/directory/settings" :noPadding="false">
        <template #default>
        <div class="space-y-6">
            <!-- Header actions -->
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-muted-foreground">Configure your business directory appearance and menu</p>
                </div>
                <div class="flex gap-2">
                    <a
                        :href="route('directory.index')"
                        class="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors text-sm"
                        :style="{ backgroundColor: primaryColor }"
                    >
                        <Eye :size="14" /> View Directory
                    </a>
                    <button
                        @click="saveSettings"
                        :disabled="saving"
                        class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 disabled:opacity-60 transition-colors"
                    >
                        <Loader2 v-if="saving" :size="14" class="animate-spin" />
                        <Save v-else :size="14" />
                        {{ saving ? 'Saving...' : 'Save Changes' }}
                    </button>
                </div>
            </div>

            <!-- Tab buttons -->
            <div class="flex flex-wrap gap-2">
                <button
                    v-for="tab in tabs" :key="tab.key"
                    @click="activeSection = tab.key"
                    class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors"
                    :class="activeSection === tab.key ? 'text-white' : 'border border-gray-300 hover:bg-gray-50'"
                    :style="activeSection === tab.key ? { backgroundColor: primaryColor } : {}"
                >
                    <component :is="tab.icon" :size="14" />
                    {{ tab.label }}
                </button>
            </div>

            <!-- Content Tab -->
            <div v-if="activeSection === 'content'" class="space-y-6">
                <!-- Basic Info -->
                <div class="rounded-xl border bg-white p-6 shadow-sm">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="p-2 bg-blue-100 rounded-lg"><Type :size="18" class="text-blue-600" /></div>
                        <div>
                            <h3 class="text-lg font-semibold">Basic Information</h3>
                            <p class="text-sm text-muted-foreground">Configure main directory content</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Directory Title</label>
                            <input v-model="form.title" type="text" placeholder="Business Directory" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Directory Description</label>
                            <textarea v-model="form.description" rows="3" placeholder="Discover amazing businesses..." class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 resize-none" />
                        </div>
                    </div>
                </div>

                <!-- Company Info -->
                <div class="rounded-xl border bg-white p-6 shadow-sm">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="p-2 bg-orange-100 rounded-lg"><Info :size="18" class="text-orange-600" /></div>
                        <div>
                            <h3 class="text-lg font-semibold">Company Information</h3>
                            <p class="text-sm text-muted-foreground">Separate company information for business directory</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Company Name</label>
                            <input v-model="form.config_sections.company.name" type="text" placeholder="Directory Company Name" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Contact Email</label>
                            <input v-model="form.config_sections.company.contact_email" type="email" placeholder="support@company.com" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Contact Phone</label>
                            <input v-model="form.config_sections.company.contact_phone" type="text" placeholder="+1 (555) 123-4567" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Contact Address</label>
                            <input v-model="form.config_sections.company.contact_address" type="text" placeholder="123 Business Ave, City, State" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2" />
                        </div>
                    </div>
                </div>

                <!-- Theme Colors -->
                <div class="rounded-xl border bg-white p-6 shadow-sm">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="p-2 bg-purple-100 rounded-lg"><Palette :size="18" class="text-purple-600" /></div>
                        <div>
                            <h3 class="text-lg font-semibold">Theme Colors</h3>
                            <p class="text-sm text-muted-foreground">Customize the color scheme for your directory</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div v-for="colorKey in ['primary_color', 'secondary_color', 'accent_color']" :key="colorKey">
                            <label class="block text-sm font-medium mb-1 capitalize">{{ colorKey.replace('_', ' ') }}</label>
                            <div class="flex gap-2">
                                <input type="color" v-model="form.config_sections.theme[colorKey]" class="w-16 h-10 p-1 border rounded-lg cursor-pointer" />
                                <input type="text" v-model="form.config_sections.theme[colorKey]" class="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Background Options -->
                <div class="rounded-xl border bg-white p-6 shadow-sm">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="p-2 bg-green-100 rounded-lg"><ImageIcon :size="18" class="text-green-600" /></div>
                        <div>
                            <h3 class="text-lg font-semibold">Background Options</h3>
                            <p class="text-sm text-muted-foreground">Choose between solid colors or background image</p>
                        </div>
                    </div>
                    <div class="space-y-4">
                        <label class="flex items-center gap-3 cursor-pointer">
                            <div
                                class="relative w-10 h-6 rounded-full transition-colors cursor-pointer"
                                :class="form.config_sections.use_background_image ? 'bg-primary' : 'bg-gray-300'"
                                @click="form.config_sections.use_background_image = !form.config_sections.use_background_image"
                            >
                                <div
                                    class="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"
                                    :class="form.config_sections.use_background_image ? 'translate-x-5' : 'translate-x-1'"
                                />
                            </div>
                            <span class="text-sm font-medium">Use Background Image</span>
                        </label>

                        <div v-if="form.config_sections.use_background_image" class="space-y-3">
                            <MediaPicker
                                label="Background Image"
                                :value="form.config_sections.background_image"
                                :onChange="(value) => form.config_sections.background_image = value"
                                placeholder="Select background image..."
                                :showPreview="true"
                            />
                            <p class="text-xs text-muted-foreground">
                                Recommended size: 1920x1080px or larger. The image will be used as the directory background.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Hero Tab -->
            <div v-if="activeSection === 'hero'" class="space-y-6">
                <div class="rounded-xl border bg-white p-6 shadow-sm">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="p-2 bg-indigo-100 rounded-lg"><SettingsIcon :size="18" class="text-indigo-600" /></div>
                        <div>
                            <h3 class="text-lg font-semibold">Hero Section Content</h3>
                            <p class="text-sm text-muted-foreground">Configure the main hero section content</p>
                        </div>
                    </div>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Trust Badge Text</label>
                            <input v-model="form.config_sections.hero.trust_badge" type="text" placeholder="Trusted by 10,000+ Businesses" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Main Title</label>
                            <input v-model="form.config_sections.hero.main_title" type="text" placeholder="Discover Amazing Businesses" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Subtitle</label>
                            <textarea v-model="form.config_sections.hero.subtitle" rows="3" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 resize-none" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium mb-3">Feature Highlights</label>
                            <div v-for="(feature, i) in form.config_sections.hero.features" :key="i" class="grid grid-cols-2 gap-4 p-4 border rounded-lg mb-3">
                                <div>
                                    <label class="block text-xs font-medium mb-1">Icon</label>
                                    <select v-model="feature.icon" class="w-full border rounded-lg px-3 py-2 text-sm">
                                        <option value="verified">Verified</option>
                                        <option value="location">Location</option>
                                        <option value="contact">Contact</option>
                                        <option value="star">Star</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs font-medium mb-1">Text</label>
                                    <div class="flex gap-2">
                                        <input v-model="feature.text" type="text" placeholder="Feature text" class="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2" />
                                        <button @click="form.config_sections.hero.features.splice(i, 1)" class="px-2 py-1 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 text-xs">
                                            <Trash2 :size="14" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <button
                                @click="form.config_sections.hero.features.push({ icon: 'verified', text: '' })"
                                class="inline-flex items-center gap-2 px-4 py-2 border-2 text-sm rounded-lg"
                                :style="{ color: primaryColor, borderColor: primaryColor }"
                            >
                                <Plus :size="14" /> Add Feature
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer Tab -->
            <div v-if="activeSection === 'footer'" class="space-y-6">
                <div class="rounded-xl border bg-white p-6 shadow-sm">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="p-2 bg-gray-100 rounded-lg"><Type :size="18" class="text-gray-600" /></div>
                        <div>
                            <h3 class="text-lg font-semibold">Footer Content</h3>
                            <p class="text-sm text-muted-foreground">Footer description and newsletter content</p>
                        </div>
                    </div>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Company Description</label>
                            <textarea v-model="form.config_sections.footer.description" rows="3" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 resize-none" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Newsletter Title</label>
                            <input v-model="form.config_sections.footer.newsletter_title" type="text" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Newsletter Subtitle</label>
                            <input v-model="form.config_sections.footer.newsletter_subtitle" type="text" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2" />
                        </div>
                    </div>
                </div>

                <!-- Footer Links -->
                <div class="rounded-xl border bg-white p-6 shadow-sm">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="p-2 bg-green-100 rounded-lg"><Plus :size="18" class="text-green-600" /></div>
                        <div>
                            <h3 class="text-lg font-semibold">Footer Links</h3>
                            <p class="text-sm text-muted-foreground">Footer navigation links by category</p>
                        </div>
                    </div>
                    <div class="space-y-4">
                        <div v-for="(category, ci) in form.config_sections.footer.footer_links" :key="ci" class="border rounded-xl p-4 bg-gray-50">
                            <div class="flex items-center justify-between mb-3">
                                <input v-model="category.title" type="text" placeholder="Category title (e.g. Company)" class="flex-1 border rounded-lg px-3 py-2 text-sm font-semibold mr-3" />
                                <button @click="form.config_sections.footer.footer_links.splice(ci, 1)" class="text-red-600 border border-red-200 rounded-lg px-2 py-1 hover:bg-red-50">
                                    <Trash2 :size="14" />
                                </button>
                            </div>
                            <div class="space-y-2 mb-3">
                                <div v-for="(link, li) in category.links" :key="li" class="flex gap-2 items-center">
                                    <input v-model="link.label" type="text" placeholder="Label" class="flex-1 border rounded-lg px-3 py-2 text-sm" />
                                    <input v-model="link.href" type="text" placeholder="URL" class="flex-1 border rounded-lg px-3 py-2 text-sm" />
                                    <button @click="category.links.splice(li, 1)" class="text-red-400 hover:text-red-600"><Trash2 :size="13" /></button>
                                </div>
                            </div>
                            <button
                                @click="category.links.push({ label: '', href: '' })"
                                class="inline-flex items-center gap-1 px-3 py-1.5 border text-xs rounded-lg"
                                :style="{ color: primaryColor, borderColor: primaryColor }"
                            >
                                <Plus :size="12" /> Add Link
                            </button>
                        </div>
                        <button
                            @click="form.config_sections.footer.footer_links.push({ title: '', links: [{ label: '', href: '' }] })"
                            class="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border-2 text-sm rounded-lg"
                            :style="{ color: primaryColor, borderColor: primaryColor }"
                        >
                            <Plus :size="14" /> Add Category
                        </button>
                    </div>
                </div>

                <!-- Social Links -->
                <div class="rounded-xl border bg-white p-6 shadow-sm">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="p-2 bg-blue-100 rounded-lg"><SettingsIcon :size="18" class="text-blue-600" /></div>
                        <div><h3 class="text-lg font-semibold">Social Links</h3></div>
                    </div>
                    <div class="space-y-4">
                        <div v-for="(social, i) in form.config_sections.footer.social_links" :key="i" class="bg-gray-50 border rounded-xl p-4">
                            <div class="flex items-center justify-between mb-3">
                                <span class="text-sm font-semibold">Social Link {{ i + 1 }}</span>
                                <button @click="form.config_sections.footer.social_links.splice(i, 1)" class="text-red-600 border border-red-200 rounded-lg px-2 py-1 hover:bg-red-50">
                                    <Trash2 :size="14" />
                                </button>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                    <label class="block text-xs font-medium mb-1">Name</label>
                                    <input v-model="social.name" type="text" placeholder="Facebook" class="w-full border rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label class="block text-xs font-medium mb-1">Icon</label>
                                    <select v-model="social.icon" class="w-full border rounded-lg px-3 py-2 text-sm">
                                        <option value="Facebook">Facebook</option>
                                        <option value="Twitter">Twitter</option>
                                        <option value="Linkedin">LinkedIn</option>
                                        <option value="Instagram">Instagram</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs font-medium mb-1">URL</label>
                                    <input v-model="social.href" type="text" placeholder="https://..." class="w-full border rounded-lg px-3 py-2 text-sm" />
                                </div>
                            </div>
                        </div>
                        <button
                            @click="form.config_sections.footer.social_links.push({ name: '', icon: 'Facebook', href: '' })"
                            class="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border-2 text-sm rounded-lg"
                            :style="{ color: primaryColor, borderColor: primaryColor }"
                        >
                            <Plus :size="14" /> Add Social Link
                        </button>
                    </div>
                </div>
            </div>

            <!-- Order Tab -->
            <div v-if="activeSection === 'order'" class="space-y-6">
                <div class="rounded-xl border bg-white p-6 shadow-sm">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="p-2 bg-indigo-100 rounded-lg"><ArrowUpDown :size="18" class="text-indigo-600" /></div>
                        <div>
                            <h3 class="text-lg font-semibold">Section Order & Visibility</h3>
                            <p class="text-sm text-muted-foreground">Toggle sections on or off for your directory page</p>
                        </div>
                    </div>
                    <div class="space-y-3">
                        <div
                            v-for="(sectionKey, i) in sectionOrder"
                            :key="sectionKey"
                            draggable="true"
                            @dragstart="onDragStart(i)"
                            @dragover.prevent="onDragOver(i)"
                            @dragend="onDragEnd"
                            class="flex items-center gap-3 p-4 border rounded-lg transition-opacity"
                            :class="[
                                isSectionEnabled(sectionKey) ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-300 opacity-60',
                                dragIndex === i ? 'opacity-40' : '',
                                dragOverIndex === i && dragIndex !== i ? 'border-indigo-400 border-2' : ''
                            ]"
                        >
                            <GripVertical :size="18" class="text-gray-400 cursor-grab active:cursor-grabbing" />
                            <div class="flex-1 flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <span class="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">{{ i + 1 }}</span>
                                    <div>
                                        <h4 class="font-medium text-gray-900">{{ sectionNames[sectionKey] }}</h4>
                                        <p class="text-sm text-muted-foreground">{{ isSectionEnabled(sectionKey) ? 'Enabled' : 'Disabled' }}</p>
                                    </div>
                                </div>
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <span class="text-sm">Enable</span>
                                    <div
                                        class="relative w-10 h-6 rounded-full transition-colors cursor-pointer"
                                        :class="isSectionEnabled(sectionKey) ? 'bg-primary' : 'bg-gray-300'"
                                        @click="toggleSection(sectionKey)"
                                    >
                                        <div
                                            class="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"
                                            :class="isSectionEnabled(sectionKey) ? 'translate-x-5' : 'translate-x-1'"
                                        />
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </template>
    </PageTemplate>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { router } from '@inertiajs/vue3';
import { Eye, Save, Loader2, Type, Info, Palette, Settings as SettingsIcon, ArrowUpDown, GripVertical, Plus, Trash2, Image as ImageIcon } from 'lucide-vue-next';
import PageTemplate from '@/components/page-template.vue';
import MediaPicker from '@/components/MediaPicker.vue';

const props = defineProps<{ settings?: any }>();

const saving = ref(false);
const activeSection = ref<'content' | 'hero' | 'footer' | 'order'>('content');

const tabs = [
    { key: 'content', label: 'Content', icon: Type },
    { key: 'hero', label: 'Hero', icon: SettingsIcon },
    { key: 'footer', label: 'Footer', icon: Type },
    { key: 'order', label: 'Order', icon: ArrowUpDown },
];

const sectionNames: Record<string, string> = {
    hero: 'Hero Section', search: 'Search Bar',
    categories: 'Business Categories', filters: 'Filters', businesses: 'Business Listings',
};

const defaultConfig = {
    theme: { primary_color: '#7C3AED', secondary_color: '#3b82f6', accent_color: '#8b5cf6' },
    company: { name: '', contact_email: '', contact_phone: '', contact_address: '' },
    hero: {
        trust_badge: 'Trusted by 10,000+ Businesses',
        main_title: 'Discover Amazing Businesses',
        subtitle: 'Connect with professionals, explore services, and grow your network in our comprehensive business directory',
        features: [
            { icon: 'verified', text: 'Verified Businesses' },
            { icon: 'location', text: 'Local & Global' },
            { icon: 'contact', text: 'Instant Contact' },
        ],
    },
    footer: {
        description: '',
        newsletter_title: 'Stay Updated with Our Latest Features',
        newsletter_subtitle: 'Join our newsletter for product updates and networking tips',
        social_links: [
            { name: 'Facebook', icon: 'Facebook', href: '#' },
            { name: 'Twitter', icon: 'Twitter', href: '#' },
        ],
        footer_links: [
            { title: 'Company', links: [{ label: 'About Us', href: '#' }, { label: 'Contact', href: '#' }] },
            { title: 'Resources', links: [{ label: 'Blog', href: '#' }, { label: 'Support', href: '#' }] },
        ],
    },
    section_order: ['hero', 'search', 'categories', 'filters', 'businesses'],
    section_visibility: { hero: true, search: true, categories: true, filters: true, businesses: true },
};

const existing = props.settings?.config_sections || {};

const form = reactive({
    title: props.settings?.title || 'Business Directory',
    description: props.settings?.description || '',
    config_sections: {
        theme: { ...defaultConfig.theme, ...(existing.theme || {}) },
        company: { ...defaultConfig.company, ...(existing.company || {}) },
        hero: { ...defaultConfig.hero, ...(existing.hero || {}), features: existing.hero?.features || defaultConfig.hero.features },
        footer: { ...defaultConfig.footer, ...(existing.footer || {}), social_links: existing.footer?.social_links || defaultConfig.footer.social_links, footer_links: existing.footer?.footer_links || defaultConfig.footer.footer_links },
        section_order: existing.section_order || defaultConfig.section_order,
        section_visibility: { ...defaultConfig.section_visibility, ...(existing.section_visibility || {}) },
        use_background_image: existing.use_background_image || false,
        background_image: existing.background_image || '',
    },
});

const primaryColor = computed(() => form.config_sections.theme.primary_color || '#7C3AED');

const sectionOrder = computed(() => {
    const defaults = ['hero', 'search', 'categories', 'filters', 'businesses'];
    const current = form.config_sections.section_order || [];
    return [...new Set([...current, ...defaults])];
});

const dragIndex = ref<number | null>(null);
const dragOverIndex = ref<number | null>(null);

function onDragStart(i: number) {
    dragIndex.value = i;
}

function onDragOver(i: number) {
    dragOverIndex.value = i;
}

function onDragEnd() {
    if (dragIndex.value !== null && dragOverIndex.value !== null && dragIndex.value !== dragOverIndex.value) {
        const order = [...form.config_sections.section_order];
        const [moved] = order.splice(dragIndex.value, 1);
        order.splice(dragOverIndex.value, 0, moved);
        form.config_sections.section_order = order;
    }
    dragIndex.value = null;
    dragOverIndex.value = null;
}

function isSectionEnabled(key: string) {
    return form.config_sections.section_visibility?.[key] !== false;
}

function toggleSection(key: string) {
    form.config_sections.section_visibility = {
        ...form.config_sections.section_visibility,
        [key]: !isSectionEnabled(key),
    };
}

function getDisplayUrl(path: string) {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return ((window as any).appSettings?.imageUrl || '') + path;
}

function convertToRelativePath(url: string) {
    if (!url) return '';
    if (url.startsWith('http')) {
        // Extract path from full URL
        const urlObj = new URL(url);
        return urlObj.pathname;
    }
    if (url.startsWith('/')) {
        return url;
    }
    return '/' + url;
}

function saveSettings() {
    saving.value = true;
    router.post(route('directory.settings.update'), form, {
        preserveScroll: true,
        onFinish: () => (saving.value = false),
    });
}
</script>
