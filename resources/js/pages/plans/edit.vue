<template>
    <AppLayout>
        <Head title="Edit Plan" />
        <FlashMessage />
        <div class="space-y-6">
            <div class="flex items-center gap-3">
                <Link :href="route('plans.index')" class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <ArrowLeft :size="18" class="text-gray-500" />
                </Link>
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Edit Plan</h1>
                    <p class="text-sm text-gray-500 mt-0.5">{{ plan?.name }}</p>
                </div>
            </div>

            <div class="max-w-3xl">
                <form @submit.prevent="submit" class="space-y-4">
                    <!-- Basic Info -->
                    <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-6 space-y-4">
                        <h2 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">Basic Info</h2>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <InputLabel value="Plan Name" required />
                                <TextInput v-model="form.name" type="text" class="mt-1.5" :has-error="!!form.errors.name" />
                                <InputError :message="form.errors.name" />
                            </div>
                            <div>
                                <InputLabel value="Duration" required />
                                <select v-model="form.duration" class="mt-1.5 w-full rounded-xl border border-[hsl(var(--border))] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200">
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                    <option value="both">Both</option>
                                </select>
                                <InputError :message="form.errors.duration" />
                            </div>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <InputLabel value="Monthly Price ($)" required />
                                <TextInput v-model="form.price" type="number" step="0.01" class="mt-1.5" :has-error="!!form.errors.price" />
                                <InputError :message="form.errors.price" />
                            </div>
                            <div>
                                <InputLabel value="Yearly Price ($)" />
                                <TextInput v-model="form.yearly_price" type="number" step="0.01" class="mt-1.5" />
                                <InputError :message="form.errors.yearly_price" />
                            </div>
                        </div>
                        <div>
                            <InputLabel value="Description" />
                            <textarea v-model="form.description" rows="3"
                                class="mt-1.5 w-full rounded-xl border border-[hsl(var(--border))] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 resize-none" />
                        </div>
                    </div>

                    <!-- Limits -->
                    <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-6 space-y-4">
                        <h2 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">Usage Limits</h2>
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div>
                                <InputLabel value="Businesses" required />
                                <TextInput v-model="form.business" type="number" class="mt-1.5" :has-error="!!form.errors.business" />
                                <InputError :message="form.errors.business" />
                            </div>
                            <div>
                                <InputLabel value="Max Users" required />
                                <TextInput v-model="form.max_users" type="number" class="mt-1.5" :has-error="!!form.errors.max_users" />
                                <InputError :message="form.errors.max_users" />
                            </div>
                            <div>
                                <InputLabel value="Bio Links" required />
                                <TextInput v-model="form.bio_links" type="number" class="mt-1.5" :has-error="!!form.errors.bio_links" />
                                <InputError :message="form.errors.bio_links" />
                            </div>
                            <div>
                                <InputLabel value="Storage (GB)" required />
                                <TextInput v-model="form.storage_limit" type="number" class="mt-1.5" :has-error="!!form.errors.storage_limit" />
                                <InputError :message="form.errors.storage_limit" />
                            </div>
                        </div>
                    </div>

                    <!-- Features -->
                    <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-6 space-y-4">
                        <h2 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">Features</h2>
                        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <label v-for="feat in featureOptions" :key="feat.key" class="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" v-model="form.features[feat.key]" class="rounded border-gray-300 text-primary-600" />
                                <span class="text-sm text-gray-700">{{ feat.label }}</span>
                            </label>
                        </div>
                    </div>

                    <!-- Business Template Sections -->
                    <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-6 space-y-3">
                        <div>
                            <h2 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">Business Template Sections</h2>
                            <p class="text-xs text-gray-400 mt-0.5">Select which sections users can access in their business templates. Leave empty to allow all sections.</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <input v-model="sectionSearch" type="text" placeholder="Search sections..." class="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200" />
                            <button type="button" @click="form.features.business_template_sections = []" class="px-3 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50">Clear</button>
                            <button type="button" @click="form.features.business_template_sections = Object.keys(templateSections)" class="px-3 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50">Select All</button>
                            <button type="button" @click="form.features.business_template_sections = []" class="px-3 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50">Unselect All</button>
                        </div>
                        <div class="border border-gray-100 rounded-xl p-3 max-h-64 overflow-y-auto">
                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <label v-for="(label, key) in filteredSections" :key="key" class="flex items-center gap-2 cursor-pointer py-1">
                                    <input type="checkbox" :value="key" v-model="form.features.business_template_sections" class="w-4 h-4 rounded-full border-gray-300 text-primary-600" />
                                    <span class="text-sm text-gray-700">{{ label }}</span>
                                </label>
                            </div>
                        </div>
                        <p class="text-xs text-gray-400">{{ form.features.business_template_sections.length }} sections selected</p>
                    </div>

                    <!-- Business Templates -->
                    <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-6 space-y-3">
                        <div>
                            <h2 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">Business Templates</h2>
                            <p class="text-xs text-gray-400 mt-0.5">Available Business Templates ({{ form.themes.length }}/{{ businessTypeOptions.length }}). Leave empty to allow all templates.</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <input v-model="themeSearch" type="text" placeholder="Search business themes..." class="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200" />
                            <button type="button" @click="form.themes = []" class="px-3 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50">Clear</button>
                            <button type="button" @click="form.themes = businessTypeOptions.map(t => t.value)" class="px-3 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50">Select All</button>
                            <button type="button" @click="form.themes = []" class="px-3 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50">Unselect All</button>
                        </div>
                        <div class="border border-gray-100 rounded-xl p-3 max-h-64 overflow-y-auto">
                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <label v-for="t in filteredThemes" :key="t.value" class="flex items-center gap-2 cursor-pointer py-1">
                                    <input type="checkbox" :value="t.value" v-model="form.themes" class="w-4 h-4 rounded-full border-gray-300 text-primary-600" />
                                    <span class="text-sm text-gray-700">Theme {{ t.themeNumber }}: {{ t.label }}</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Bio Links Templates -->
                    <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-6 space-y-3">
                        <div>
                            <h2 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">Bio Links Templates</h2>
                            <p class="text-xs text-gray-400 mt-0.5">Available Bio Links Templates ({{ form.bio_links_themes.length }}/{{ bioLinkTypes.length }}). Leave empty to allow all templates.</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <input v-model="bioSearch" type="text" placeholder="Search bio themes..." class="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200" />
                            <button type="button" @click="form.bio_links_themes = []" class="px-3 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50">Clear</button>
                            <button type="button" @click="form.bio_links_themes = bioLinkTypes.map(t => t.value)" class="px-3 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50">Select All</button>
                            <button type="button" @click="form.bio_links_themes = []" class="px-3 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50">Unselect All</button>
                        </div>
                        <div class="border border-gray-100 rounded-xl p-3 max-h-64 overflow-y-auto">
                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <label v-for="(t, i) in filteredBioThemes" :key="t.value" class="flex items-center gap-2 cursor-pointer py-1">
                                    <input type="checkbox" :value="t.value" v-model="form.bio_links_themes" class="w-4 h-4 rounded-full border-gray-300 text-primary-600" />
                                    <span class="text-sm text-gray-700">Theme {{ i + 1 }}: {{ t.label }}</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Trial & Status -->
                    <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-6 space-y-4">
                        <h2 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">Trial & Status</h2>
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div class="flex items-center gap-2">
                                <input type="checkbox" v-model="trialEnabled" id="is_trial" class="rounded border-gray-300 text-primary-600" />
                                <label for="is_trial" class="text-sm text-gray-700">Enable Trial</label>
                            </div>
                            <div v-if="trialEnabled">
                                <InputLabel value="Trial Days" />
                                <TextInput v-model="form.trial_day" type="number" class="mt-1.5" />
                            </div>
                            <div class="flex items-center gap-2">
                                <input type="checkbox" v-model="planEnabled" id="is_plan_enable" class="rounded border-gray-300 text-primary-600" />
                                <label for="is_plan_enable" class="text-sm text-gray-700">Active</label>
                            </div>
                            <div class="flex items-center gap-2">
                                <input type="checkbox" v-model="form.is_default" id="is_default" class="rounded border-gray-300 text-primary-600" :disabled="otherDefaultPlanExists && !plan.is_default" />
                                <label for="is_default" class="text-sm text-gray-700">Default Plan</label>
                            </div>
                        </div>
                    </div>

                    <div class="flex gap-3 justify-end">
                        <Link :href="route('plans.index')" class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</Link>
                        <PrimaryButton :disabled="form.processing">
                            <Loader2 v-if="form.processing" :size="14" class="mr-1 animate-spin" />
                            Save Changes
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import { ArrowLeft, Loader2 } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import InputError from '@/components/ui/InputError.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';
const businessTypeOptions = [
    { value: 'freelancer', label: 'Freelancer', themeNumber: 1 },
    { value: 'doctor', label: 'Doctor/Medical', themeNumber: 2 },
    { value: 'restaurant', label: 'Restaurant', themeNumber: 3 },
    { value: 'realestate', label: 'Real Estate Agent', themeNumber: 4 },
    { value: 'fitness', label: 'Fitness Trainer', themeNumber: 5 },
    { value: 'photography', label: 'Photography', themeNumber: 6 },
    { value: 'lawfirm', label: 'Law Firm', themeNumber: 7 },
    { value: 'cafe', label: 'Cafe & Coffee Shop', themeNumber: 8 },
    { value: 'salon', label: 'Salon & Spa', themeNumber: 9 },
    { value: 'construction', label: 'Construction & Contractor', themeNumber: 10 },
    { value: 'eventplanner', label: 'Event Planner', themeNumber: 11 },
    { value: 'ecommerce', label: 'E-commerce Store', themeNumber: 12 },
    { value: 'travel', label: 'Travel Agency', themeNumber: 13 },
    { value: 'gym', label: 'Fitness Studio/Gym', themeNumber: 14 },
    { value: 'bakery', label: 'Bakery & Pastry Shop', themeNumber: 15 },
    { value: 'fitness-studio', label: 'Modern Fitness Studio', themeNumber: 16 },
    { value: 'tech-startup', label: 'Tech Startup/SaaS', themeNumber: 17 },
    { value: 'music-artist', label: 'Music Artist/Band', themeNumber: 18 },
    { value: 'wedding-planner', label: 'Wedding Planner', themeNumber: 19 },
    { value: 'pet-care', label: 'Pet Care Services', themeNumber: 20 },
    { value: 'digital-marketing', label: 'Digital Marketing Agency', themeNumber: 21 },
    { value: 'automotive', label: 'Automotive Services', themeNumber: 22 },
    { value: 'beauty-cosmetics', label: 'Beauty & Cosmetics', themeNumber: 23 },
    { value: 'food-delivery', label: 'Food Delivery & Catering', themeNumber: 24 },
    { value: 'home-services', label: 'Home Services & Maintenance', themeNumber: 25 },
    { value: 'personal-trainer', label: 'Personal Trainer & Fitness Coach', themeNumber: 26 },
    { value: 'consulting', label: 'Consulting & Professional Services', themeNumber: 27 },
    { value: 'graphic-design', label: 'Graphic Design Studio', themeNumber: 28 },
    { value: 'yoga-wellness', label: 'Yoga & Wellness Studio', themeNumber: 29 },
    { value: 'podcast-creator', label: 'Podcast Host & Content Creator', themeNumber: 30 },
    { value: 'gaming-streamer', label: 'Gaming Streamer & Esports', themeNumber: 31 },
    { value: 'life-coach', label: 'Life Coach & Motivational Speaker', themeNumber: 32 },
    { value: 'veterinarian', label: 'Veterinarian & Animal Care', themeNumber: 33 },
    { value: 'architect-designer', label: 'Architect & Interior Designer', themeNumber: 34 },
];

const bioLinkTypes = [
    { value: 'personal', label: 'Personal' },
    { value: 'business', label: 'Business' },
    { value: 'portfolio', label: 'Portfolio' },
    { value: 'social', label: 'Social Media' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'tech', label: 'Tech' },
    { value: 'nature', label: 'Nature' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'health', label: 'Health & Wellness' },
    { value: 'travel', label: 'Travel & Tourism' },
    { value: 'food', label: 'Food & Beverage' },
    { value: 'ecommerce', label: 'E-Commerce' },
    { value: 'blogger', label: 'Blogger' },
    { value: 'glamorous', label: 'Glamorous Influencer' },
];

const props = defineProps<{ plan: any; otherDefaultPlanExists?: boolean }>();

const featureOptions = [
    { key: 'custom_domain', label: 'Custom Domain' },
    { key: 'custom_subdomain', label: 'Custom Subdomain' },
    { key: 'pwa_support', label: 'PWA Support' },
    { key: 'ai_integration', label: 'AI Integration' },
    { key: 'password_protection', label: 'Password Protection' },
    { key: 'custom_css', label: 'Custom CSS/JS' },
    { key: 'google_wallet', label: 'Google Wallet' },
    { key: 'vcard_builder', label: 'vCard Builder' },
    { key: 'broadcast_email', label: 'Broadcast Email' },
    { key: 'bio_link', label: 'Bio Link' },
];

const templateSections: Record<string, string> = {
    header: 'Header & Logo',
    about: 'About Section',
    services: 'Services & Offerings',
    portfolio: 'Portfolio & Gallery',
    testimonials: 'Testimonials & Reviews',
    contact: 'Contact Information',
    social: 'Social Media Links',
    business_hours: 'Business Hours',
    gallery: 'Photo Gallery',
    appointments: 'Appointment Booking',
    google_map: 'Location & Maps',
    app_download: 'App Download Links',
    contact_form: 'Contact Form',
    custom_html: 'Custom HTML Content',
    qr_share: 'QR Code Sharing',
    language: 'Language Settings',
    thank_you: 'Thank You Message',
    seo: 'SEO Settings',
    pixels: 'Analytics & Pixels',
    copyright: 'Copyright Information',
};

const sectionSearch = ref('');
const themeSearch = ref('');
const bioSearch = ref('');

const filteredSections = computed(() => {
    if (!sectionSearch.value) return templateSections;
    const q = sectionSearch.value.toLowerCase();
    return Object.fromEntries(Object.entries(templateSections).filter(([, v]) => v.toLowerCase().includes(q)));
});
const filteredThemes = computed(() => {
    if (!themeSearch.value) return businessTypeOptions;
    const q = themeSearch.value.toLowerCase();
    return businessTypeOptions.filter(t => t.label.toLowerCase().includes(q));
});
const filteredBioThemes = computed(() => {
    if (!bioSearch.value) return bioLinkTypes;
    const q = bioSearch.value.toLowerCase();
    return bioLinkTypes.filter(t => t.label.toLowerCase().includes(q));
});

const existingFeatures = props.plan?.features ?? {};
const existingSections: string[] = Array.isArray(existingFeatures.business_template_sections)
    ? existingFeatures.business_template_sections : [];

const trialEnabled = ref(props.plan?.is_trial === 'on');
const planEnabled = ref(props.plan?.is_plan_enable !== 'off');

const form = useForm({
    name: props.plan?.name ?? '',
    price: String(props.plan?.price ?? ''),
    yearly_price: String(props.plan?.yearly_price ?? ''),
    duration: props.plan?.duration ?? 'monthly',
    description: props.plan?.description ?? '',
    business: String(props.plan?.business ?? 5),
    max_users: String(props.plan?.max_users ?? 3),
    bio_links: String(props.plan?.bio_links ?? 10),
    storage_limit: String(props.plan?.storage_limit ?? 5),
    themes: Array.isArray(props.plan?.themes) ? props.plan.themes : [] as string[],
    bio_links_themes: Array.isArray(props.plan?.bio_links_themes) ? props.plan.bio_links_themes : [] as string[],
    features: {
        custom_domain: existingFeatures.custom_domain ?? false,
        custom_subdomain: existingFeatures.custom_subdomain ?? false,
        pwa_support: existingFeatures.pwa_support ?? false,
        ai_integration: existingFeatures.ai_integration ?? false,
        password_protection: existingFeatures.password_protection ?? false,
        custom_css: existingFeatures.custom_css ?? false,
        google_wallet: existingFeatures.google_wallet ?? false,
        vcard_builder: existingFeatures.vcard_builder ?? false,
        broadcast_email: existingFeatures.broadcast_email ?? false,
        bio_link: existingFeatures.bio_link ?? false,
        business_template_sections: existingSections,
    } as Record<string, any>,
    is_trial: props.plan?.is_trial ?? 'off',
    trial_day: String(props.plan?.trial_day ?? ''),
    is_plan_enable: props.plan?.is_plan_enable ?? 'on',
    is_default: props.plan?.is_default ?? false,
});

watch(trialEnabled, (val) => { form.is_trial = val ? 'on' : 'off'; });
watch(planEnabled, (val) => { form.is_plan_enable = val ? 'on' : 'off'; });

const submit = () => form.put(route('plans.update', props.plan.id));
</script>
