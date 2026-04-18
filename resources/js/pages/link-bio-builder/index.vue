<template>
    <AppLayout>
        <Head title="Link in Bio Builder" />
        <FlashMessage />
        <div class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Link in Bio Builder</h1>
                    <p class="text-sm text-gray-500 mt-0.5">Create beautiful link-in-bio pages</p>
                </div>
                <Link :href="route('link-bio-builder.create')" class="inline-flex items-center gap-2 px-4 py-2 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all active:scale-95">
                    <Plus :size="16" /> Create Bio Link
                </Link>
            </div>

            <div v-if="bioLinks.data?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="link in bioLinks.data" :key="link.id" class="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden card-hover">
                    <div class="h-20 gradient-primary relative">
                        <div class="absolute inset-0 opacity-20">
                            <div class="absolute top-2 left-4 w-10 h-10 rounded-full bg-white/30" />
                        </div>
                        <div class="absolute bottom-3 left-4 right-4">
                            <h3 class="text-base font-bold text-white truncate">{{ link.title }}</h3>
                            <p class="text-xs text-white/80">{{ link.username }}</p>
                        </div>
                    </div>
                    <div class="p-4">
                        <div class="flex gap-2">
                            <Link :href="route('link-bio-builder.edit', link.id)" class="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold gradient-primary text-white rounded-lg hover:opacity-90 transition-all">
                                <Pencil :size="12" /> Edit
                            </Link>
                            <Link :href="route('link-bio-builder.analytics', link.id)" class="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <BarChart3 :size="12" /> Analytics
                            </Link>
                            <button @click="handleDelete(link)" class="p-2 text-red-500 border border-red-100 rounded-lg hover:bg-red-50 transition-colors">
                                <Trash2 :size="14" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="bg-white border border-gray-100 rounded-2xl shadow-card p-12 text-center">
                <div class="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Link2 :size="28" class="text-white" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">No Bio Links Yet</h3>
                <p class="text-sm text-gray-500 mb-6">Create your first link-in-bio page to share all your links in one place.</p>
                <Link :href="route('link-bio-builder.create')" class="inline-flex items-center gap-2 px-5 py-2.5 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all">
                    <Plus :size="16" /> Create Bio Link
                </Link>
            </div>

            <Pagination v-if="bioLinks.links?.length > 3" :links="bioLinks.links" :from="bioLinks.from ?? 0" :to="bioLinks.to ?? 0" :total="bioLinks.total ?? 0" />
        </div>

        <Modal :show="showDeleteModal" max-width="sm" :closeable="true" @close="showDeleteModal = false">
            <div class="p-6">
                <h3 class="font-semibold text-gray-900 mb-2">Delete Bio Link</h3>
                <p class="text-sm text-gray-600 mb-6">Delete <strong>{{ selectedLink?.title }}</strong>?</p>
                <div class="flex gap-3 justify-end">
                    <button @click="showDeleteModal = false" class="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                    <button @click="confirmDelete" :disabled="deleteForm.processing" class="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">Delete</button>
                </div>
            </div>
        </Modal>
    </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import { Plus, Pencil, Trash2, BarChart3, Link2 } from 'lucide-vue-next';
import AppLayout from '@/layouts/AppLayout.vue';
import FlashMessage from '@/components/ui/FlashMessage.vue';
import Modal from '@/components/ui/Modal.vue';
import Pagination from '@/components/ui/Pagination.vue';

interface BioLink { id: number; title: string; username: string }

const props = defineProps<{
    bioLinks: { data: BioLink[]; links: any[]; from?: number; to?: number; total?: number };
}>();

const showDeleteModal = ref(false);
const selectedLink = ref<BioLink | null>(null);
const deleteForm = useForm({});

const handleDelete = (l: BioLink) => { selectedLink.value = l; showDeleteModal.value = true; };
const confirmDelete = () => {
    if (!selectedLink.value) return;
    deleteForm.delete(route('link-bio-builder.destroy', selectedLink.value.id), { onSuccess: () => { showDeleteModal.value = false; } });
};
</script>
