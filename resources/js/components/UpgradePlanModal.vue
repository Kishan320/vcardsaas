<template>
  <Dialog :open="isOpen" @update:open="onClose">
    <DialogContent class="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Upgrade Plan</DialogTitle>
        <DialogDescription>
          Choose the perfect plan for {{ companyName }}
        </DialogDescription>
      </DialogHeader>

      <!-- Billing Toggle -->
      <div class="flex items-center justify-center space-x-2 mb-6">
        <span :class="!isYearly ? 'font-semibold' : ''">Monthly</span>
        <Switch
          :checked="isYearly"
          @update:checked="setIsYearly"
        />
        <span :class="isYearly ? 'font-semibold' : ''">
          Yearly
          <Badge class="ml-2" variant="secondary">Save 20%</Badge>
        </span>
      </div>

      <!-- Plans Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div
          v-for="plan in filteredPlans"
          :key="plan.id"
          class="relative rounded-lg border p-6 transition-all cursor-pointer"
          :class="[
            selectedPlanId === plan.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200',
            plan.is_current ? 'border-green-500 bg-green-50' : '',
            'hover:border-blue-300'
          ]"
          @click="setSelectedPlanId(plan.id)"
        >
          <!-- Current Plan Badge -->
          <div v-if="plan.is_current" class="absolute top-2 right-2">
            <Badge class="bg-green-500 text-white">Current</Badge>
          </div>

          <!-- Plan Header -->
          <div class="text-center mb-4">
            <h3 class="text-lg font-semibold">{{ plan.name }}</h3>
            <div class="mt-2">
              <span class="text-3xl font-bold">${{ getPlanPrice(plan) }}</span>
              <span class="text-gray-500">/{{ isYearly ? 'year' : 'month' }}</span>
            </div>
            <p v-if="plan.description" class="text-sm text-gray-600 mt-2">
              {{ plan.description }}
            </p>
          </div>

          <!-- Plan Features -->
          <div class="space-y-2">
            <div
              v-for="feature in plan.features"
              :key="feature"
              class="flex items-center gap-2 text-sm"
            >
              <CheckCircle2 class="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>{{ feature }}</span>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="onClose">
          Cancel
        </Button>
        <Button
          @click="handleUpgrade"
          :disabled="!selectedPlanId || selectedPlanId === currentPlanId"
        >
          <CreditCard class="w-4 h-4 mr-2" />
          Upgrade Plan
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { CheckCircle2, CreditCard } from 'lucide-vue-next';

interface Plan {
  id: number;
  name: string;
  price: string | number;
  duration: string;
  description?: string;
  features?: string[];
  business?: number;
  max_users?: number;
  storage_limit?: string;
  is_active?: boolean;
  is_current?: boolean;
  is_default?: boolean;
}

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (planId: number, duration: string) => void;
  plans: Plan[];
  currentPlanId?: number;
  companyName: string;
}

const props = defineProps<UpgradePlanModalProps>();

const selectedPlanId = ref<number | null>(null);
const isYearly = ref(false);

// Filter plans based on billing period and duration
const filteredPlans = computed(() => {
  return props.plans.filter(plan => {
    const duration = plan.duration.toLowerCase();
    return isYearly.value ? duration === 'yearly' : duration === 'monthly';
  });
});

const getPlanPrice = (plan: Plan) => {
  const basePrice = typeof plan.price === 'string' ? parseFloat(plan.price) : plan.price;
  return isYearly.value ? (basePrice * 12 * 0.8).toFixed(2) : basePrice.toFixed(2);
};

const setSelectedPlanId = (planId: number) => {
  if (!props.plans.find(p => p.id === planId)?.is_current) {
    selectedPlanId.value = planId;
  }
};

const handleUpgrade = () => {
  if (selectedPlanId.value && selectedPlanId.value !== props.currentPlanId) {
    const duration = isYearly.value ? 'yearly' : 'monthly';
    props.onConfirm(selectedPlanId.value, duration);
  }
};

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    selectedPlanId.value = null;
  }
});
</script>

<style scoped>
.upgrade-plan-modal {
  /* Component styles are handled by Tailwind classes */
}
</style>
