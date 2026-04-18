<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div class="relative w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col" style="max-height: 90vh;">

            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b bg-gray-50 shrink-0">
                <h2 class="text-lg font-semibold">Media Library</h2>
                <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
                    <X :size="18" />
                </button>
            </div>

            <!-- Search + Upload bar -->
            <div class="px-6 py-3 border-b shrink-0">
                <div class="flex gap-3 items-center">
                    <div class="relative flex-1">
                        <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            v-model="searchTerm"
                            type="text"
                            placeholder="Search media files..."
                            class="w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>
                    <div class="flex items-center gap-4 text-sm text-gray-500">
                        <span>{{ filteredMedia.length }} Files</span>
                        <span>{{ imageCount }} Images</span>
                        <span>{{ totalSize }}</span>
                    </div>
                    <button
                        @click="fileInputRef?.click()"
                        :disabled="uploading"
                        class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 disabled:opacity-60 shrink-0"
                    >
                        <Loader2 v-if="uploading" :size="14" class="animate-spin" />
                        <Plus v-else :size="14" />
                        {{ uploading ? 'Uploading...' : 'Upload Files' }}
                    </button>
                    <input ref="fileInputRef" type="file" multiple class="hidden" @change="onFileChange" />
                </div>
            </div>

            <!-- Drag & Drop zone (collapsed when media exists) -->
            <div
                v-if="!filteredMedia.length && !loading"
                class="mx-6 mt-4 shrink-0 border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer"
                :class="dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'"
                @dragenter.prevent="dragActive = true"
                @dragleave.prevent="dragActive = false"
                @dragover.prevent
                @drop.prevent="onDrop"
                @click="fileInputRef?.click()"
            >
                <Upload :size="32" class="mx-auto mb-3" :class="dragActive ? 'text-primary' : 'text-gray-400'" />
                <p class="text-sm font-medium text-gray-600">{{ dragActive ? 'Drop files here' : 'Drag & drop or click to upload' }}</p>
                <p class="text-xs text-gray-400 mt-1">Images, Videos, PDFs</p>
            </div>

            <!-- Drop overlay when media exists -->
            <div
                v-if="filteredMedia.length > 0"
                class="absolute inset-0 z-10 pointer-events-none transition-opacity"
                :class="dragActive ? 'opacity-100' : 'opacity-0'"
            >
                <div class="absolute inset-0 bg-primary/10 border-4 border-dashed border-primary rounded-2xl flex items-center justify-center">
                    <p class="text-primary font-semibold text-lg">Drop files to upload</p>
                </div>
            </div>
            <div
                v-if="filteredMedia.length > 0"
                class="absolute inset-0 z-[9]"
                :class="dragActive ? 'pointer-events-auto' : 'pointer-events-none'"
                @dragenter.prevent="dragActive = true"
                @dragleave.prevent="dragActive = false"
                @dragover.prevent
                @drop.prevent="onDrop"
            />

            <!-- Media Grid -->
            <div class="flex-1 overflow-y-auto p-6">
                <!-- Loading -->
                <div v-if="loading" class="flex flex-col items-center justify-center py-16 gap-3">
                    <Loader2 :size="32" class="animate-spin text-primary" />
                    <p class="text-sm text-gray-500">Loading media...</p>
                </div>

                <!-- Empty -->
                <div v-else-if="!paginatedMedia.length" class="flex flex-col items-center justify-center py-12 gap-3">
                    <ImageIcon :size="40" class="text-gray-300" />
                    <p class="text-sm text-gray-500">{{ searchTerm ? `No results for "${searchTerm}"` : 'No media files yet' }}</p>
                </div>

                <!-- Grid — identical layout to media-library.vue -->
                <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                    <div
                        v-for="item in paginatedMedia"
                        :key="item.id"
                        class="group relative bg-white border rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer"
                        :class="selectedItems.includes(item.url) ? 'ring-2 ring-primary shadow-md' : ''"
                        @click="toggleSelect(item)"
                    >
                        <!-- Preview -->
                        <div class="relative aspect-square bg-gray-50 flex items-center justify-center">
                            <img
                                v-if="item.mime_type?.startsWith('image/')"
                                :src="item.thumb_url || item.url"
                                :alt="item.name"
                                class="w-full h-full object-cover"
                                @error="(e) => {
                                    const img = e.target as HTMLImageElement;
                                    if (img.src !== item.url) {
                                        img.src = item.url;
                                    } else {
                                        img.style.display = 'none';
                                        img.parentElement?.classList.add('bg-gray-100');
                                    }
                                }"
                            />
                            <div v-else class="flex flex-col items-center justify-center p-4 w-full h-full">
                                <div class="text-2xl mb-1">{{ fileEmoji(item.mime_type) }}</div>
                                <div class="text-xs text-gray-500 font-medium">{{ item.mime_type?.split('/')[1]?.toUpperCase() || 'FILE' }}</div>
                            </div>

                            <!-- Overlay -->
                            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200" />

                            <!-- Type badge -->
                            <div class="absolute top-2 left-2">
                                <span class="px-1.5 py-0.5 bg-white/90 text-xs font-semibold rounded shadow-sm">
                                    {{ item.mime_type?.split('/')[1]?.toUpperCase() || 'FILE' }}
                                </span>
                            </div>

                            <!-- Selection check -->
                            <div
                                v-if="selectedItems.includes(item.url)"
                                class="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow"
                            >
                                <Check :size="13" class="text-white" />
                            </div>

                            <!-- Delete button on hover -->
                            <div class="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    @click.stop="onDelete(item)"
                                    class="w-7 h-7 bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center shadow"
                                >
                                    <Trash2 :size="12" class="text-white" />
                                </button>
                            </div>
                        </div>

                        <!-- Card info -->
                        <div class="p-2">
                            <p class="text-xs font-medium truncate" :title="item.name">{{ item.name }}</p>
                            <div class="flex items-center justify-between mt-0.5 text-xs text-gray-400">
                                <span>{{ formatSize(item.size) }}</span>
                                <span>{{ formatDate(item.created_at) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Pagination -->
                <div v-if="totalPages > 1" class="flex items-center justify-between pt-6 border-t mt-6">
                    <p class="text-sm text-gray-500">
                        Showing {{ (currentPage - 1) * perPage + 1 }}–{{ Math.min(currentPage * perPage, filteredMedia.length) }} of {{ filteredMedia.length }}
                    </p>
                    <div class="flex items-center gap-1">
                        <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50">Previous</button>
                        <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50">Next</button>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 border-t bg-gray-50 flex items-center justify-between shrink-0">
                <p class="text-sm text-gray-500">
                    {{ selectedItems.length > 0 ? `${selectedItems.length} item(s) selected` : 'Click items to select' }}
                </p>
                <div class="flex gap-3">
                    <button @click="$emit('close')" class="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100">
                        Cancel
                    </button>
                    <button
                        @click="confirmSelect"
                        :disabled="selectedItems.length === 0"
                        class="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-40"
                    >
                        Select {{ selectedItems.length > 0 ? selectedItems.length : '' }} {{ selectedItems.length === 1 ? 'Item' : 'Items' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { X, Search, Plus, Upload, ImageIcon, Check, Loader2, Trash2 } from 'lucide-vue-next';
import { useMediaLibrary } from '@/composables/useMediaLibrary';

interface Props {
    isOpen: boolean;
    multiple?: boolean;
}

const props = withDefaults(defineProps<Props>(), { multiple: false });
const emit = defineEmits<{
    close: [];
    select: [value: string | string[]];
}>();

const {
    filteredMedia, loading, uploading, searchTerm, currentPage, perPage,
    totalSize, imageCount, totalPages, paginatedMedia,
    fetchMedia, uploadFiles, deleteMedia,
    formatSize, formatDate, fileEmoji,
} = useMediaLibrary();

const fileInputRef = ref<HTMLInputElement | null>(null);
const dragActive = ref(false);
const selectedItems = ref<string[]>([]);

function toggleSelect(item: { url: string }) {
    if (props.multiple) {
        const idx = selectedItems.value.indexOf(item.url);
        idx > -1 ? selectedItems.value.splice(idx, 1) : selectedItems.value.push(item.url);
    } else {
        // Single select: immediately emit and close
        emit('select', item.url);
        emit('close');
    }
}

function confirmSelect() {
    if (!selectedItems.value.length) return;
    emit('select', props.multiple ? selectedItems.value : selectedItems.value[0]);
    emit('close');
}

async function onDelete(item: Parameters<typeof deleteMedia>[0]) {
    await deleteMedia(item);
}

function onFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const files = target.files;
    if (files?.length) {
        uploadFiles(files).then(() => {
            target.value = '';
        });
    }
}

function onDrop(e: DragEvent) {
    dragActive.value = false;
    if (e.dataTransfer?.files.length) {
        uploadFiles(e.dataTransfer.files);
    }
}

watch(() => props.isOpen, (open) => {
    if (open) {
        fetchMedia();
        selectedItems.value = [];
        searchTerm.value = '';
        currentPage.value = 1;
    }
});

onMounted(() => { if (props.isOpen) fetchMedia(); });
</script>
