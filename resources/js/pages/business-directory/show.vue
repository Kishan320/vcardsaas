<template>
    <div class="min-h-screen bg-gray-50">
        <Head :title="`${business?.name} - Business Directory`" />

        <!-- Hero Header -->
        <div class="bg-white border-b shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div class="mb-4">
                    <Link :href="route('directory.index')" class="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <ArrowLeft :size="14" /> Back to Directory
                    </Link>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="lg:col-span-2">
                        <div class="flex flex-wrap items-start gap-3 mb-3">
                            <h1 class="text-3xl lg:text-4xl font-bold text-gray-900">{{ business?.name }}</h1>
                            <div class="flex gap-2">
                                <span v-if="business?.is_verified" class="text-xs bg-green-100 text-green-800 border border-green-200 px-2 py-1 rounded-full">
                                    ✓ Verified
                                </span>
                                <span v-if="business?.is_featured" class="text-xs bg-yellow-100 text-yellow-800 border border-yellow-200 px-2 py-1 rounded-full">
                                    ⭐ Featured
                                </span>
                            </div>
                        </div>

                        <p class="text-lg text-gray-600 capitalize mb-4">{{ business?.business_type?.replace('-', ' ') }}</p>

                        <div class="flex flex-wrap items-center gap-4 mb-4">
                            <div v-if="business?.rating > 0" class="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5">
                                <Star :size="14" class="fill-yellow-400 text-yellow-400" />
                                <span class="font-semibold text-gray-900">{{ business.rating }}</span>
                                <span class="text-gray-600 text-sm">({{ business.rating_count }})</span>
                            </div>
                            <div class="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5">
                                <Eye :size="14" class="text-gray-600" />
                                <span class="text-gray-900 text-sm">{{ business?.view_count }} views</span>
                            </div>
                        </div>

                        <p v-if="business?.directory_description" class="text-gray-700 leading-relaxed">
                            {{ business.directory_description }}
                        </p>
                    </div>

                    <!-- Contact Card -->
                    <div>
                        <div class="rounded-xl border bg-white shadow-sm">
                            <div class="p-4 border-b">
                                <h3 class="text-base font-semibold flex items-center gap-2">
                                    <Phone :size="14" class="text-blue-600" /> Contact
                                </h3>
                            </div>
                            <div class="p-4 space-y-3">
                                <div v-if="contact.phone" class="flex items-center gap-3">
                                    <Phone :size="14" class="text-blue-600" />
                                    <a :href="`tel:${contact.phone}`" class="text-blue-700 hover:text-blue-800 text-sm">{{ contact.phone }}</a>
                                </div>
                                <div v-if="contact.email" class="flex items-center gap-3">
                                    <Mail :size="14" class="text-green-600" />
                                    <a :href="`mailto:${contact.email}`" class="text-green-700 hover:text-green-800 text-sm truncate">{{ contact.email }}</a>
                                </div>
                                <div v-if="contact.website" class="flex items-center gap-3">
                                    <Globe :size="14" class="text-purple-600" />
                                    <a :href="contact.website" target="_blank" rel="noopener noreferrer" class="text-purple-700 hover:text-purple-800 text-sm">Visit Website</a>
                                </div>
                                <div v-if="contact.address" class="flex items-start gap-3">
                                    <MapPin :size="14" class="text-orange-600 mt-0.5" />
                                    <span class="text-orange-700 text-sm leading-relaxed">{{ contact.address }}</span>
                                </div>
                                <div class="pt-3">
                                    <button
                                        @click="() => window.open(getBusinessUrl(), '_blank')"
                                        class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors"
                                    >
                                        <Globe :size="14" /> View Digital Card
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Content -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div class="lg:col-span-3 space-y-6">
                    <!-- About -->
                    <div v-if="about.description" class="rounded-xl border bg-white shadow-sm">
                        <div class="p-4 border-b">
                            <h3 class="text-lg font-semibold flex items-center gap-2">
                                <User :size="18" class="text-blue-600" /> About
                            </h3>
                        </div>
                        <div class="p-4">
                            <p class="text-gray-700 whitespace-pre-line leading-relaxed mb-4">{{ about.description }}</p>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div v-if="about.qualifications" class="p-3 bg-green-50 rounded-lg">
                                    <h4 class="font-medium mb-1 text-green-800 flex items-center gap-2 text-sm">
                                        <CheckCircle :size="14" /> Qualifications
                                    </h4>
                                    <p class="text-green-700 text-sm">{{ about.qualifications }}</p>
                                </div>
                                <div v-if="about.experience_years" class="p-3 bg-blue-50 rounded-lg">
                                    <h4 class="font-medium mb-1 text-blue-800 flex items-center gap-2 text-sm">
                                        <Clock :size="14" /> Experience
                                    </h4>
                                    <p class="text-blue-700 font-medium text-sm">{{ about.experience_years }} years</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Services -->
                    <div v-if="services.length > 0" class="rounded-xl border bg-white shadow-sm">
                        <div class="p-4 border-b">
                            <h3 class="text-lg font-semibold flex items-center gap-2">
                                <Briefcase :size="18" class="text-purple-600" /> Services
                            </h3>
                        </div>
                        <div class="p-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div
                                    v-for="(service, i) in services"
                                    :key="i"
                                    class="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                                >
                                    <h4 class="font-medium mb-2 text-gray-800">{{ service.name || service.title }}</h4>
                                    <p v-if="service.description" class="text-gray-600 mb-3 text-sm leading-relaxed">{{ service.description }}</p>
                                    <div class="flex justify-between items-center">
                                        <span v-if="service.price" class="text-sm font-semibold text-green-600">{{ service.price }}</span>
                                        <span v-if="service.duration" class="text-xs text-gray-500">{{ service.duration }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="space-y-6">
                    <!-- Business Hours -->
                    <div v-if="hours.length > 0" class="rounded-xl border bg-white shadow-sm">
                        <div class="p-4 border-b">
                            <h3 class="text-base font-semibold flex items-center gap-2">
                                <Clock :size="14" class="text-orange-600" /> Hours
                            </h3>
                        </div>
                        <div class="p-4 space-y-2">
                            <div v-for="(hour, i) in hours" :key="i" class="flex justify-between items-center py-1">
                                <span class="capitalize text-sm text-gray-700">{{ hour.day }}</span>
                                <span class="text-sm font-medium" :class="hour.is_closed ? 'text-red-600' : 'text-green-600'">
                                    {{ hour.is_closed ? 'Closed' : `${hour.open_time} - ${hour.close_time}` }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="rounded-xl border bg-white shadow-sm">
                        <div class="p-4 border-b">
                            <h3 class="text-base font-semibold flex items-center gap-2">
                                <Calendar :size="14" class="text-primary" /> Actions
                            </h3>
                        </div>
                        <div class="p-4 space-y-2">
                            <button
                                @click="() => window.open(getBusinessUrl(), '_blank')"
                                class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                <Globe :size="14" /> View Profile
                            </button>
                            <button
                                v-if="contact.phone"
                                @click="() => window.location.href = `tel:${contact.phone}`"
                                class="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Phone :size="14" /> Call
                            </button>
                            <button
                                v-if="contact.email"
                                @click="() => window.location.href = `mailto:${contact.email}`"
                                class="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Mail :size="14" /> Email
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Head, Link } from '@inertiajs/vue3';
import { ArrowLeft, Star, Eye, Phone, Mail, Globe, MapPin, Clock, Calendar, User, CheckCircle, Briefcase } from 'lucide-vue-next';

const props = defineProps<{ business?: any }>();

const contact = computed(() => {
    const c = props.business?.config_sections?.contact || {};
    return { phone: c.phone, email: c.email, website: c.website, address: c.address || c.clinic_address };
});

const hours = computed(() => props.business?.config_sections?.business_hours?.hours || []);

const services = computed(() => {
    const cfg = props.business?.config_sections || {};
    const list = cfg.services?.service_list || cfg.specialties?.specialty_list || cfg.menu_highlights?.menu_items || [];
    return list.slice(0, 6);
});

const about = computed(() => props.business?.config_sections?.about || {});

function getBusinessUrl() {
    const b = props.business;
    if (b?.url_prefix && b.url_prefix !== 'v') {
        return route('public.vcard.show', { prefix: b.url_prefix, slug: b.slug });
    }
    return route('public.vcard.show.direct', { slug: b?.slug });
}
</script>
