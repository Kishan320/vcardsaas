<template>
  <Card class="domain-config">
    <div class="p-6 space-y-6">
      <!-- Domain Type Selection -->
      <div class="space-y-4">
        <Label>{{ t('Domain Type') }}</Label>
        <div class="flex gap-2">
          <Button
            variant="outline"
            :class="domainType === 'slug' ? 'bg-blue-500 text-white' : ''"
            @click="setDomainType('slug')"
          >
            {{ t('Slug') }}
          </Button>
          <Button
            v-if="canUseSubdomain"
            variant="outline"
            :class="domainType === 'subdomain' ? 'bg-blue-500 text-white' : ''"
            @click="setDomainType('subdomain')"
          >
            {{ t('Subdomain') }}
          </Button>
          <Button
            v-if="canUseCustomDomain"
            variant="outline"
            :class="domainType === 'domain' ? 'bg-blue-500 text-white' : ''"
            @click="setDomainType('domain')"
          >
            {{ t('Custom Domain') }}
          </Button>
        </div>
      </div>

      <!-- Slug Configuration -->
      <div v-if="domainType === 'slug'" class="space-y-4">
        <Label for="slug">{{ t('Slug') }}</Label>
        <div class="flex gap-2">
          <div class="flex-1">
            <Input
              id="slug"
              :value="data.slug"
              :placeholder="t('Enter slug')"
              :class="slugStatus?.checking ? 'border-yellow-500' : slugStatus?.available === false ? 'border-red-500' : ''"
              @input="handleSlugChange($event.target.value)"
            />
          </div>
          <Button
            v-if="type === 'biolink'"
            variant="outline"
            @click="handlePrefixChange"
          >
            {{ t('Prefix') }}
          </Button>
        </div>
        <div class="flex items-center gap-2 text-sm">
          <span v-if="slugStatus?.checking" class="text-yellow-600">
            {{ t('Checking availability...') }}
          </span>
          <span v-else-if="slugStatus?.available === false" class="text-red-600">
            {{ t('Slug not available') }}
          </span>
          <span v-else-if="data.slug" class="text-green-600">
            {{ t('Available') }}
          </span>
        </div>
      </div>

      <!-- Custom Domain Configuration -->
      <div v-if="domainType === 'domain'" class="space-y-4">
        <Label for="custom_domain">{{ t('Custom Domain') }}</Label>
        <Input
          id="custom_domain"
          :value="data.custom_domain"
          :placeholder="t('Enter your custom domain')"
          @input="updateField('custom_domain', $event.target.value)"
        />
        <p class="text-sm text-gray-600">
          {{ t('Enter your custom domain (e.g., yourdomain.com)') }}
        </p>
      </div>

      <!-- Subdomain Configuration -->
      <div v-if="domainType === 'subdomain'" class="space-y-4">
        <Label for="subdomain">{{ t('Subdomain') }}</Label>
        <div class="flex gap-2">
          <Input
            id="subdomain"
            :value="data.subdomain"
            :placeholder="t('Enter subdomain')"
            @input="updateField('subdomain', $event.target.value)"
          />
          <span class="flex items-center text-gray-600">.{{ getBaseDomain() }}</span>
        </div>
        <p class="text-sm text-gray-600">
          {{ t('Enter your subdomain name') }}
        </p>
      </div>

      <!-- Password Protection -->
      <div v-if="canUsePasswordProtection" class="space-y-4">
        <div class="flex items-center justify-between">
          <Label>{{ t('Password Protection') }}</Label>
          <Switch
            :checked="data.password_enabled"
            @update:checked="updateField('password_enabled', $event)"
          />
        </div>
        <div v-if="data.password_enabled" class="space-y-2">
          <Input
            type="password"
            :value="data.password"
            :placeholder="t('Enter password')"
            @input="updateField('password', $event.target.value)"
          />
        </div>
      </div>

      <!-- URL Prefix (for Bio Links) -->
      <div v-if="type === 'biolink'" class="space-y-4">
        <Label for="url_prefix">{{ t('URL Prefix') }}</Label>
        <Input
          id="url_prefix"
          :value="data.url_prefix"
          :placeholder="t('Enter URL prefix')"
          @input="updateField('url_prefix', $event.target.value)"
        />
        <p class="text-sm text-gray-600">
          {{ t('Custom URL prefix for your bio link') }}
        </p>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue';
import { useTranslation } from 'vue-i18n';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import axios from '@/utils/axios-config';

interface DomainConfigProps {
  data: {
    slug: string;
    custom_domain?: string;
    url_prefix?: string;
    password?: string;
    password_enabled?: boolean;
    domain_type?: 'slug' | 'subdomain' | 'domain';
  };
  onUpdate: (field: string, value: any) => void;
  slugStatus?: { available: boolean; checking: boolean };
  onSlugChange?: (slug: string) => void;
  onPrefixChange?: (prefix: string) => void;
  businessId?: number;
  canUseCustomDomain?: boolean;
  canUseSubdomain?: boolean;
  canUsePasswordProtection?: boolean;
  type?: 'business' | 'biolink';
}

const props = withDefaults(defineProps<DomainConfigProps>(), {
  canUseCustomDomain: true,
  canUseSubdomain: true,
  canUsePasswordProtection: true,
  type: 'business'
});

const { t } = useTranslation();

const domainType = ref(props.data.domain_type || 'slug');
const domainStatus = reactive({ available: true, checking: false });

const setDomainType = (type: string) => {
  domainType.value = type;
  props.onUpdate('domain_type', type);
};

const updateField = (field: string, value: any) => {
  props.onUpdate(field, value);
};

const handleSlugChange = async (slug: string) => {
  props.onUpdate('slug', slug);
  
  if (props.onSlugChange) {
    props.onSlugChange(slug);
  }

  // Check availability
  if (slug) {
    domainStatus.checking = true;
    domainStatus.available = true;
    
    try {
      const response = await axios.post('/api/check-slug-availability', {
        slug,
        business_id: props.businessId
      });
      
      domainStatus.available = response.data.available;
    } catch (error) {
      console.error('Failed to check slug availability:', error);
      domainStatus.available = false;
    } finally {
      domainStatus.checking = false;
    }
  }
};

const handlePrefixChange = () => {
  if (props.onPrefixChange) {
    props.onPrefixChange(props.data.url_prefix || '');
  }
};

const getBaseDomain = () => {
  // This should come from your app settings
  return window.appSettings?.baseDomain || 'yourapp.com';
};

watch(() => props.data.domain_type, (newDomainType) => {
  const type = newDomainType || 'slug';
  
  // Reset to slug if user doesn't have access to selected domain type
  if ((type === 'domain' && !props.canUseCustomDomain) || 
      (type === 'subdomain' && !props.canUseSubdomain)) {
    setDomainType('slug');
  } else {
    domainType.value = type;
  }
}, { immediate: true });

// Expose slug status to parent
watch(() => domainStatus, (status) => {
  if (props.onSlugChange && props.data.slug) {
    props.onSlugChange(props.data.slug, status);
  }
}, { deep: true });
</script>

<style scoped>
.domain-config {
  /* Component styles are handled by Tailwind classes */
}
</style>
