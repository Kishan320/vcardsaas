<template>
    <AppLayout>
        <Head title="Settings" />
        <FlashMessage />
        <div class="space-y-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
                <p class="text-sm text-gray-500 mt-0.5">Manage your application settings</p>
            </div>

            <div class="flex flex-col lg:flex-row gap-6">
                <!-- Sidebar -->
                <div class="lg:w-56 flex-shrink-0">
                    <nav class="bg-white border border-gray-100 rounded-2xl shadow-card p-2 space-y-0.5">
                        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                            :class="activeTab === tab.id ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'">
                            <component :is="tab.icon" :size="16" :class="activeTab === tab.id ? 'text-primary-600' : 'text-gray-400'" />
                            {{ tab.label }}
                        </button>
                    </nav>
                </div>

                <!-- Content -->
                <div class="flex-1">
                    <!-- System Settings -->
                    <div v-if="activeTab === 'system'" class="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
                        <h2 class="text-lg font-semibold text-gray-900 mb-5">System Settings</h2>
                        <form @submit.prevent="saveSystem" class="space-y-4">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel value="App Name" />
                                    <TextInput v-model="systemForm.app_name" type="text" class="mt-1.5" placeholder="VCard SaaS" />
                                </div>
                                <div>
                                    <InputLabel value="App URL" />
                                    <TextInput v-model="systemForm.app_url" type="url" class="mt-1.5" placeholder="https://example.com" />
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                <input type="checkbox" v-model="systemForm.registration_enabled" id="reg" class="rounded border-gray-300 text-primary-600" />
                                <label for="reg" class="text-sm text-gray-700">Allow new user registrations</label>
                            </div>
                            <div class="flex justify-end">
                                <PrimaryButton :disabled="saving">
                                    <Loader2 v-if="saving" :size="14" class="mr-1 animate-spin" />
                                    Save Settings
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    <!-- Email Settings -->
                    <div v-if="activeTab === 'email'" class="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
                        <h2 class="text-lg font-semibold text-gray-900 mb-5">Email Settings</h2>
                        <form @submit.prevent="saveEmail" class="space-y-4">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel value="Mail Driver" />
                                    <select v-model="emailForm.mail_mailer" class="mt-1.5 w-full rounded-xl border border-[hsl(var(--border))] bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200">
                                        <option value="smtp">SMTP</option>
                                        <option value="mailgun">Mailgun</option>
                                        <option value="ses">Amazon SES</option>
                                        <option value="log">Log (Testing)</option>
                                    </select>
                                </div>
                                <div>
                                    <InputLabel value="Mail Host" />
                                    <TextInput v-model="emailForm.mail_host" type="text" class="mt-1.5" placeholder="smtp.mailtrap.io" />
                                </div>
                                <div>
                                    <InputLabel value="Mail Port" />
                                    <TextInput v-model="emailForm.mail_port" type="number" class="mt-1.5" placeholder="587" />
                                </div>
                                <div>
                                    <InputLabel value="Mail Username" />
                                    <TextInput v-model="emailForm.mail_username" type="text" class="mt-1.5" />
                                </div>
                                <div>
                                    <InputLabel value="Mail Password" />
                                    <TextInput v-model="emailForm.mail_password" type="password" class="mt-1.5" />
                                </div>
                                <div>
                                    <InputLabel value="From Address" />
                                    <TextInput v-model="emailForm.mail_from_address" type="email" class="mt-1.5" placeholder="noreply@example.com" />
                                </div>
                            </div>
                            <div class="flex justify-end">
                                <PrimaryButton :disabled="saving">
                                    <Loader2 v-if="saving" :size="14" class="mr-1 animate-spin" />
                                    Save Email Settings
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    <!-- Payment Settings -->
                    <div v-if="activeTab === 'payment'" class="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
                        <h2 class="text-lg font-semibold text-gray-900 mb-5">Payment Settings</h2>
                        <form @submit.prevent="savePayment" class="space-y-4">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel value="Stripe Public Key" />
                                    <TextInput v-model="paymentForm.stripe_key" type="text" class="mt-1.5" placeholder="pk_..." />
                                </div>
                                <div>
                                    <InputLabel value="Stripe Secret Key" />
                                    <TextInput v-model="paymentForm.stripe_secret" type="password" class="mt-1.5" placeholder="sk_..." />
                                </div>
                                <div>
                                    <InputLabel value="PayPal Client ID" />
                                    <TextInput v-model="paymentForm.paypal_client_id" type="text" class="mt-1.5" />
                                </div>
                                <div>
                                    <InputLabel value="PayPal Secret" />
                                    <TextInput v-model="paymentForm.paypal_secret" type="password" class="mt-1.5" />
                                </div>
                            </div>
                            <div class="flex justify-end">
                                <PrimaryButton :disabled="saving">
                                    <Loader2 v-if="saving" :size="14" class="mr-1 animate-spin" />
                                    Save Payment Settings
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    <!-- SEO Settings -->
                    <div v-if="activeTab === 'seo'" class="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
                        <h2 class="text-lg font-semibold text-gray-900 mb-5">SEO Settings</h2>
                        <form @submit.prevent="saveSeo" class="space-y-4">
                            <div>
                                <InputLabel value="Site Title" />
                                <TextInput v-model="seoForm.site_title" type="text" class="mt-1.5" />
                            </div>
                            <div>
                                <InputLabel value="Meta Description" />
                                <textarea v-model="seoForm.meta_description" rows="3"
                                    class="mt-1.5 w-full rounded-xl border border-[hsl(var(--border))] bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 resize-none" />
                            </div>
                            <div class="flex justify-end">
                                <PrimaryButton :disabled="saving">
                                    <Loader2 v-if="saving" :size="14" class="mr-1 animate-spin" />
                                    Save SEO Settings
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Head, router } from '@inertiajs/vue3';
import { Settings, Mail, CreditCard, Globe, Loader2 } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';

const props = defineProps<{ settings?: Record<string, string> }>();

const activeTab = ref('system');
const saving = ref(false);

const tabs = [
    { id: 'system', label: 'System', icon: Settings },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'seo', label: 'SEO', icon: Globe },
];

const systemForm = ref({
    app_name: props.settings?.app_name ?? '',
    app_url: props.settings?.app_url ?? '',
    registration_enabled: props.settings?.registration_enabled === '1',
});

const emailForm = ref({
    mail_mailer: props.settings?.mail_mailer ?? 'smtp',
    mail_host: props.settings?.mail_host ?? '',
    mail_port: props.settings?.mail_port ?? '587',
    mail_username: props.settings?.mail_username ?? '',
    mail_password: '',
    mail_from_address: props.settings?.mail_from_address ?? '',
});

const paymentForm = ref({
    stripe_key: props.settings?.stripe_key ?? '',
    stripe_secret: '',
    paypal_client_id: props.settings?.paypal_client_id ?? '',
    paypal_secret: '',
});

const seoForm = ref({
    site_title: props.settings?.site_title ?? '',
    meta_description: props.settings?.meta_description ?? '',
});

const post = (url: string, data: any) => {
    saving.value = true;
    router.post(url, data, { onFinish: () => { saving.value = false; } });
};

const saveSystem = () => post(route('settings.system.update'), systemForm.value);
const saveEmail = () => post(route('settings.email.update'), emailForm.value);
const savePayment = () => post(route('settings.payment.update'), paymentForm.value);
const saveSeo = () => post(route('settings.seo.update'), seoForm.value);
</script>
