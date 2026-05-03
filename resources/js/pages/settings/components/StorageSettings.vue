<template>
  <SettingsSection
    :title="t('Storage Settings')"
    :description="t('Configure file storage settings for your application')"
  >
    <template #action>
      <Button type="submit" form="storage-settings-form" size="sm" :disabled="saving">
        <Loader2 v-if="saving" :size="14" class="mr-2" />
        {{ saving ? t('Saving...') : t('Save Changes') }}
      </Button>
    </template>
    <form id="storage-settings-form" @submit.prevent="saveSettings">
      <!-- Storage Type Tabs -->
      <div class="w-full mb-6">
        <div class="grid grid-cols-3 gap-1 bg-muted p-1 rounded-lg">
          <button
            v-for="tab in storageTabs"
            :key="tab.value"
            type="button"
            class="flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all"
            :class="storageSettings.storageType === tab.value
              ? 'bg-background shadow-sm text-foreground'
              : 'text-muted-foreground hover:text-foreground'"
            @click="storageSettings.storageType = tab.value"
          >
            <component :is="tab.icon" :size="16" />
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Local Storage -->
      <div v-if="storageSettings.storageType === 'local'" class="space-y-6">
        <h3 class="text-base font-medium">{{ t('Local Storage Settings') }}</h3>
        <div class="space-y-2">
          <Label>{{ t('Allowed File Types') }}</Label>
          <div class="space-y-3">
            <div class="flex gap-2">
              <div class="relative flex-1">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input v-model="searchTerm" :placeholder="t('Search file types...')" class="pl-10" />
              </div>
              <Button type="button" variant="outline" size="sm" @click="selectAll">{{ t('Select All') }}</Button>
              <Button type="button" variant="outline" size="sm" @click="unselectAll">{{ t('Unselect All') }}</Button>
            </div>
            <div class="grid grid-cols-4 gap-2 p-4 border rounded-md max-h-48 overflow-y-auto">
              <div v-for="ext in filteredExtensions" :key="ext" class="flex items-center space-x-2">
                <Checkbox
                  :id="ext"
                  :checked="isExtChecked(ext)"
                  @update:checked="(v) => toggleExt(ext, v)"
                />
                <Label :for="ext" class="text-sm font-normal">{{ ext }}</Label>
              </div>
            </div>
          </div>
        </div>
        <div class="space-y-2">
          <Label for="maxUploadSize">{{ t('Max Upload Size (KB)') }}</Label>
          <Input id="maxUploadSize" v-model="storageSettings.maxUploadSize" type="number" placeholder="2048" />
        </div>
      </div>

      <!-- AWS S3 -->
      <div v-if="storageSettings.storageType === 'aws_s3'" class="space-y-6">
        <h3 class="text-base font-medium">{{ t('AWS S3 Storage Settings') }}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <Label for="awsAccessKeyId">{{ t('AWS Access Key ID') }}</Label>
            <Input id="awsAccessKeyId" v-model="storageSettings.awsAccessKeyId" placeholder="AKIAIOSFODNN7EXAMPLE" />
          </div>
          <div class="space-y-2">
            <Label for="awsSecretAccessKey">{{ t('AWS Secret Access Key') }}</Label>
            <Input id="awsSecretAccessKey" v-model="storageSettings.awsSecretAccessKey" type="password" placeholder="wJalrXUtnFEMI..." />
          </div>
          <div class="space-y-2">
            <Label for="awsDefaultRegion">{{ t('AWS Default Region') }}</Label>
            <Input id="awsDefaultRegion" v-model="storageSettings.awsDefaultRegion" placeholder="us-east-1" />
          </div>
          <div class="space-y-2">
            <Label for="awsBucket">{{ t('AWS Bucket') }}</Label>
            <Input id="awsBucket" v-model="storageSettings.awsBucket" placeholder="my-bucket-name" />
          </div>
          <div class="space-y-2">
            <Label for="awsUrl">{{ t('AWS URL') }}</Label>
            <Input id="awsUrl" v-model="storageSettings.awsUrl" placeholder="https://s3.amazonaws.com" />
          </div>
          <div class="space-y-2">
            <Label for="awsEndpoint">{{ t('AWS Endpoint') }}</Label>
            <Input id="awsEndpoint" v-model="storageSettings.awsEndpoint" placeholder="https://s3.us-east-1.amazonaws.com" />
          </div>
        </div>
        <div class="space-y-2">
          <Label>{{ t('Allowed File Types') }}</Label>
          <div class="space-y-3">
            <div class="flex gap-2">
              <div class="relative flex-1">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input v-model="searchTerm" :placeholder="t('Search file types...')" class="pl-10" />
              </div>
              <Button type="button" variant="outline" size="sm" @click="selectAll">{{ t('Select All') }}</Button>
              <Button type="button" variant="outline" size="sm" @click="unselectAll">{{ t('Unselect All') }}</Button>
            </div>
            <div class="grid grid-cols-4 gap-2 p-4 border rounded-md max-h-48 overflow-y-auto">
              <div v-for="ext in filteredExtensions" :key="ext" class="flex items-center space-x-2">
                <Checkbox :id="`aws-${ext}`" :checked="isExtChecked(ext)" @update:checked="(v) => toggleExt(ext, v)" />
                <Label :for="`aws-${ext}`" class="text-sm font-normal">{{ ext }}</Label>
              </div>
            </div>
          </div>
        </div>
        <div class="space-y-2">
          <Label for="awsMaxUploadSize">{{ t('Max Upload Size (KB)') }}</Label>
          <Input id="awsMaxUploadSize" v-model="storageSettings.maxUploadSize" type="number" placeholder="2048" />
        </div>
      </div>

      <!-- Wasabi -->
      <div v-if="storageSettings.storageType === 'wasabi'" class="space-y-6">
        <h3 class="text-base font-medium">{{ t('Wasabi Storage Settings') }}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <Label for="wasabiAccessKey">{{ t('Wasabi Access Key') }}</Label>
            <Input id="wasabiAccessKey" v-model="storageSettings.wasabiAccessKey" placeholder="AKIAIOSFODNN7EXAMPLE" />
          </div>
          <div class="space-y-2">
            <Label for="wasabiSecretKey">{{ t('Wasabi Secret Key') }}</Label>
            <Input id="wasabiSecretKey" v-model="storageSettings.wasabiSecretKey" type="password" placeholder="wJalrXUtnFEMI..." />
          </div>
          <div class="space-y-2">
            <Label for="wasabiRegion">{{ t('Wasabi Region') }}</Label>
            <Input id="wasabiRegion" v-model="storageSettings.wasabiRegion" placeholder="us-east-1" />
          </div>
          <div class="space-y-2">
            <Label for="wasabiBucket">{{ t('Wasabi Bucket') }}</Label>
            <Input id="wasabiBucket" v-model="storageSettings.wasabiBucket" placeholder="my-wasabi-bucket" />
          </div>
          <div class="space-y-2">
            <Label for="wasabiUrl">{{ t('Wasabi URL') }}</Label>
            <Input id="wasabiUrl" v-model="storageSettings.wasabiUrl" placeholder="https://s3.wasabisys.com" />
          </div>
          <div class="space-y-2">
            <Label for="wasabiRoot">{{ t('Wasabi Root') }}</Label>
            <Input id="wasabiRoot" v-model="storageSettings.wasabiRoot" placeholder="/" />
          </div>
        </div>
        <div class="space-y-2">
          <Label>{{ t('Allowed File Types') }}</Label>
          <div class="space-y-3">
            <div class="flex gap-2">
              <div class="relative flex-1">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input v-model="searchTerm" :placeholder="t('Search file types...')" class="pl-10" />
              </div>
              <Button type="button" variant="outline" size="sm" @click="selectAll">{{ t('Select All') }}</Button>
              <Button type="button" variant="outline" size="sm" @click="unselectAll">{{ t('Unselect All') }}</Button>
            </div>
            <div class="grid grid-cols-4 gap-2 p-4 border rounded-md max-h-48 overflow-y-auto">
              <div v-for="ext in filteredExtensions" :key="ext" class="flex items-center space-x-2">
                <Checkbox :id="`wasabi-${ext}`" :checked="isExtChecked(ext)" @update:checked="(v) => toggleExt(ext, v)" />
                <Label :for="`wasabi-${ext}`" class="text-sm font-normal">{{ ext }}</Label>
              </div>
            </div>
          </div>
        </div>
        <div class="space-y-2">
          <Label for="wasabiMaxUploadSize">{{ t('Max Upload Size (KB)') }}</Label>
          <Input id="wasabiMaxUploadSize" v-model="storageSettings.maxUploadSize" type="number" placeholder="2048" />
        </div>
      </div>
    </form>
  </SettingsSection>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { router, usePage } from '@inertiajs/vue3';
import { useI18n } from 'vue-i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Checkbox from '@/components/ui/Checkbox.vue';
import { Loader2, HardDrive, Search } from 'lucide-vue-next';
import SettingsSection from '@/components/SettingsSection.vue';

const props = defineProps<{ settings?: Record<string, string> }>();

const { t } = useI18n();
const page = usePage();
const saving = ref(false);
const searchTerm = ref('');

const settingsData = props.settings || (page.props.systemSettings as Record<string, any> || {});

const storageTabs = [
  { value: 'local', label: t('Local Storage'), icon: HardDrive },
  { value: 'aws_s3', label: 'AWS S3', icon: HardDrive },
  { value: 'wasabi', label: 'Wasabi', icon: HardDrive },
];

const fileExtensions = [
  '3dmf','3dm','avi','ai','bin','bmp','cab','c','c++','class','css','csv','cdr','doc','dot','docx',
  'dwg','eps','exe','gif','gz','gtar','flv','fh4','fh5','fhc','help','hlp','html','htm','ico','imap',
  'inf','jpe','jpeg','jpg','js','java','latex','log','m3u','midi','mid','mov','mp4','mp3','mpeg','mpg',
  'mp2','ogg','phtml','php','pdf','pgp','png','pps','ppt','ppz','pot','ps','qt','qd3d','qd3','qxd',
  'rar','ra','ram','rm','rtf','spr','sprite','stream','swf','svg','sgml','sgm','tar','tiff','tif',
  'tgz','tex','txt','vob','wav','wrl','xla','xls','xlc','xml','zip','json','webp'
];

const storageSettings = reactive({
  storageType: (settingsData.storage_type || 'local') as 'local' | 'aws_s3' | 'wasabi',
  allowedFileTypes: settingsData.storage_file_types || 'jpg,png,webp,gif',
  maxUploadSize: settingsData.storage_max_upload_size || '2048',
  awsAccessKeyId: settingsData.aws_access_key_id || '',
  awsSecretAccessKey: settingsData.aws_secret_access_key || '',
  awsDefaultRegion: settingsData.aws_default_region || 'us-east-1',
  awsBucket: settingsData.aws_bucket || '',
  awsUrl: settingsData.aws_url || '',
  awsEndpoint: settingsData.aws_endpoint || '',
  wasabiAccessKey: settingsData.wasabi_access_key || '',
  wasabiSecretKey: settingsData.wasabi_secret_key || '',
  wasabiRegion: settingsData.wasabi_region || 'us-east-1',
  wasabiBucket: settingsData.wasabi_bucket || '',
  wasabiUrl: settingsData.wasabi_url || '',
  wasabiRoot: settingsData.wasabi_root || '',
});

const filteredExtensions = computed(() =>
  fileExtensions.filter(ext => ext.toLowerCase().includes(searchTerm.value.toLowerCase()))
);

const isExtChecked = (ext: string) =>
  storageSettings.allowedFileTypes.split(',').map(e => e.trim()).includes(ext);

const toggleExt = (ext: string, checked: boolean) => {
  const current = storageSettings.allowedFileTypes.split(',').map(e => e.trim()).filter(Boolean);
  if (checked) {
    if (!current.includes(ext)) current.push(ext);
  } else {
    const idx = current.indexOf(ext);
    if (idx > -1) current.splice(idx, 1);
  }
  storageSettings.allowedFileTypes = current.join(',');
};

const selectAll = () => { storageSettings.allowedFileTypes = fileExtensions.join(','); };
const unselectAll = () => { storageSettings.allowedFileTypes = ''; };

const saveSettings = () => {
  saving.value = true;
  const formData: any = {
    storage_type: storageSettings.storageType,
    allowedFileTypes: storageSettings.allowedFileTypes,
    maxUploadSize: storageSettings.maxUploadSize,
  };
  if (storageSettings.storageType === 'aws_s3') {
    Object.assign(formData, {
      awsAccessKeyId: storageSettings.awsAccessKeyId,
      awsSecretAccessKey: storageSettings.awsSecretAccessKey,
      awsDefaultRegion: storageSettings.awsDefaultRegion,
      awsBucket: storageSettings.awsBucket,
      awsUrl: storageSettings.awsUrl,
      awsEndpoint: storageSettings.awsEndpoint,
    });
  }
  if (storageSettings.storageType === 'wasabi') {
    Object.assign(formData, {
      wasabiAccessKey: storageSettings.wasabiAccessKey,
      wasabiSecretKey: storageSettings.wasabiSecretKey,
      wasabiRegion: storageSettings.wasabiRegion,
      wasabiBucket: storageSettings.wasabiBucket,
      wasabiUrl: storageSettings.wasabiUrl,
      wasabiRoot: storageSettings.wasabiRoot,
    });
  }
  router.post(route('settings.storage.update'), formData, {
    preserveScroll: true,
    onFinish: () => { saving.value = false; }
  });
};
</script>
