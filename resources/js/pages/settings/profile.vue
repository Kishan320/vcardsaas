<template>
    <AppLayout>
        <Head title="Profile Settings" />
        <FlashMessage />
        <div class="max-w-xl space-y-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Profile Settings</h1>
                <p class="text-sm text-gray-500 mt-0.5">Update your profile information</p>
            </div>
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
                <form @submit.prevent="submit" class="space-y-4">
                    <div>
                        <InputLabel value="Name" />
                        <TextInput v-model="form.name" type="text" class="mt-1.5" autocomplete="name" />
                        <InputError :message="form.errors.name" />
                    </div>
                    <div>
                        <InputLabel value="Email" />
                        <TextInput v-model="form.email" type="email" class="mt-1.5" autocomplete="email" />
                        <InputError :message="form.errors.email" />
                    </div>
                    <div class="flex justify-end">
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
import { Head, useForm, usePage } from '@inertiajs/vue3';
import { Loader2 } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import InputError from '@/components/ui/InputError.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';
import type { PageProps } from '@/types';

const page = usePage<PageProps>();
const user = page.props.auth.user;

const form = useForm({
    name: user.name ?? '',
    email: user.email ?? '',
});

const submit = () => {
    form.patch(route('profile.update'));
};
</script>
