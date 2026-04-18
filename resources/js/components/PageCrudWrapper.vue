<template>
  <PageTemplate 
    :title="title || config.entity.name" 
    :url="url"
    :actions="filteredActions"
    :breadcrumbs="pageBreadcrumbs"
  >
    <div class="space-y-4">
      <!-- Search and Filter Bar -->
      <SearchAndFilterBar
        :filters="config.filters || []"
        :search-placeholder="`Search ${config.entity.name}...`"
        @filter="handleFilter"
        @search="handleSearch"
      />

      <!-- Data Table -->
      <CrudTable
        :columns="config.table.columns"
        :actions="config.table.actions"
        :data="data"
        :from="from"
        :on-action="handleAction"
        :sort-field="sortField"
        :sort-direction="sortDirection"
        :on-sort="handleSort"
        :status-colors="config.table.statusColors"
        :permissions="permissions"
        :entity-permissions="config.entity.permissions"
        :show-actions-as-icons="config.table.showActionsAsIcons"
        :context="pageProps"
      />

      <!-- Pagination -->
      <Pagination
        v-if="meta?.last_page > 1"
        :current-page="meta?.current_page || 1"
        :total-pages="meta?.last_page || 1"
        :from="from"
        :to="to"
        :total="meta?.total || 0"
        @page-change="handlePageChange"
      />

      <!-- Modals -->
      <CrudFormModal
        v-if="showFormModal"
        :is-open="showFormModal"
        :on-close="closeFormModal"
        :on-submit="handleFormSubmit"
        :form-config="config.form"
        :initial-data="editingItem"
        :title="editingItem ? `Edit ${config.entity.name}` : `Create ${config.entity.name}`"
        :mode="editingItem ? 'edit' : 'create'"
      />

      <CrudDeleteModal
        v-if="showDeleteModal"
        :is-open="showDeleteModal"
        :on-close="closeDeleteModal"
        :on-confirm="handleDelete"
        :item-name="deletingItem?.name || ''"
        :entity-name="config.entity.name"
      />
    </div>
  </PageTemplate>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { router, usePage } from '@inertiajs/vue3';
import { hasPermission } from '@/utils/authorization';
import { toast } from '@/components/custom-toast';
import type { CrudConfig, PageAction, BreadcrumbItem } from '@/types';
import PageTemplate from '@/components/page-template.vue';
import CrudTable from '@/components/CrudTable.vue';
import CrudFormModal from '@/components/CrudFormModal.vue';
import CrudDeleteModal from '@/components/CrudDeleteModal.vue';
import SearchAndFilterBar from '@/components/ui/search-and-filter-bar.vue';
import Pagination from '@/components/ui/pagination.vue';

export interface CrudButton {
  label: string;
  icon?: any;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick?: () => void;
  permission?: string;
  className?: string;
  showAddButton?: boolean;
}

interface PageCrudWrapperProps {
  config: CrudConfig;
  title?: string;
  url: string;
  buttons?: CrudButton[];
  breadcrumbs?: BreadcrumbItem[];
}

const props = withDefaults(defineProps<PageCrudWrapperProps>(), {
  buttons: () => []
});

const { auth, ...pageProps } = usePage().props as any;
const permissions = auth?.permissions || [];

// State
const showFormModal = ref(false);
const showDeleteModal = ref(false);
const editingItem = ref(null);
const deletingItem = ref(null);
const sortField = ref('');
const sortDirection = ref<'asc' | 'desc'>('asc');
const searchTerm = ref('');
const filters = ref({});

// Get data from page props using entity name
const data = computed(() => pageProps[props.config.entity.plural] || []);
const meta = computed(() => pageProps.meta || {});
const from = computed(() => meta.value?.from || 0);
const to = computed(() => meta.value?.to || 0);

// Generate default breadcrumbs if not provided
const defaultBreadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: route('dashboard') },
  { title: props.title || props.config.entity.name }
];

const pageBreadcrumbs = computed(() => props.breadcrumbs || defaultBreadcrumbs);

// Filter buttons based on permissions
const filteredActions = computed((): PageAction[] => {
  const actions: PageAction[] = [];

  // Add create button if user has permission
  if (hasPermission(permissions, props.config.entity.permissions?.create || '')) {
    actions.push({
      label: `Add ${props.config.entity.name}`,
      icon: 'PlusIcon',
      variant: 'default',
      onClick: () => openCreateModal()
    });
  }

  // Add custom buttons
  props.buttons.forEach(button => {
    if (!button.permission || hasPermission(permissions, button.permission)) {
      actions.push({
        label: button.label,
        icon: button.icon,
        variant: button.variant,
        onClick: button.onClick
      });
    }
  });

  return actions;
});

// Handlers
const handleAction = (action: string, item: any) => {
  switch (action) {
    case 'edit':
      openEditModal(item);
      break;
    case 'delete':
      openDeleteModal(item);
      break;
    default:
      const customAction = props.config.table.actions.find(a => a.key === action);
      if (customAction?.onClick) {
        customAction.onClick(item);
      }
  }
};

const handleSort = (field: string) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortDirection.value = 'asc';
  }
  
  loadData();
};

const handleSearch = (term: string) => {
  searchTerm.value = term;
  loadData();
};

const handleFilter = (filterData: any) => {
  filters.value = filterData;
  loadData();
};

const handlePageChange = (page: number) => {
  router.get(props.url, {
    page,
    sort: sortField.value,
    direction: sortDirection.value,
    search: searchTerm.value,
    ...filters.value
  }, { preserveState: true });
};

// Modal handlers
const openCreateModal = () => {
  editingItem.value = null;
  showFormModal.value = true;
};

const openEditModal = (item: any) => {
  editingItem.value = item;
  showFormModal.value = true;
};

const closeFormModal = () => {
  showFormModal.value = false;
  editingItem.value = null;
};

const openDeleteModal = (item: any) => {
  deletingItem.value = item;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  deletingItem.value = null;
};

// Form submission
const handleFormSubmit = async (formData: any) => {
  try {
    if (editingItem.value) {
      await router.put(route(`${props.config.entity.route}.update`, editingItem.value.id), formData);
      toast.success(`${props.config.entity.name} updated successfully`);
    } else {
      await router.post(route(`${props.config.entity.route}.store`), formData);
      toast.success(`${props.config.entity.name} created successfully`);
    }
    closeFormModal();
    loadData();
  } catch (error) {
    console.error('Form submission error:', error);
  }
};

// Delete handler
const handleDelete = async () => {
  try {
    await router.delete(route(`${props.config.entity.route}.destroy`, deletingItem.value.id));
    toast.success(`${props.config.entity.name} deleted successfully`);
    closeDeleteModal();
    loadData();
  } catch (error) {
    console.error('Delete error:', error);
  }
};

// Load data
const loadData = () => {
  router.get(props.url, {
    sort: sortField.value,
    direction: sortDirection.value,
    search: searchTerm.value,
    ...filters.value
  }, { preserveState: true });
};

onMounted(() => {
  // Initialize sort and search from URL params
  const urlParams = new URLSearchParams(window.location.search);
  sortField.value = urlParams.get('sort') || '';
  sortDirection.value = (urlParams.get('direction') as 'asc' | 'desc') || 'asc';
  searchTerm.value = urlParams.get('search') || '';
  
  // Parse filters
  filters.value = Object.fromEntries(urlParams.entries());
});
</script>

<style scoped>
.page-crud-wrapper {
  /* Component styles are handled by Tailwind classes */
}
</style>
