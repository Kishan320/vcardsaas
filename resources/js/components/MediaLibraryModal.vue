<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="onClose"></div>
      
      <!-- Modal -->
      <div class="relative w-full max-w-6xl bg-white rounded-lg shadow-xl overflow-hidden">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b bg-gray-50">
          <h2 class="text-xl font-semibold text-gray-900">Media Library</h2>
          <Button variant="ghost" size="sm" @click="onClose">
            <X class="w-4 h-4" />
          </Button>
        </div>

        <!-- Content -->
        <div class="flex flex-col h-[600px]">
        <!-- Search and Upload -->
        <div class="p-4 border-b space-y-4">
          <div class="flex gap-2">
            <div class="relative flex-1">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                v-model="searchTerm"
                placeholder="Search media..."
                class="pl-9"
              />
            </div>
            <Button
              v-if="canCreateMedia"
              @click="document.getElementById('file-upload')?.click()"
              :disabled="uploading"
            >
              <Plus class="w-4 h-4 mr-2" />
              Upload Images
            </Button>
            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/*,video/*,application/pdf"
              class="hidden"
              @change="handleFileUpload"
            />
          </div>

          <!-- Drag and Drop Area -->
          <div
            v-if="canCreateMedia"
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
              Supports: Images, Videos, PDFs
            </p>
          </div>
        </div>

        <!-- Media Grid -->
        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="loading" class="flex items-center justify-center h-32">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          
          <div v-else-if="filteredMedia.length === 0" class="text-center py-8">
            <ImageIcon class="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p class="text-gray-600">No media found</p>
          </div>

          <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-4">
            <div
              v-for="item in paginatedMedia"
              :key="item.id"
              class="relative group cursor-pointer rounded-lg overflow-hidden transition-all hover:scale-105"
              :class="[
                selectedItems.includes(item.url) 
                  ? 'ring-2 ring-blue-500 shadow-lg' 
                  : 'hover:shadow-md border border-gray-200 hover:border-blue-500/50'
              ]"
              @click="selectItem(item)"
            >
              <div class="aspect-square w-full h-full">
                <img
                  v-if="item.mime_type.startsWith('image/')"
                  :src="item.thumb_url || item.url"
                  :alt="item.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
                  <div class="text-center p-2">
                    <div class="text-xs text-gray-600 truncate">{{ item.name }}</div>
                    <div class="text-xs text-gray-400">{{ item.mime_type }}</div>
                  </div>
                </div>
              </div>
              
              <!-- Selection Indicator -->
              <div
                v-if="selectedItems.includes(item.url)"
                class="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
              >
                <Check class="w-4 h-4 text-white" />
              </div>

              <!-- Hover Actions -->
              <div
                v-if="canManageMedia"
                class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center"
              >
                <Button
                  size="sm"
                  variant="destructive"
                  @click.stop="deleteItem(item)"
                >
                  <X class="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="p-4 border-t flex items-center justify-between">
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

        <!-- Action Buttons -->
        <div class="p-6 border-t bg-gray-50 flex justify-end gap-3">
          <Button variant="outline" @click="onClose">
            Cancel
          </Button>
          <Button
            :disabled="selectedItems.length === 0"
            @click="handleSelect"
          >
            Select {{ selectedItems.length }} {{ selectedItems.length === 1 ? 'Item' : 'Items' }}
          </Button>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { usePage } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Upload, X, Image as ImageIcon, Search, Check, Plus } from 'lucide-vue-next';
import { hasPermission } from '@/utils/authorization';
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

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string | string[]) => void;
  multiple?: boolean;
}

const props = withDefaults(defineProps<MediaLibraryModalProps>(), {
  multiple: false
});

const { auth } = usePage().props as any;
const permissions = auth?.permissions || [];
const canCreateMedia = true; // Temporarily always true for testing
const canManageMedia = hasPermission(permissions, 'manage-media');

const media = ref<MediaItem[]>([]);
const filteredMedia = ref<MediaItem[]>([]);
const loading = ref(false);
const uploading = ref(false);
const selectedItems = ref<string[]>([]);
const dragActive = ref(false);
const searchTerm = ref('');
const currentPage = ref(1);
const itemsPerPage = 18;

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
    console.log('Fetching media from /media...');
    const response = await axios.get('/media');
    console.log('API Response:', response);
    console.log('Response data:', response.data);
    console.log('Media items:', response.data.data);
    
    media.value = response.data.data || [];
    filteredMedia.value = media.value;
    
    console.log('Final media array:', media.value);
    console.log('Final filtered media array:', filteredMedia.value);
  } catch (error) {
    console.error('Failed to fetch media:', error);
    console.error('Error details:', error.response);
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
    const response = await axios.post('/media/batch', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    toast.success('Files uploaded successfully');
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
    const response = await axios.post('/media/batch', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    toast.success('Files uploaded successfully');
    await fetchMedia();
  } catch (error: any) {
    console.error('Upload failed:', error);
    toast.error(error.response?.data?.message || 'Upload failed');
  } finally {
    uploading.value = false;
  }
};

const selectItem = (item: MediaItem) => {
  if (props.multiple) {
    const index = selectedItems.value.indexOf(item.url);
    if (index > -1) {
      selectedItems.value.splice(index, 1);
    } else {
      selectedItems.value.push(item.url);
    }
  } else {
    // For single selection, immediately close modal and select the item
    props.onSelect(item.url);
    props.onClose();
    selectedItems.value = [];
  }
};

const deleteItem = async (item: MediaItem) => {
  if (!confirm('Are you sure you want to delete this media file?')) return;

  try {
    await axios.delete(`/api/media/${item.id}`);
    toast.success('Media deleted successfully');
    await fetchMedia();
  } catch (error: any) {
    console.error('Delete failed:', error);
    toast.error(error.response?.data?.message || 'Delete failed');
  }
};

const handleSelect = () => {
  if (props.multiple) {
    props.onSelect(selectedItems.value);
  } else {
    props.onSelect(selectedItems.value[0]);
  }
  props.onClose();
  selectedItems.value = [];
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
  if (props.isOpen) {
    fetchMedia();
  }
});

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    fetchMedia();
    selectedItems.value = [];
    currentPage.value = 1;
    searchTerm.value = '';
  }
});
</script>

<style scoped>
.media-library-modal {
  /* Component styles are handled by Tailwind classes */
}
</style>
