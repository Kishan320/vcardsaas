<template>
  <div class="form-field space-y-2">
    <Label v-if="field.label" :for="field.name">
      {{ field.label }}
      <span v-if="field.required" class="text-red-500 ml-1">*</span>
    </Label>

    <!-- Text Input -->
    <Input
      v-if="field.type === 'text' || field.type === 'email' || field.type === 'password' || field.type === 'number'"
      :id="field.name"
      :type="field.type"
      :value="value"
      :placeholder="field.placeholder"
      :disabled="disabled"
      :class="cn('w-full', field.className, error && 'border-red-500')"
      @input="updateValue($event.target.value)"
    />

    <!-- Textarea -->
    <Textarea
      v-else-if="field.type === 'textarea'"
      :id="field.name"
      :value="value"
      :placeholder="field.placeholder"
      :disabled="disabled"
      :rows="field.rows || 3"
      :class="cn('w-full', field.className, error && 'border-red-500')"
      @input="updateValue($event.target.value)"
    />

    <!-- Select -->
    <Select
      v-else-if="field.type === 'select'"
      :value="value"
      :disabled="disabled"
      @update:value="updateValue"
    >
      <SelectTrigger :class="cn('w-full', field.className, error && 'border-red-500')">
        <SelectValue :placeholder="field.placeholder" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          v-for="option in field.options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </SelectItem>
      </SelectContent>
    </Select>

    <!-- Radio Group -->
    <RadioGroup
      v-else-if="field.type === 'radio'"
      :value="value"
      :disabled="disabled"
      @update:value="updateValue"
    >
      <div class="flex flex-col space-y-2">
        <div
          v-for="option in field.options"
          :key="option.value"
          class="flex items-center space-x-2"
        >
          <RadioGroupItem :id="`${field.name}-${option.value}` :value="option.value" />
          <Label :for="`${field.name}-${option.value}`">
            {{ option.label }}
          </Label>
        </div>
      </div>
    </RadioGroup>

    <!-- Checkbox -->
    <div v-else-if="field.type === 'checkbox'" class="flex items-center space-x-2">
      <Checkbox
        :id="field.name"
        :checked="value"
        :disabled="disabled"
        @update:checked="updateValue"
      />
      <Label :for="field.name" v-if="field.label">
        {{ field.label }}
      </Label>
    </div>

    <!-- Switch -->
    <div v-else-if="field.type === 'switch'" class="flex items-center space-x-2">
      <Switch
        :id="field.name"
        :checked="value"
        :disabled="disabled"
        @update:checked="updateValue"
      />
      <Label :for="field.name" v-if="field.label">
        {{ field.label }}
      </Label>
    </div>

    <!-- Media Picker -->
    <MediaPicker
      v-else-if="field.type === 'media'"
      :value="value"
      :label="field.label"
      :placeholder="field.placeholder"
      :disabled="disabled"
      :accept="field.accept"
      @change="updateValue"
    />

    <!-- Multi Select -->
    <MultiSelectField
      v-else-if="field.type === 'multiselect'"
      :value="value"
      :options="field.options"
      :placeholder="field.placeholder"
      :disabled="disabled"
      @change="updateValue"
    />

    <!-- Date Input -->
    <Input
      v-else-if="field.type === 'date'"
      :id="field.name"
      type="date"
      :value="value"
      :disabled="disabled"
      :class="cn('w-full', field.className, error && 'border-red-500')"
      @input="updateValue($event.target.value)"
    />

    <!-- Time Input -->
    <Input
      v-else-if="field.type === 'time'"
      :id="field.name"
      type="time"
      :value="value"
      :disabled="disabled"
      :class="cn('w-full', field.className, error && 'border-red-500')"
      @input="updateValue($event.target.value)"
    />

    <!-- Error Message -->
    <p v-if="error" class="text-sm text-red-500">
      {{ error }}
    </p>

    <!-- Help Text -->
    <p v-if="field.helpText" class="text-sm text-gray-500">
      {{ field.helpText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import MediaPicker from '@/components/MediaPicker.vue';
import MultiSelectField from '@/components/multi-select-field.vue';
import { cn } from '@/lib/utils';
import type { FormField } from '@/types/crud';

interface FormFieldProps {
  field: FormField;
  value: any;
  error?: string;
  disabled?: boolean;
  onUpdate: (value: any) => void;
}

const props = defineProps<FormFieldProps>();

const updateValue = (newValue: any) => {
  props.onUpdate(newValue);
};
</script>

<style scoped>
.form-field {
  /* Component styles are handled by Tailwind classes */
}
</style>
