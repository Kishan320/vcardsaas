<template>
  <div class="relative">
    <CalendarIcon class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
    <Input
      type="date"
      :model-value="dateValue"
      @update:model-value="handleDateChange"
      :class="['pl-9 w-[240px]', $attrs.class]"
      :disabled="disabled"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-vue-next';
import Input from './Input.vue';

const props = defineProps<{
  selected?: Date;
  placeholder?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', date: Date | undefined): void;
  (e: 'change', date: Date | undefined): void;
}>();

const dateValue = ref<string>(props.selected ? format(props.selected, 'yyyy-MM-dd') : '');

watch(() => props.selected, (newVal) => {
  if (newVal) {
    dateValue.value = format(newVal, 'yyyy-MM-dd');
  } else {
    dateValue.value = '';
  }
});

const handleDateChange = (val: string | number) => {
  const dateStr = val.toString();
  dateValue.value = dateStr;
  
  if (dateStr) {
    const newDate = new Date(dateStr);
    emit('select', newDate);
    emit('change', newDate);
  } else {
    emit('select', undefined);
    emit('change', undefined);
  }
};
</script>
