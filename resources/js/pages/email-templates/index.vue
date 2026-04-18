<template>
    <AppLayout>
        <Head title="Email Templates" />
        <FlashMessage />
        <div class="space-y-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Email Templates</h1>
                <p class="text-sm text-gray-500 mt-0.5">Manage system email templates</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link v-for="template in emailTemplates" :key="template.id" :href="route('email-templates.show', template.id)"
                    class="bg-white border border-gray-100 rounded-2xl shadow-card p-5 hover:shadow-card-hover transition-all card-hover">
                    <div class="flex items-start gap-3 mb-3">
                        <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Mail :size="18" class="text-blue-600" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <h3 class="font-semibold text-gray-900 truncate">{{ template.name }}</h3>
                            <p class="text-xs text-gray-500 mt-0.5">{{ template.slug }}</p>
                        </div>
                    </div>
                    <p v-if="template.subject" class="text-sm text-gray-600 truncate">{{ template.subject }}</p>
                    <div class="flex items-center justify-between mt-3">
                        <span class="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                            {{ template.type ?? 'system' }}
                        </span>
                        <span class="text-xs text-gray-400">Edit →</span>
                    </div>
                </Link>
                <div v-if="!emailTemplates?.length" class="col-span-full bg-white border border-gray-100 rounded-2xl shadow-card p-12 text-center text-sm text-gray-400">
                    No email templates found
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Mail } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';

interface EmailTemplate { id: number; name: string; slug: string; subject?: string; type?: string }

defineProps<{ emailTemplates: EmailTemplate[] }>();
</script>
