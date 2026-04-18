import { ref, computed, watch } from 'vue';
import { usePage } from '@inertiajs/vue3';
import { route } from 'ziggy-js';

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
    const csrfToken = computed(() => {
        const token = page.props.csrf_token;
        if (!token) {
            console.error('CSRF token not found in page props');
        }
        return token as string;
    });

    const media = ref<MediaItem[]>([]);
    const filteredMedia = ref<MediaItem[]>([]);
    const loading = ref(false);
    const uploading = ref(false);
    const searchTerm = ref('');
    const currentPage = ref(1);
    const perPage = 18;

    const totalSize = computed(() => {
        const items = Array.isArray(filteredMedia.value) ? filteredMedia.value : [];
        return formatSize(items.reduce((a, i) => a + (i.size || 0), 0));
    });
    const imageCount = computed(() => {
        const items = Array.isArray(filteredMedia.value) ? filteredMedia.value : [];
        return items.filter(i => i.mime_type?.startsWith('image/')).length;
    });
    const totalPages = computed(() => {
        const items = Array.isArray(filteredMedia.value) ? filteredMedia.value : [];
        return Math.ceil(items.length / perPage);
    });
    const paginatedMedia = computed(() => {
        const items = Array.isArray(filteredMedia.value) ? filteredMedia.value : [];
        const start = (currentPage.value - 1) * perPage;
        return items.slice(start, start + perPage);
    });

    watch(searchTerm, (term: string) => {
        const items = Array.isArray(media.value) ? media.value : [];
        filteredMedia.value = term
            ? items.filter(i =>
                i.name?.toLowerCase().includes(term.toLowerCase()) ||
                i.file_name?.toLowerCase().includes(term.toLowerCase())
            )
            : [...items];
        if (!Array.isArray(filteredMedia.value)) filteredMedia.value = [];
        currentPage.value = 1;
    });

    // Helper to convert object-with-numeric-keys to proper array
    function normalizeToArray(obj: any): MediaItem[] {
        if (Array.isArray(obj)) return obj;
        if (obj && typeof obj === 'object') {
            // Check if it's an object with numeric keys (like {0: {}, 1: {}})
            const keys = Object.keys(obj);
            if (keys.length > 0 && keys.every(k => /^\d+$/.test(k))) {
                return keys.sort((a, b) => parseInt(a) - parseInt(b)).map(k => obj[k]);
            }
        }
        return [];
    }

    async function fetchMedia() {
        loading.value = true;
        try {
            const res = await fetch(route('media.index'), {
                headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                credentials: 'same-origin',
            });
            if (!res.ok) {
                const errorText = await res.text();
                console.error('fetchMedia failed:', res.status, errorText);
                throw new Error(`HTTP ${res.status}: ${errorText}`);
            }
            const json = await res.json();
            console.log('fetchMedia response:', json);

            // Handle various API response formats
            let rawData: any = null;
            if (Array.isArray(json)) {
                rawData = json;
            } else if (json.data) {
                rawData = json.data;
            }

            // Normalize to proper array (handles Laravel Collection objects)
            const data = normalizeToArray(rawData);
            console.log('Normalized data:', data, 'isArray:', Array.isArray(data));

            media.value = Array.isArray(data) ? data : [];
            filteredMedia.value = [...(Array.isArray(data) ? data : [])];
        } catch (err) {
            console.error('Failed to fetch media:', err);
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
                const uploaded: MediaItem[] = Array.isArray(result.data) ? result.data : [];
                media.value = [...uploaded, ...(Array.isArray(media.value) ? media.value : [])];
                filteredMedia.value = [...uploaded, ...(Array.isArray(filteredMedia.value) ? filteredMedia.value : [])];
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

    function fileEmoji(mime: string | null | undefined) {
        if (!mime) return '📁';
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
        el.className = `fixed bottom-4 right-4 z-[9999] px-4 py-3 rounded-lg text-white text-sm shadow-lg transition-opacity duration-300 ${type === 'error' ? 'bg-red-600' : 'bg-green-600'}`;
        el.textContent = msg;
        document.body.appendChild(el);

        const remove = () => {
            el.style.opacity = '0';
            setTimeout(() => el.remove(), 300);
        };

        // Auto remove after 3 seconds
        const timeoutId = setTimeout(remove, 3000);

        // Allow manual dismissal on click
        el.addEventListener('click', () => {
            clearTimeout(timeoutId);
            remove();
        });
    }

    return {
        media, filteredMedia, loading, uploading, searchTerm, currentPage, perPage,
        totalSize, imageCount, totalPages, paginatedMedia,
        fetchMedia, uploadFiles, deleteMedia,
        formatSize, formatDate, fileEmoji, showToast,
    };
}
