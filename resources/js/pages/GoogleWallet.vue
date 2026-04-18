<template>
  <PageTemplate title="Google Wallet" url="/google-wallet">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Google Wallet</h1>
          <p class="text-gray-600">Manage your Google Wallet passes</p>
        </div>
        <div class="flex gap-2">
          <Button v-if="hasGoogleWalletSettings" variant="outline">
            <Settings class="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button>
            <Plus class="w-4 h-4 mr-2" />
            Create Pass
          </Button>
        </div>
      </div>

      <!-- Search and Filter -->
      <SearchAndFilterBar
        :filters="[
          {
            key: 'business_type',
            label: 'Business Type',
            type: 'select',
            options: businessTypes
          }
        ]"
        search-placeholder="Search businesses..."
        @filter="handleFilter"
        @search="handleSearch"
      />

      <!-- Business Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          v-for="business in businesses.data"
          :key="business.id"
          class="p-6"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Wallet class="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 class="font-semibold">{{ business.name }}</h3>
                <p class="text-sm text-gray-500">{{ business.business_type }}</p>
              </div>
            </div>
            <div class="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                :disabled="loadingBusinesses.has(business.id)"
                @click="generateWalletPass(business)"
              >
                <div v-if="loadingBusinesses.has(business.id)" class="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                {{ loadingBusinesses.has(business.id) ? 'Generating...' : 'Generate Pass' }}
              </Button>
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Status</span>
              <span class="font-medium">{{ business.wallet_pass_status || 'Not Generated' }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Created</span>
              <span>{{ formatDate(business.created_at) }}</span>
            </div>
            <div v-if="business.wallet_pass_url" class="flex justify-between text-sm">
              <span class="text-gray-500">Pass URL</span>
              <Button
                size="sm"
                variant="ghost"
                @click="copyPassUrl(business.wallet_pass_url)"
              >
                Copy
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <!-- Empty State -->
      <div v-if="businesses.data.length === 0" class="text-center py-12">
        <Wallet class="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No businesses found</h3>
        <p class="text-gray-500 mb-4">Get started by creating your first business.</p>
        <Button @click="$inertia.visit(route('vcard-builder.create'))">
          <Plus class="w-4 h-4 mr-2" />
          Create Business
        </Button>
      </div>

      <!-- Pagination -->
      <Pagination
        v-if="businesses.meta?.last_page > 1"
        :current-page="businesses.meta?.current_page || 1"
        :total-pages="businesses.meta?.last_page || 1"
        :from="businesses.meta?.from || 0"
        :to="businesses.meta?.to || 0"
        :total="businesses.meta?.total || 0"
        @page-change="handlePageChange"
      />
    </div>
  </PageTemplate>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { usePage, router } from '@inertiajs/vue3';
import PageTemplate from '@/components/page-template.vue';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { SearchAndFilterBar } from '@/components/ui/search-and-filter-bar';
import { Wallet, Plus, Settings } from 'lucide-vue-next';
import { toast } from '@/components/custom-toast';

const { auth, businesses, businessTypes, hasGoogleWalletSettings, filters: pageFilters = {} } = usePage().props as any;

const loadingBusinesses = ref<Set<number>>(new Set());

// Filter states
const searchTerm = ref(pageFilters.search || '');
const selectedBusinessType = ref(pageFilters.business_type || 'all');
const showFilters = ref(false);

// Check if any filters are active
const hasActiveFilters = () => {
  return selectedBusinessType.value !== 'all' || searchTerm.value !== '';
};

// Count active filters
const activeFilterCount = () => {
  return (selectedBusinessType.value !== 'all' ? 1 : 0) + (searchTerm.value ? 1 : 0);
};

const handleSearch = (event: Event) => {
  event.preventDefault();
  applyFilters();
};

const applyFilters = () => {
  const params: any = { page: 1 };
  
  if (searchTerm.value) {
    params.search = searchTerm.value;
  }
  
  if (selectedBusinessType.value !== 'all') {
    params.business_type = selectedBusinessType.value;
  }
  
  if (pageFilters.per_page) {
    params.per_page = pageFilters.per_page;
  }
  
  router.get(route('google-wallet.index'), params, {
    preserveState: true,
    preserveScroll: true,
  });
};

const handleFilter = (filterData: any) => {
  Object.assign(filterData, { page: 1 });
  router.get(route('google-wallet.index'), filterData, {
    preserveState: true,
    preserveScroll: true,
  });
};

const handlePageChange = (page: number) => {
  const params: any = { page };
  
  if (searchTerm.value) {
    params.search = searchTerm.value;
  }
  
  if (selectedBusinessType.value !== 'all') {
    params.business_type = selectedBusinessType.value;
  }
  
  if (pageFilters.per_page) {
    params.per_page = pageFilters.per_page;
  }
  
  router.get(route('google-wallet.index'), params, {
    preserveState: true,
    preserveScroll: true,
  });
};

const generateWalletPass = async (business: any) => {
  loadingBusinesses.value.add(business.id);
  
  try {
    const response = await router.post(route('google-wallet.generate', business.id));
    toast.success('Google Wallet pass generated successfully');
  } catch (error) {
    console.error('Failed to generate wallet pass:', error);
    toast.error('Failed to generate wallet pass');
  } finally {
    loadingBusinesses.value.delete(business.id);
  }
};

const copyPassUrl = async (url: string) => {
  try {
    await navigator.clipboard.writeText(url);
    toast.success('Pass URL copied to clipboard');
  } catch (error) {
    toast.error('Failed to copy URL');
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};
</script>

<style scoped>
.google-wallet {
  /* Component styles are handled by Tailwind classes */
}
</style>
