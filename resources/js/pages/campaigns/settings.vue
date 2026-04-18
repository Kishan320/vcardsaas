<template>
    <AppLayout>
        <Head title="Campaign Settings" />
        <FlashMessage />

        <div class="space-y-6">
            <!-- Header -->
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Campaign Settings</h1>
                <p class="text-sm text-gray-500 mt-0.5">Configure pricing tiers for campaign duration</p>
            </div>

            <div class="bg-white border border-gray-100 rounded-2xl shadow-card p-6 max-w-2xl">
                <div class="flex items-center justify-between mb-5">
                    <div>
                        <h3 class="font-semibold text-gray-900">Pricing Tiers Settings</h3>
                        <p class="text-xs text-gray-500 mt-0.5">Configure multiple pricing tiers based on campaign duration</p>
                    </div>
                    <PrimaryButton @click="save" :disabled="saving">
                        <Loader2 v-if="saving" :size="14" class="mr-1 animate-spin" />
                        <Save v-else :size="14" class="mr-1" />
                        Save Changes
                    </PrimaryButton>
                </div>

                <!-- Tiers -->
                <div class="space-y-3">
                    <div v-if="!form.pricing_tiers.length" class="text-sm text-gray-400 text-center py-6 border border-dashed border-gray-200 rounded-xl">
                        No pricing tiers configured. Add at least one tier.
                    </div>

                    <div v-for="(tier, i) in form.pricing_tiers" :key="i"
                        class="grid grid-cols-3 gap-3 p-4 border border-gray-100 rounded-xl bg-gray-50 relative">
                        <span class="absolute -top-2.5 left-3 text-xs font-semibold text-gray-400 bg-white px-1.5">Tier {{ i + 1 }}</span>
                        <div>
                            <InputLabel value="Min Days" />
                            <TextInput v-model="tier.min_days" type="number" min="1" class="mt-1" placeholder="1" />
                        </div>
                        <div>
                            <InputLabel value="Max Days" />
                            <TextInput v-model="tier.max_days" type="number" min="1" class="mt-1" placeholder="30" />
                        </div>
                        <div class="relative">
                            <InputLabel value="Price / Day ($)" />
                            <TextInput v-model="tier.per_day_price" type="number" step="0.01" min="0" class="mt-1" placeholder="10.00" />
                            <button v-if="form.pricing_tiers.length > 1" @click="removeTier(i)"
                                class="absolute -top-1 -right-1 w-5 h-5 bg-red-100 text-red-500 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors">
                                <X :size="10" />
                            </button>
                        </div>
                    </div>
                </div>

                <button @click="addTier" class="mt-4 text-sm text-primary font-medium flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                    <Plus :size="14" /> Add Pricing Tier
                </button>
            </div>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Head, router } from '@inertiajs/vue3';
import { Plus, Loader2, Save, X } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import InputLabel from '@/components/ui/InputLabel.vue';
import TextInput from '@/components/ui/TextInput.vue';
import PrimaryButton from '@/components/ui/PrimaryButton.vue';

interface PricingTier { min_days: number | string; max_days: number | string; per_day_price: number | string; }

const props = defineProps<{ settings?: { pricing_tiers?: PricingTier[] } }>();

const saving = ref(false);
const form = ref({
    pricing_tiers: props.settings?.pricing_tiers?.length
        ? props.settings.pricing_tiers
        : [
            { min_days: 1, max_days: 30, per_day_price: 15.00 },
            { min_days: 31, max_days: 90, per_day_price: 12.00 },
            { min_days: 91, max_days: 365, per_day_price: 10.00 },
        ] as PricingTier[],
});

const addTier = () => form.value.pricing_tiers.push({ min_days: '', max_days: '', per_day_price: '' });
const removeTier = (i: number) => form.value.pricing_tiers.splice(i, 1);

const save = () => {
    saving.value = true;
    router.post(route('campaigns.settings.update'), form.value, {
        onFinish: () => { saving.value = false; },
    });
};
</script>
