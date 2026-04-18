<template>
    <Head :title="`Protected - ${bioLink.name}`" />
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
            <div class="text-center mb-6">
                <div class="mx-auto w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                    <Lock :size="24" class="text-purple-600" />
                </div>
                <h2 class="text-xl font-semibold text-gray-900">Protected Content</h2>
                <p class="text-sm text-gray-500 mt-2">
                    This bio link is password protected. Please enter the password to continue.
                </p>
            </div>
            <form @submit.prevent="submit" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        v-model="form.password"
                        type="password"
                        placeholder="Enter password"
                        required
                        autofocus
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400"
                    />
                    <p v-if="error" class="text-sm text-red-600 mt-1">{{ error }}</p>
                </div>
                <button
                    type="submit"
                    :disabled="form.processing || !form.password"
                    class="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                    {{ form.processing ? 'Verifying...' : 'Access Bio Link' }}
                </button>
            </form>
            <p class="text-xs text-gray-400 text-center mt-6">
                Don't have the password? Contact the owner of this bio link.
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';
import { Lock } from 'lucide-vue-next';

const props = defineProps<{
    bioLink: { id: number; name: string };
    error?: string;
}>();

const form = useForm({
    password: '',
    biolink_id: props.bioLink.id,
});

const submit = () => {
    form.post(window.location.href, { preserveScroll: true });
};
</script>
