<template>
  <PageTemplate title="Media Library" url="/media-library">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              v-model="searchTerm"
              placeholder="Search media..."
              class="pl-9 w-64"
            />
          </div>
        </div>
        <Button @click="isUploadModalOpen = true">
          <Upload class="w-4 h-4 mr-2" />
          Upload Media
        </Button>
      </div>

      <!-- Upload Modal -->
      <Dialog :open="isUploadModalOpen" @update:open="isUploadModalOpen">
        <DialogContent class="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Media</DialogTitle>
          </DialogHeader>
          <div class="space-y-4">
            <div
              class="border-2 border-dashed rounded-lg p-8 text-center transition-colors"
              :class="[
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
                uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:border-gray-400'
              ]"
              @dragover.prevent="dragActive = true"
              @dragleave.prevent="dragActive = false"
              @drop.prevent="handleDrop"
              @click="document.getElementById('file-upload')?.click()"
            >
              <Upload class="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p class="text-sm text-gray-600 mb-2">
                Drag and drop files here, or click to select
              </p>
              <p class="text-xs text-gray-500">
                Supports: Images, Videos, Documents
              </p>
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*,video/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                class="hidden"
                @change="handleFileUpload"
              />
            </div>
            <div class="flex justify-end">
              <Button variant="outline" @click="isUploadModalOpen = false">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <!-- Media Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <div
          v-for="item in paginatedMedia"
          :key="item.id"
          class="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:border-blue-500 transition-colors"
          @click="showMediaInfo(item)"
        >
          <div v-if="item.mime_type.startsWith('image/')" class="w-full h-full">
            <img
              :src="item.thumb_url || item.url"
              :alt="item.name"
              class="w-full h-full object-cover"
            />
          </div>
          <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
            <div class="text-center p-2">
              <ImageIcon class="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <div class="text-xs text-gray-600 truncate">{{ item.name }}</div>
              <div class="text-xs text-gray-400">{{ item.mime_type }}</div>
            </div>
          </div>
          
          <!-- Hover Actions -->
          <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div class="flex gap-2">
              <Button size="sm" variant="secondary" @click.stop="copyUrl(item.url)">
                <Copy class="w-4 h-4" />
              </Button>
              <Button size="sm" variant="secondary" @click.stop="downloadMedia(item)">
                <Download class="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredMedia.length === 0" class="text-center py-12">
        <ImageIcon class="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No media found</h3>
        <p class="text-gray-500 mb-4">Get started by uploading your first media file.</p>
        <Button @click="isUploadModalOpen = true">
          <Upload class="w-4 h-4 mr-2" />
          Upload Media
        </Button>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between">
        <div class="text-sm text-gray-600">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredMedia.length) }} of {{ filteredMedia.length }} items
        </div>
        <div class="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            Next
          </Button>
        </div>
      </div>

      <!-- Media Info Modal -->
      <Dialog :open="infoModalOpen" @update:open="infoModalOpen">
        <DialogContent class="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Media Information</DialogTitle>
          </DialogHeader>
          <div v-if="selectedMediaInfo" class="space-y-4">
            <div v-if="selectedMediaInfo.mime_type.startsWith('image/')" class="flex justify-center">
              <img
                :src="selectedMediaInfo.url"
                :alt="selectedMediaInfo.name"
                class="max-w-full h-auto rounded-lg"
              />
            </div>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm font-medium">Name:</span>
                <span class="text-sm">{{ selectedMediaInfo.name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm font-medium">Size:</span>
                <span class="text-sm">{{ formatFileSize(selectedMediaInfo.size) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm font-medium">Type:</span>
                <span class="text-sm">{{ selectedMediaInfo.mime_type }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm font-medium">Created:</span>
                <span class="text-sm">{{ formatDate(selectedMediaInfo.created_at) }}</span>
              </div>
            </div>
            <div class="flex gap-2">
              <Button variant="outline" @click="copyUrl(selectedMediaInfo.url)">
                <Copy class="w-4 h-4 mr-2" />
                Copy URL
              </Button>
              <Button @click="downloadMedia(selectedMediaInfo)">
                <Download class="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  </PageTemplate>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { usePage } from '@inertiajs/vue3';
import PageTemplate from '@/components/page-template.vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Upload, Search, Copy, Download, ImageIcon } from 'lucide-vue-next';
import axios from '@/utils/axios-config';

interface MediaItem {
  id: number;
  name: string;
  file_name: string;
  url: string;
  thumb_url: string;
  size: number;
  mime_type: string;
  created_at: string;
}

const { csrf_token } = usePage().props as any;

const media = ref<MediaItem[]>([]);
const filteredMedia = ref<MediaItem[]>([]);
const loading = ref(false);
const searchTerm = ref('');
const currentPage = ref(1);
const isUploadModalOpen = ref(false);
const uploading = ref(false);
const dragActive = ref(false);
const infoModalOpen = ref(false);
const selectedMediaInfo = ref<MediaItem | null>(null);
const itemsPerPage = 12;

const paginatedMedia = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredMedia.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredMedia.value.length / itemsPerPage);
});

const fetchMedia = async () => {
  loading.value = true;
  try {
    const response = await axios.get('/api/media');
    media.value = response.data.data || [];
    filteredMedia.value = media.value;
  } catch (error) {
    console.error('Failed to fetch media:', error);
    toast.error('Failed to load media library');
  } finally {
    loading.value = false;
  }
};

const handleFileUpload = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (!files || files.length === 0) return;

  uploading.value = true;
  const formData = new FormData();
  
  for (let i = 0; i < files.length; i++) {
    formData.append('files[]', files[i]);
  }

  try {
    const response = await axios.post('/api/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    toast.success('Files uploaded successfully');
    isUploadModalOpen.value = false;
    await fetchMedia();
  } catch (error: any) {
    console.error('Upload failed:', error);
    toast.error(error.response?.data?.message || 'Upload failed');
  } finally {
    uploading.value = false;
  }
};

const handleDrop = async (event: DragEvent) => {
  event.preventDefault();
  dragActive.value = false;
  
  const files = event.dataTransfer?.files;
  if (!files || files.length === 0) return;

  uploading.value = true;
  const formData = new FormData();
  
  for (let i = 0; i < files.length; i++) {
    formData.append('files[]', files[i]);
  }

  try {
    const response = await axios.post('/api/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    toast.success('Files uploaded successfully');
    isUploadModalOpen.value = false;
    await fetchMedia();
  } catch (error: any) {
    console.error('Upload failed:', error);
    toast.error(error.response?.data?.message || 'Upload failed');
  } finally {
    uploading.value = false;
  }
};

const showMediaInfo = (item: MediaItem) => {
  selectedMediaInfo.value = item;
  infoModalOpen.value = true;
};

const copyUrl = async (url: string) => {
  try {
    await navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  } catch (error) {
    toast.error('Failed to copy URL');
  }
};

const downloadMedia = async (item: MediaItem) => {
  const link = document.createElement('a');
  link.href = item.url;
  link.download = item.file_name;
  link.click();
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

watch(searchTerm, (term) => {
  if (!term) {
    filteredMedia.value = media.value;
  } else {
    filteredMedia.value = media.value.filter(item =>
      item.name.toLowerCase().includes(term.toLowerCase()) ||
      item.file_name.toLowerCase().includes(term.toLowerCase())
    );
  }
  currentPage.value = 1;
});

onMounted(() => {
  fetchMedia();
});
</script>

<style scoped>
.media-library {
  /* Component styles are handled by Tailwind classes */
}
</style>
