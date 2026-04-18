<template>
    <PageTemplate title="Media Library" url="/media-library" :actions="[{ label: 'Upload Files', icon: Plus, onClick: () => (uploadOpen = true) }]">

        <!-- Stats + Search -->
        <div class="rounded-xl border bg-white p-4 shadow-sm mb-6">
            <div class="flex flex-col lg:flex-row gap-4">
                <div class="relative max-w-sm flex-1">
                    <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input v-model="searchTerm" type="text" placeholder="Search media files..." class="w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2" />
                </div>
                <div class="flex gap-6 items-center text-sm">
                    <div class="flex items-center gap-2">
                        <div class="p-1.5 bg-primary/10 rounded-md"><ImageIcon :size="14" class="text-primary" /></div>
                        <span class="font-semibold">{{ filteredMedia.length }} Files</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="p-1.5 bg-green-100 rounded-md"><HardDrive :size="14" class="text-green-600" /></div>
                        <span class="font-semibold">{{ totalSize }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="p-1.5 bg-blue-100 rounded-md"><ImageIcon :size="14" class="text-blue-600" /></div>
                        <span class="font-semibold">{{ imageCount }} Images</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Grid -->
        <div class="rounded-xl border bg-white p-6 shadow-sm">
            <!-- Loading -->
            <div v-if="loading" class="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 :size="32" class="animate-spin text-primary" />
                <p class="text-sm text-gray-500">Loading media...</p>
            </div>

            <!-- Empty -->
            <div v-else-if="!paginatedMedia.length" class="flex flex-col items-center justify-center py-16 gap-4">
                <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <ImageIcon :size="36" class="text-gray-400" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900">No media files found</h3>
                <p class="text-sm text-gray-500">{{ searchTerm ? `No results for "${searchTerm}"` : 'Upload your first file to get started' }}</p>
                <button v-if="!searchTerm" @click="uploadOpen = true" class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">
                    <Plus :size="14" /> Upload Files
                </button>
            </div>

            <!-- Media Grid -->
            <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                <div
                    v-for="item in paginatedMedia" :key="item.id"
                    class="group relative bg-white border rounded-lg overflow-hidden hover:shadow-md transition-all duration-200"
                >
                    <!-- Preview -->
                    <div class="relative aspect-square bg-gray-50 flex items-center justify-center">
                        <img
                            v-if="item.mime_type.startsWith('image/')"
                            :src="item.thumb_url || item.url"
                            :alt="item.name"
                            class="w-full h-full object-cover"
                            @error="(e) => ((e.target as HTMLImageElement).src = item.url)"
                        />
                        <div v-else class="flex flex-col items-center justify-center p-4 w-full h-full">
                            <div class="text-2xl mb-1">{{ fileEmoji(item.mime_type) }}</div>
                            <div class="text-xs text-gray-500 font-medium">{{ item.mime_type.split('/')[1]?.toUpperCase() }}</div>
                        </div>

                        <!-- Overlay -->
                        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200" />

                        <!-- Type badge -->
                        <div class="absolute top-2 left-2">
                            <span class="px-1.5 py-0.5 bg-white/90 text-xs font-semibold rounded shadow-sm">
                                {{ item.mime_type.split('/')[1]?.toUpperCase() }}
                            </span>
                        </div>

                        <!-- Dropdown -->
                        <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div class="relative" v-click-outside="() => closeMenu(item.id)">
                                <button
                                    @click.stop="toggleMenu(item.id)"
                                    class="w-8 h-8 bg-white/95 rounded-lg shadow flex items-center justify-center hover:bg-white"
                                >
                                    <MoreHorizontal :size="14" />
                                </button>
                                <div v-if="openMenu === item.id" class="absolute right-0 top-9 w-40 bg-white border rounded-lg shadow-lg z-20 py-1 text-sm">
                                    <button @click="showInfo(item)" class="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-left">
                                        <Info :size="13" /> View Info
                                    </button>
                                    <button @click="copyLink(item)" class="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-left">
                                        <Copy :size="13" /> Copy Link
                                    </button>
                                    <button @click="download(item)" class="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-left">
                                        <Download :size="13" /> Download
                                    </button>
                                    <div class="border-t my-1" />
                                    <button @click="deleteItem(item)" class="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600 text-left">
                                        <X :size="13" /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Card info -->
                    <div class="p-3">
                        <p class="text-sm font-medium truncate" :title="item.name">{{ item.name }}</p>
                        <div class="flex items-center justify-between mt-1 text-xs text-gray-400">
                            <span class="flex items-center gap-1"><HardDrive :size="11" /> {{ formatSize(item.size) }}</span>
                            <span>{{ formatDate(item.created_at) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t mt-6">
                <p class="text-sm text-gray-500">
                    Showing {{ (currentPage - 1) * perPage + 1 }}–{{ Math.min(currentPage * perPage, filteredMedia.length) }} of {{ filteredMedia.length }} files
                </p>
                <div class="flex items-center gap-1">
                    <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50">Previous</button>
                    <button
                        v-for="p in pageNumbers" :key="p"
                        @click="currentPage = p"
                        class="w-9 h-8 text-sm border rounded-lg"
                        :class="p === currentPage ? 'bg-primary text-white border-primary' : 'hover:bg-gray-50'"
                    >{{ p }}</button>
                    <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50">Next</button>
                </div>
            </div>
        </div>

        <!-- Upload Modal -->
        <div v-if="uploadOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
                <div class="flex items-center justify-between mb-5">
                    <h3 class="text-lg font-semibold flex items-center gap-2"><Upload :size="18" /> Upload Files</h3>
                    <button @click="uploadOpen = false" class="text-gray-400 hover:text-gray-600"><X :size="18" /></button>
                </div>
                <div
                    class="border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 cursor-pointer"
                    :class="dragActive ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'"
                    @dragenter.prevent="dragActive = true"
                    @dragleave.prevent="dragActive = false"
                    @dragover.prevent
                    @drop.prevent="handleDrop"
                    @click="fileInput?.click()"
                >
                    <div :class="dragActive ? 'scale-110' : ''" class="transition-transform duration-200">
                        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Upload :size="28" :class="dragActive ? 'text-primary' : 'text-gray-400'" />
                        </div>
                        <p class="text-base font-medium mb-1">{{ dragActive ? 'Drop files here' : 'Upload your files' }}</p>
                        <p class="text-sm text-gray-500 mb-5">Drag and drop files here, or click to browse</p>
                        <button
                            type="button"
                            :disabled="uploading"
                            class="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-60"
                        >
                            <Loader2 v-if="uploading" :size="14" class="animate-spin" />
                            <Plus v-else :size="14" />
                            {{ uploading ? 'Uploading...' : 'Choose Files' }}
                        </button>
                    </div>
                    <input ref="fileInput" type="file" multiple class="hidden" @change="handleFileChange" />
                </div>
            </div>
        </div>

        <!-- Info Modal -->
        <div v-if="infoItem" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
                <div class="flex items-center justify-between mb-5">
                    <h3 class="text-lg font-semibold flex items-center gap-2"><Info :size="18" /> File Information</h3>
                    <button @click="infoItem = null" class="text-gray-400 hover:text-gray-600"><X :size="18" /></button>
                </div>
                <div class="flex justify-center bg-gray-50 rounded-xl p-4 mb-5">
                    <img
                        v-if="infoItem.mime_type.startsWith('image/')"
                        :src="infoItem.thumb_url || infoItem.url"
                        :alt="infoItem.name"
                        class="max-h-48 object-contain rounded-lg"
                        @error="(e) => ((e.target as HTMLImageElement).src = infoItem!.url)"
                    />
                    <div v-else class="flex flex-col items-center justify-center h-48">
                        <div class="text-6xl mb-2">{{ fileEmoji(infoItem.mime_type) }}</div>
                        <p class="text-sm text-gray-500">{{ infoItem.mime_type.split('/')[1]?.toUpperCase() }}</p>
                    </div>
                </div>
                <div class="space-y-3 text-sm mb-5">
                    <div class="flex justify-between"><span class="text-gray-500 font-medium">File Name</span><span class="truncate max-w-xs text-right">{{ infoItem.file_name }}</span></div>
                    <div class="flex justify-between"><span class="text-gray-500 font-medium">Type</span><span class="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">{{ infoItem.mime_type }}</span></div>
                    <div class="flex justify-between"><span class="text-gray-500 font-medium">Size</span><span>{{ formatSize(infoItem.size) }}</span></div>
                    <div class="flex justify-between"><span class="text-gray-500 font-medium">Uploaded</span><span>{{ formatDate(infoItem.created_at, true) }}</span></div>
                    <div class="pt-2 border-t">
                        <p class="text-gray-500 font-medium mb-2">URL</p>
                        <div class="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                            <code class="text-xs text-gray-600 flex-1 truncate">{{ infoItem.url }}</code>
                            <button @click="copyLink(infoItem)" class="p-1 hover:bg-gray-200 rounded"><Copy :size="13" /></button>
                        </div>
                    </div>
                </div>
                <div class="flex gap-3">
                    <button @click="copyLink(infoItem)" class="flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
                        <Copy :size="14" /> Copy Link
                    </button>
                    <button @click="download(infoItem)" class="flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
                        <Download :size="14" /> Download
                    </button>
                </div>
            </div>
        </div>

    </PageTemplate>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { usePage } from '@inertiajs/vue3';
import PageTemplate from '@/components/page-template.vue';
import { Upload, Search, Copy, Download, ImageIcon, Plus, X, Info, MoreHorizontal, HardDrive, Loader2 } from 'lucide-vue-next';

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

const page = usePage<any>();
const csrfToken = computed(() => page.props.csrf_token as string);

const media = ref<MediaItem[]>([]);
const filteredMedia = ref<MediaItem[]>([]);
const loading = ref(false);
const searchTerm = ref('');
const currentPage = ref(1);
const perPage = 12;
const uploadOpen = ref(false);
const uploading = ref(false);
const dragActive = ref(false);
const infoItem = ref<MediaItem | null>(null);
const openMenu = ref<number | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

// Stats
const totalSize = computed(() => formatSize(filteredMedia.value.reduce((a, i) => a + i.size, 0)));
const imageCount = computed(() => filteredMedia.value.filter(i => i.mime_type.startsWith('image/')).length);

// Pagination
const totalPages = computed(() => Math.ceil(filteredMedia.value.length / perPage));
const paginatedMedia = computed(() => {
    const start = (currentPage.value - 1) * perPage;
    return filteredMedia.value.slice(start, start + perPage);
});
const pageNumbers = computed(() => {
    const total = totalPages.value;
    const cur = currentPage.value;
    const pages: number[] = [];
    const start = Math.max(1, cur - 2);
    const end = Math.min(total, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
});

watch(searchTerm, (term) => {
    filteredMedia.value = term
        ? media.value.filter(i => i.name.toLowerCase().includes(term.toLowerCase()) || i.file_name.toLowerCase().includes(term.toLowerCase()))
        : [...media.value];
    currentPage.value = 1;
});

async function fetchMedia() {
    loading.value = true;
    try {
        const res = await fetch(route('media.index'), {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'same-origin',
        });
        const data = await res.json();
        media.value = data;
        filteredMedia.value = data;
    } catch {
        showToast('Failed to load media', 'error');
    } finally {
        loading.value = false;
    }
}

async function uploadFiles(files: FileList) {
    uploading.value = true;
    const formData = new FormData();
    Array.from(files).forEach(f => formData.append('files[]', f));
    try {
        const res = await fetch(route('media.batch'), {
            method: 'POST',
            headers: { 'X-CSRF-TOKEN': csrfToken.value, 'X-Requested-With': 'XMLHttpRequest' },
            body: formData,
            credentials: 'same-origin',
        });
        const result = await res.json();
        if (res.ok) {
            media.value = [...result.data, ...media.value];
            filteredMedia.value = [...result.data, ...filteredMedia.value];
            showToast(result.message || 'Uploaded successfully');
            uploadOpen.value = false;
        } else {
            showToast(result.message || 'Upload failed', 'error');
        }
    } catch {
        showToast('Upload failed', 'error');
    } finally {
        uploading.value = false;
    }
}

function handleFileChange(e: Event) {
    const files = (e.target as HTMLInputElement).files;
    if (files?.length) uploadFiles(files);
}

function handleDrop(e: DragEvent) {
    dragActive.value = false;
    if (e.dataTransfer?.files.length) uploadFiles(e.dataTransfer.files);
}

async function deleteItem(item: MediaItem) {
    if (!confirm(`Delete "${item.name}"?`)) return;
    try {
        const res = await fetch(route('media.destroy', item.id), {
            method: 'DELETE',
            headers: { 'X-CSRF-TOKEN': csrfToken.value, 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'same-origin',
        });
        if (res.ok) {
            media.value = media.value.filter(i => i.id !== item.id);
            filteredMedia.value = filteredMedia.value.filter(i => i.id !== item.id);
            showToast('Deleted successfully');
        } else {
            showToast('Delete failed', 'error');
        }
    } catch {
        showToast('Delete failed', 'error');
    }
    openMenu.value = null;
}

function copyLink(item: MediaItem) {
    const copy = (text: string) => {
        if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed'; ta.style.left = '-9999px';
        document.body.appendChild(ta); ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        return ok ? Promise.resolve() : Promise.reject();
    };
    copy(item.url).then(() => showToast('Link copied')).catch(() => showToast('Copy failed', 'error'));
    openMenu.value = null;
}

function download(item: MediaItem) {
    const a = document.createElement('a');
    a.href = route('media.download', item.id);
    a.download = item.file_name;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    openMenu.value = null;
}

function showInfo(item: MediaItem) {
    infoItem.value = item;
    openMenu.value = null;
}

function toggleMenu(id: number) { openMenu.value = openMenu.value === id ? null : id; }
function closeMenu(id: number) { if (openMenu.value === id) openMenu.value = null; }

function formatSize(bytes: number) {
    if (!bytes) return '0 B';
    const k = 1024, sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatDate(d: string, full = false) {
    return full ? new Date(d).toLocaleString() : new Date(d).toLocaleDateString();
}

function fileEmoji(mime: string) {
    if (mime.startsWith('image/')) return '🖼️';
    if (mime.includes('pdf')) return '📄';
    if (mime.includes('word') || mime.includes('document')) return '📝';
    if (mime.includes('csv') || mime.includes('spreadsheet') || mime.includes('excel')) return '📊';
    if (mime.startsWith('video/')) return '🎬';
    if (mime.startsWith('audio/')) return '🎵';
    return '📁';
}

// Simple toast
function showToast(msg: string, type: 'success' | 'error' = 'success') {
    const el = document.createElement('div');
    el.className = `fixed bottom-4 right-4 z-[9999] px-4 py-3 rounded-lg text-white text-sm shadow-lg transition-all ${type === 'error' ? 'bg-red-600' : 'bg-green-600'}`;
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
}

// v-click-outside directive
const vClickOutside = {
    mounted(el: HTMLElement, binding: any) {
        el._clickOutside = (e: Event) => { if (!el.contains(e.target as Node)) binding.value(e); };
        document.addEventListener('click', el._clickOutside);
    },
    unmounted(el: HTMLElement) { document.removeEventListener('click', el._clickOutside); },
};

onMounted(fetchMedia);
</script>
