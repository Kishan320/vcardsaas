<template>
    <PageTemplate title="Profile Settings" url="/profile">
        <!-- Tabs -->
        <div class="flex items-center gap-2 mb-6">
            <button
                @click="activeTab = 'profile'"
                class="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-md border transition-colors"
                :class="activeTab === 'profile' ? 'bg-white border-gray-300 text-gray-900 shadow-sm' : 'border-transparent text-gray-500 hover:text-gray-700'"
            >
                <User :size="14" /> Profile
            </button>
            <button
                @click="activeTab = 'password'"
                class="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-md border transition-colors"
                :class="activeTab === 'password' ? 'bg-white border-gray-300 text-gray-900 shadow-sm' : 'border-transparent text-gray-500 hover:text-gray-700'"
            >
                <Lock :size="14" /> Password
            </button>
        </div>

        <!-- Profile Section -->
        <div v-show="activeTab === 'profile'" class="rounded-lg border bg-white p-6 mb-6">
            <h3 class="text-base font-semibold text-gray-900 mb-1">Profile Information</h3>
            <p class="text-sm text-gray-500 mb-6">Update your account's profile information and email address</p>

            <form @submit.prevent="submitProfile" class="space-y-5">
                <!-- Avatar -->
                <div class="flex items-center gap-5">
                    <div class="relative">
                        <img
                            :src="avatarPreview || getAvatarUrl()"
                            :alt="user.name"
                            class="w-16 h-16 rounded-full object-cover border border-gray-200"
                            @error="(e) => ((e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`)"
                        />
                    </div>
                    <div>
                        <label
                            for="avatar-upload"
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-md bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                            <Camera :size="14" /> Change Avatar
                        </label>
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            class="hidden"
                            @change="onAvatarChange"
                        />
                        <p class="text-xs text-gray-400 mt-1">JPG, PNG, GIF up to 2MB</p>
                        <InputError :message="profileForm.errors.avatar" />
                    </div>
                </div>

                <!-- Name -->
                <div>
                    <InputLabel value="Name" required />
                    <TextInput v-model="profileForm.name" type="text" class="mt-1.5 w-full" autocomplete="name" />
                    <InputError :message="profileForm.errors.name" />
                </div>

                <!-- Email -->
                <div>
                    <InputLabel value="Email address" required />
                    <TextInput v-model="profileForm.email" type="email" class="mt-1.5 w-full" autocomplete="email" />
                    <InputError :message="profileForm.errors.email" />
                </div>

                <div>
                    <button
                        type="submit"
                        :disabled="profileForm.processing"
                        class="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 disabled:opacity-60 transition-colors"
                    >
                        <Loader2 v-if="profileForm.processing" :size="14" class="animate-spin" />
                        Save
                    </button>
                    <span v-if="profileSaved" class="ml-3 text-sm text-green-600">Saved.</span>
                </div>
            </form>
        </div>

        <!-- Password Section -->
        <div v-show="activeTab === 'password'" class="rounded-lg border bg-white p-6 mb-6">
            <h3 class="text-base font-semibold text-gray-900 mb-1">Update Password</h3>
            <p class="text-sm text-gray-500 mb-6">Ensure your account is using a long, random password to stay secure</p>

            <form @submit.prevent="submitPassword" class="space-y-5">
                <div>
                    <InputLabel value="Current password" />
                    <TextInput v-model="passwordForm.current_password" type="password" class="mt-1.5 w-full" autocomplete="current-password" />
                    <InputError :message="passwordForm.errors.current_password" />
                </div>
                <div>
                    <InputLabel value="New password" required />
                    <TextInput v-model="passwordForm.password" type="password" class="mt-1.5 w-full" autocomplete="new-password" />
                    <InputError :message="passwordForm.errors.password" />
                </div>
                <div>
                    <InputLabel value="Confirm password" required />
                    <TextInput v-model="passwordForm.password_confirmation" type="password" class="mt-1.5 w-full" autocomplete="new-password" />
                    <InputError :message="passwordForm.errors.password_confirmation" />
                </div>

                <div>
                    <button
                        type="submit"
                        :disabled="passwordForm.processing"
                        class="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 disabled:opacity-60 transition-colors"
                    >
                        <Loader2 v-if="passwordForm.processing" :size="14" class="animate-spin" />
                        Save
                    </button>
                    <span v-if="passwordSaved" class="ml-3 text-sm text-green-600">Saved.</span>
                </div>
            </form>
        </div>
    </PageTemplate>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useForm, usePage } from '@inertiajs/vue3';
import { User, Lock, Camera, Loader2 } from 'lucide-vue-next';
import PageTemplate from '@/components/page-template.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import InputError from '@/components/ui/InputError.vue';
import TextInput from '@/components/ui/TextInput.vue';
import type { PageProps } from '@/types';

const page = usePage<PageProps>();
const user = page.props.auth.user;

const activeTab = ref<'profile' | 'password'>('profile');
const avatarPreview = ref<string | null>(null);
const profileSaved = ref(false);
const passwordSaved = ref(false);

const profileForm = useForm({
    name: user.name ?? '',
    email: user.email ?? '',
    avatar: null as File | null,
    _method: 'PATCH',
});

const passwordForm = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
});

function getAvatarUrl() {
    if (user.avatar) {
        const base = (window as any).appSettings?.baseUrl || window.location.origin;
        return `${base}/storage/${user.avatar}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`;
}

function onAvatarChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    profileForm.avatar = file;
    avatarPreview.value = URL.createObjectURL(file);
}

function submitProfile() {
    profileForm.post(route('profile.update'), {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: () => {
            profileSaved.value = true;
            setTimeout(() => (profileSaved.value = false), 3000);
        },
    });
}

function submitPassword() {
    passwordForm.put(route('password.update'), {
        preserveScroll: true,
        onSuccess: () => {
            passwordForm.reset();
            passwordSaved.value = true;
            setTimeout(() => (passwordSaved.value = false), 3000);
        },
        onError: () => {
            if (passwordForm.errors.password) passwordForm.reset('password', 'password_confirmation');
            if (passwordForm.errors.current_password) passwordForm.reset('current_password');
        },
    });
}
</script>
