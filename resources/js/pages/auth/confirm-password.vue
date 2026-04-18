<template>
    <GuestLayout>
        <Head title="Confirm Password" />

        <div class="mb-8">
            <h1 class="text-2xl font-bold text-[hsl(var(--foreground))]">Confirm password</h1>
            <p class="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                This is a secure area. Please confirm your password to continue.
            </p>
        </div>

        <Form @submit="submit" class="space-y-5" v-slot="{ errors }">
            <div>
                <InputLabel value="Password" required />
                <div class="relative mt-1.5">
                    <span class="absolute inset-y-0 left-3 flex items-center text-[hsl(var(--muted-foreground))]">
                        <Lock :size="16" />
                    </span>
                    <Field name="password" :rules="passwordSchema" v-model="form.password">
                        <TextInput
                            v-model="form.password"
                            type="password"
                            class="!pl-9"
                            :has-error="!!(errors.password || form.errors.password)"
                            autocomplete="current-password"
                            placeholder="••••••••"
                        />
                    </Field>
                </div>
                <ErrorMessage name="password" class="mt-1.5 text-sm text-red-600" />
                <InputError :message="form.errors.password" />
            </div>

            <PrimaryButton class="w-full !py-3" :disabled="form.processing">
                <Loader2 v-if="form.processing" :size="16" class="mr-2 animate-spin" />
                {{ form.processing ? 'Confirming…' : 'Confirm' }}
            </PrimaryButton>
        </Form>
    </GuestLayout>
</template>

<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { Lock, Loader2 } from 'lucide-vue-next';
import GuestLayout from '@/layouts/GuestLayout.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import InputError from '@/components/ui/InputError.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';

const form = useForm({ password: '' });
const passwordSchema = yup.string().required('Password is required');
const submit = () => form.post(route('password.confirm'), { onFinish: () => form.reset('password') });
</script>
