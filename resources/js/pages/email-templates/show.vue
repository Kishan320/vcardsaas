<template>
    <AppLayout>
        <Head :title="emailTemplate.name" />
        <FlashMessage />
        <div class="space-y-6">
            <div class="flex items-center gap-3">
                <Link :href="route('email-templates.index')" class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <ArrowLeft :size="18" class="text-gray-500" />
                </Link>
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">{{ emailTemplate.name }}</h1>
                    <p class="text-sm text-gray-500 mt-0.5">Edit email template content</p>
                </div>
            </div>

            <!-- Settings -->
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
                <h3 class="font-semibold text-gray-900 mb-4">Template Settings</h3>
                <form @submit.prevent="saveSettings" class="space-y-4">
                    <div class="flex items-center gap-3">
                        <input type="checkbox" v-model="settingsForm.is_enabled" id="enabled" class="rounded border-gray-300 text-primary-600" />
                        <label for="enabled" class="text-sm text-gray-700">Enable this email template</label>
                    </div>
                    <div class="flex justify-end">
                        <PrimaryButton :disabled="settingsForm.processing">Save Settings</PrimaryButton>
                    </div>
                </form>
            </div>

            <!-- Content Editor -->
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
                <h3 class="font-semibold text-gray-900 mb-4">Template Content</h3>
                <form @submit.prevent="saveContent" class="space-y-4">
                    <div>
                        <InputLabel value="Subject" required />
                        <TextInput v-model="contentForm.subject" type="text" class="mt-1.5" placeholder="Email subject" />
                        <InputError :message="contentForm.errors.subject" />
                    </div>
                    <div>
                        <InputLabel value="Body (HTML)" required />
                        <textarea v-model="contentForm.body" rows="15"
                            class="mt-1.5 w-full rounded-xl border border-[hsl(var(--border))] bg-white px-4 py-2.5 text-sm font-mono focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 resize-y" />
                        <InputError :message="contentForm.errors.body" />
                    </div>
                    <div class="flex justify-end">
                        <PrimaryButton :disabled="contentForm.processing">
                            <Loader2 v-if="contentForm.processing" :size="14" class="mr-1 animate-spin" />
                            Save Content
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { ArrowLeft, Loader2 } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import InputError from '@/components/ui/InputError.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';

interface EmailTemplate { id: number; name: string; slug: string; is_enabled?: boolean; langs?: { subject: string; body: string }[] }

const props = defineProps<{ emailTemplate: EmailTemplate }>();

const settingsForm = useForm({ is_enabled: props.emailTemplate.is_enabled ?? true });
const contentForm = useForm({
    subject: props.emailTemplate.langs?.[0]?.subject ?? '',
    body: props.emailTemplate.langs?.[0]?.body ?? '',
});

const saveSettings = () => settingsForm.put(route('email-templates.update-settings', props.emailTemplate.id));
const saveContent = () => contentForm.put(route('email-templates.update-content', props.emailTemplate.id));
</script>
