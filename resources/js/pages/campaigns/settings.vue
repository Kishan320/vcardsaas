<template>
    <AppLayout>
        <Head title="Campaign Settings" />
        <FlashMessage />
        <div class="space-y-6">
            <h1 class="text-2xl font-bold text-gray-900">Campaign Settings</h1>
            <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-6 max-w-2xl space-y-4">
                <h3 class="font-semibold text-gray-900">Pricing Tiers</h3>
                <div v-for="(tier, i) in form.pricing_tiers" :key="i" class="grid grid-cols-3 gap-3 p-3 border border-gray-100 rounded-xl">
                    <div>
                        <InputLabel value="Min Days" />
                        <TextInput v-model="tier.min_days" type="number" class="mt-1" />
                    </div>
                    <div>
                        <InputLabel value="Max Days" />
                        <TextInput v-model="tier.max_days" type="number" class="mt-1" />
                    </div>
                    <div>
                        <InputLabel value="Price/Day ($)" />
                        <TextInput v-model="tier.per_day_price" type="number" step="0.01" class="mt-1" />
                    </div>
                </div>
                <button @click="addTier" class="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                    <Plus :size="14" /> Add Tier
                </button>
                <div class="flex justify-end pt-2">
                    <PrimaryButton @click="save" :disabled="saving">
                        <Loader2 v-if="saving" :size="14" class="mr-1 animate-spin" />
                        Save Settings
                    </PrimaryButton>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { Head, router } from '@inertiajs/vue3';
import { Plus, Loader2 } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';

const props = defineProps<{ campaignSettings?: any }>();
const saving = ref(false);
const form = ref({ pricing_tiers: props.campaignSettings?.pricing_tiers ?? [{ min_days: 1, max_days: 7, per_day_price: 10 }] });
const addTier = () => form.value.pricing_tiers.push({ min_days: '', max_days: '', per_day_price: '' });
const save = () => {
    saving.value = true;
    router.post(route('campaigns.settings.update'), form.value, { onFinish: () => { saving.value = false; } });
};
</script>
