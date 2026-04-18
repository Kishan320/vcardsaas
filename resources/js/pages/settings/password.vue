<template>
    <AppLayout>
        <Head title="Change Password" />
        <FlashMessage />
        <div class="max-w-xl space-y-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Change Password</h1>
                <p class="text-sm text-gray-500 mt-0.5">Update your account password</p>
            </div>
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
                <form @submit.prevent="submit" class="space-y-4">
                    <div>
                        <InputLabel value="Current Password" />
                        <TextInput v-model="form.current_password" type="password" class="mt-1.5" autocomplete="current-password" />
                        <InputError :message="form.errors.current_password" />
                    </div>
                    <div>
                        <InputLabel value="New Password" />
                        <TextInput v-model="form.password" type="password" class="mt-1.5" autocomplete="new-password" />
                        <InputError :message="form.errors.password" />
                    </div>
                    <div>
                        <InputLabel value="Confirm New Password" />
                        <TextInput v-model="form.password_confirmation" type="password" class="mt-1.5" autocomplete="new-password" />
                        <InputError :message="form.errors.password_confirmation" />
                    </div>
                    <div class="flex justify-end">
                        <PrimaryButton :disabled="form.processing">
                            <Loader2 v-if="form.processing" :size="14" class="mr-1 animate-spin" />
                            Update Password
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';
import { Loader2 } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import InputError from '@/components/ui/InputError.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';

const form = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
});

const submit = () => {
    form.put(route('password.update'), {
        onSuccess: () => form.reset(),
    });
};
</script>
