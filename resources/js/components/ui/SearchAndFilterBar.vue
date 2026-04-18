<template>
  <div class="w-full">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <form @submit.prevent="onSearch" class="flex gap-2">
          <div class="relative w-64">
            <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              :placeholder="$t('Search...')"
              :model-value="searchTerm"
              @update:model-value="val => $emit('update:searchTerm', val)"
              class="w-full pl-9"
            />
          </div>
          <Button type="submit" size="sm">
            <Search class="h-4 w-4 mr-1.5" />
            {{ $t('Search') }}
          </Button>
          <Button 
            v-if="searchTerm"
            type="button" 
            variant="outline" 
            size="sm" 
            @click="clearSearch"
          >
            {{ $t('Clear') }}
          </Button>
        </form>
        
        <div v-if="filters.length > 0" class="ml-2">
          <Button
            :variant="hasActiveFilters ? 'default' : 'outline'"
            size="sm"
            class="h-8 px-2 py-1"
            @click="$emit('update:showFilters', !showFilters)"
          >
            <FilterIcon class="h-3.5 w-3.5 mr-1.5" />
            {{ (showFilters || hasActiveFilters) ? $t('Hide Filters') : $t('Filters') }}
            <span v-if="hasActiveFilters" class="ml-1 bg-primary-foreground text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {{ activeFilterCount }}
            </span>
          </Button>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <template v-if="showViewToggle && $emit('viewChange')">
          <div class="border rounded-md p-0.5 mr-2">
            <Button 
              size="sm" 
              :variant="activeView === 'list' ? 'default' : 'ghost'"
              class="h-7 px-2"
              @click="$emit('viewChange', 'list')"
            >
              <List class="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              :variant="activeView === 'grid' ? 'default' : 'ghost'"
              class="h-7 px-2"
              @click="$emit('viewChange', 'grid')"
            >
              <LayoutGrid class="h-4 w-4" />
            </Button>
          </div>
        </template>
        
        <Label class="text-xs text-muted-foreground">{{ $t('Per Page:') }}</Label>
        <Select
          :model-value="currentPerPage"
          @update:model-value="val => $emit('update:currentPerPage', val)"
        >
          <SelectTrigger class="w-16 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="option in perPageOptions" :key="option" :value="option.toString()">
              {{ option }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div v-if="(showFilters || hasActiveFilters) && filters.length > 0" class="w-full mt-3 p-4 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-md">
      <div class="flex flex-wrap gap-4 items-end">
        <div v-for="filter in filters" :key="filter.name" class="space-y-2">
          <Label>{{ filter.label }}</Label>
          <template v-if="filter.type === 'select' && filter.options">
            <Select
              :model-value="filter.value as string"
              @update:model-value="filter.onChange"
            >
              <SelectTrigger class="w-40">
                <SelectValue :placeholder="$t('All {label}', { label: filter.label })" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="option in filter.options" :key="option.value" :value="option.value">
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </template>
          <template v-if="filter.type === 'date'">
            <DatePicker
              :selected="filter.value as Date | undefined"
              @select="filter.onChange"
              @change="filter.onChange"
            />
          </template>
        </div>

        <div class="flex gap-2">
          <Button
            v-if="$emit('applyFilters')"
            variant="default"
            size="sm"
            class="h-9"
            @click="$emit('applyFilters')"
          >
            {{ $t('Apply Filters') }}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            class="h-9"
            @click="$emit('resetFilters')"
            :disabled="!hasActiveFilters"
          >
            {{ $t('Reset Filters') }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from './button';
import Input from './Input.vue';
import Label from './Label.vue';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import DatePicker from './DatePicker.vue';
import { Filter as FilterIcon, Search, List, LayoutGrid } from 'lucide-vue-next';
import { router } from '@inertiajs/vue3';

interface FilterOption {
  name: string;
  label: string;
  type: 'select' | 'date';
  options?: { value: string; label: string }[];
  value: string | Date | undefined;
  onChange: (value: any) => void;
}

const props = withDefaults(defineProps<{
  searchTerm: string;
  filters?: FilterOption[];
  showFilters: boolean;
  hasActiveFilters: boolean;
  activeFilterCount: number;
  perPageOptions?: number[];
  currentPerPage: string;
  showViewToggle?: boolean;
  activeView?: 'list' | 'grid';
}>(), {
  filters: () => [],
  perPageOptions: () => [10, 25, 50, 100],
  showViewToggle: false,
  activeView: 'list',
});

const emit = defineEmits<{
  (e: 'update:searchTerm', value: string): void;
  (e: 'update:showFilters', value: boolean): void;
  (e: 'update:currentPerPage', value: string): void;
  (e: 'onSearch', event: Event): void;
  (e: 'resetFilters'): void;
  (e: 'applyFilters'): void;
  (e: 'viewChange', view: 'list' | 'grid'): void;
}>();

const onSearch = (e: Event) => {
  emit('onSearch', e);
};

const clearSearch = () => {
  emit('update:searchTerm', '');
  const url = new URL(window.location.href);
  const path = url.pathname;
  router.get(path, { page: 1 }, { preserveState: true, preserveScroll: true });
};
</script>
