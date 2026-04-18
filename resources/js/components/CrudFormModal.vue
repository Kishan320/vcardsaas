<template>
  <Dialog :open="isOpen" @update:open="onClose">
    <DialogContent :class="cn('max-w-2xl', formConfig.modalSize)">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription v-if="description">
          {{ description }}
        </DialogDescription>
      </DialogHeader>

      <ScrollArea class="max-h-[60vh]">
        <form @submit="handleSubmit" class="space-y-6 p-6">
          <div
            :class="cn(
              'grid gap-4',
              formConfig.layout === 'grid' ? 'grid-cols-1 md:grid-cols-2' : '',
              formConfig.columns === 1 ? 'grid-cols-1' : '',
              formConfig.columns === 2 ? 'grid-cols-1 md:grid-cols-2' : '',
              formConfig.columns === 3 ? 'grid-cols-1 md:grid-cols-3' : '',
              formConfig.layout === 'flex' ? 'flex flex-col space-y-4' : ''
            )"
          >
            <FormField
              v-for="field in formConfig.fields"
              :key="field.name"
              :field="field"
              :value="formData[field.name]"
              :error="errors[field.name]"
              :disabled="mode === 'view'"
              @update:value="updateFieldValue"
            />
          </div>

          <!-- Price Summary -->
          <div
            v-if="formConfig.priceSummary && formConfig.priceSummary.quantityFieldName"
            class="border-t pt-4 space-y-2"
          >
            <div class="flex justify-between text-sm">
              <span>Unit Price:</span>
              <span>${{ formConfig.priceSummary.unitPrice.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span>Quantity:</span>
              <span>{{ formData[formConfig.priceSummary.quantityFieldName] || 0 }}</span>
            </div>
            <div class="flex justify-between text-sm font-semibold">
              <span>Total:</span>
              <span>${{ calculateTotal().toFixed(2) }}</span>
            </div>
          </div>
        </form>
      </ScrollArea>

      <DialogFooter class="p-6 pt-0">
        <Button
          type="button"
          variant="outline"
          @click="onClose"
          :disabled="processing"
        >
          {{ mode === 'view' ? 'Close' : 'Cancel' }}
        </Button>
        <Button
          v-if="mode !== 'view'"
          type="submit"
          :disabled="processing"
          @click="handleSubmit"
        >
          {{ processing ? 'Saving...' : (mode === 'create' ? 'Create' : 'Update') }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted } from 'vue';
import { useTranslation } from 'vue-i18n';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { FormField } from '@/types/crud';
import FormFieldComponent from './FormField.vue';

interface CrudFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  formConfig: {
    fields: FormField[];
    modalSize?: string;
    columns?: number;
    layout?: 'grid' | 'flex' | 'default';
    priceSummary?: {
      unitPrice: number;
      quantity: number;
      quantityFieldName?: string;
    };
  };
  initialData?: any;
  title: string;
  mode: 'create' | 'edit' | 'view';
  description?: string;
}

const props = withDefaults(defineProps<CrudFormModalProps>(), {
  initialData: () => ({}),
  formConfig: () => ({
    fields: [],
    modalSize: 'max-w-2xl',
    columns: 1,
    layout: 'grid'
  })
});

const { t } = useTranslation();

const formData = reactive({});
const errors = ref({});
const processing = ref(false);

const calculateTotal = computed(() => {
  if (!props.formConfig.priceSummary) return 0;
  
  const quantity = formData[props.formConfig.priceSummary.quantityFieldName || 'quantity'] || 0;
  return props.formConfig.priceSummary.unitPrice * quantity;
});

const updateFieldValue = (fieldName: string, value: any) => {
  formData[fieldName] = value;
  
  // Clear error when user starts typing
  if (errors.value[fieldName]) {
    errors.value[fieldName] = '';
  }
};

const handleSubmit = async (event?: Event) => {
  if (event) {
    event.preventDefault();
  }

  processing.value = true;
  errors.value = {};

  try {
    await props.onSubmit(formData);
  } catch (error: any) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors;
    }
  } finally {
    processing.value = false;
  }
};

const initializeForm = () => {
  // Clear form data
  Object.keys(formData).forEach(key => delete formData[key]);
  
  // Set initial values
  props.formConfig.fields.forEach(field => {
    if (props.initialData[field.name] !== undefined) {
      formData[field.name] = props.initialData[field.name];
    } else if (field.defaultValue !== undefined) {
      formData[field.name] = field.defaultValue;
    } else {
      formData[field.name] = field.type === 'checkbox' ? false : '';
    }
  });
};

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    initializeForm();
    errors.value = {};
  }
});

watch(() => props.initialData, () => {
  if (props.isOpen) {
    initializeForm();
  }
}, { deep: true });

onMounted(() => {
  if (props.isOpen) {
    initializeForm();
  }
});
</script>

<style scoped>
.crud-form-modal {
  /* Component styles are handled by Tailwind classes */
}
</style>
