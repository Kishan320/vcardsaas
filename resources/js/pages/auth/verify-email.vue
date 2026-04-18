<template>
    <GuestLayout>
        <Head title="Email Verification" />

        <div class="mb-8 text-center">
            <div class="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MailCheck :size="28" class="text-white" />
            </div>
            <h1 class="text-2xl font-bold text-[hsl(var(--foreground))]">Verify your email</h1>
            <p class="mt-2 text-sm text-[hsl(var(--muted-foreground))] max-w-sm mx-auto">
                Thanks for signing up! Please verify your email address by clicking the link we sent you.
            </p>
        </div>

        <div
            v-if="status === 'verification-link-sent'"
            class="mb-5 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700 border border-green-200"
        >
            <CheckCircle :size="16" class="shrink-0" />
            A new verification link has been sent to your email address.
        </div>

        <div class="flex flex-col gap-3">
            <form @submit.prevent="resend">
                <PrimaryButton class="w-full !py-3" :disabled="resendForm.processing">
                    <Loader2 v-if="resendForm.processing" :size="16" class="mr-2 animate-spin" />
                    {{ resendForm.processing ? 'Sending…' : 'Resend verification email' }}
                </PrimaryButton>
            </form>

            <Link
                :href="route('logout')"
                method="post"
                as="button"
                class="w-full py-2.5 text-sm text-center text-gray-500 hover:text-gray-700 transition-colors"
            >
                Sign out
            </Link>
        </div>
    </GuestLayout>
</template>

<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { MailCheck, CheckCircle, Loader2 } from 'lucide-vue-next';
import GuestLayout from '@/layouts/GuestLayout.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';

defineProps<{ status?: string }>();

const resendForm = useForm({});
const resend = () => resendForm.post(route('verification.send'));
</script>
