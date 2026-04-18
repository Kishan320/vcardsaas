import { ref, computed, watch } from 'vue';
import { usePage } from '@inertiajs/vue3';

export interface MediaItem {
    id: number;
    name: string;
    file_name: string;
    url: string;
    thumb_url: string;
    size: number;
    mime_type: string;
    created_at: string;
}

export function useMediaLibrary() {
    const page = usePage<any>();
    const csrfToken = computed(() => page.props.csrf_token as string);

    const media = ref<MediaItem[]>([]);
    const filteredMedia = ref<MediaItem[]>([]);
    const loading = ref(false);
    const uploading = ref(false);
    const searchTerm = ref('');
    const currentPage = ref(1);
    const perPage = 18;

    const totalSize = computed(() => formatSize(filteredMedia.value.reduce((a, i) => a + i.size, 0)));
    const imageCount = computed(() => filteredMedia.value.filter(i => i.mime_type.startsWith('image/')).length);
    const totalPages = computed(() => Math.ceil(filteredMedia.value.length / perPage));
    const paginatedMedia = computed(() => {
        const start = (currentPage.value - 1) * perPage;
        return filteredMedia.value.slice(start, start + perPage);
    });

    watch(searchTerm, (term: string) => {
        filteredMedia.value = term
            ? media.value.filter(i =>
                i.name.toLowerCase().includes(term.toLowerCase()) ||
                i.file_name.toLowerCase().includes(term.toLowerCase())
            )
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
            const json = await res.json();
            const data: MediaItem[] = Array.isArray(json) ? json : (json.data ?? []);
            media.value = data;
            filteredMedia.value = data;
        } catch {
            showToast('Failed to load media', 'error');
        } finally {
            loading.value = false;
        }
    }

    async function uploadFiles(files: FileList, onSuccess?: (uploaded: MediaItem[]) => void) {
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
                const uploaded: MediaItem[] = result.data ?? [];
                media.value = [...uploaded, ...media.value];
                filteredMedia.value = [...uploaded, ...filteredMedia.value];
                showToast(result.message || 'Uploaded successfully');
                onSuccess?.(uploaded);
            } else {
                showToast(result.message || 'Upload failed', 'error');
            }
        } catch {
            showToast('Upload failed', 'error');
        } finally {
            uploading.value = false;
        }
    }

    async function deleteMedia(item: MediaItem) {
        if (!confirm(`Delete "${item.name}"?`)) return false;
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
                return true;
            } else {
                showToast('Delete failed', 'error');
            }
        } catch {
            showToast('Delete failed', 'error');
        }
        return false;
    }

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

    function showToast(msg: string, type: 'success' | 'error' = 'success') {
        const el = document.createElement('div');
        el.className = `fixed bottom-4 right-4 z-[9999] px-4 py-3 rounded-lg text-white text-sm shadow-lg ${type === 'error' ? 'bg-red-600' : 'bg-green-600'}`;
        el.textContent = msg;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3000);
    }

    return {
        media, filteredMedia, loading, uploading, searchTerm, currentPage, perPage,
        totalSize, imageCount, totalPages, paginatedMedia,
        fetchMedia, uploadFiles, deleteMedia,
        formatSize, formatDate, fileEmoji, showToast,
    };
}
