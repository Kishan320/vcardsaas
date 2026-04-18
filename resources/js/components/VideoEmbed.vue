<template>
  <div class="video-embed">
    <iframe
      v-if="videoUrl"
      :src="embedUrl"
      frameborder="0"
      allowfullscreen
      class="w-full h-full rounded-lg"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface VideoEmbedProps {
  url: string;
}

const props = defineProps<VideoEmbedProps>();

const videoUrl = computed(() => props.url);

const embedUrl = computed(() => {
  if (!props.url) return '';
  
  // YouTube
  if (props.url.includes('youtube.com') || props.url.includes('youtu.be')) {
    const videoId = extractYouTubeId(props.url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  }
  
  // Vimeo
  if (props.url.includes('vimeo.com')) {
    const videoId = extractVimeoId(props.url);
    return videoId ? `https://player.vimeo.com/video/${videoId}` : '';
  }
  
  return props.url;
});

function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function extractVimeoId(url: string): string | null {
  const regExp = /^.*(vimeo.com\/)(\d+).*$/;
  const match = url.match(regExp);
  return match ? match[2] : null;
}

export function extractVideoUrl(url: string): string {
  if (!url) return '';
  
  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = extractYouTubeId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  }
  
  // Vimeo
  if (url.includes('vimeo.com')) {
    const videoId = extractVimeoId(url);
    return videoId ? `https://player.vimeo.com/video/${videoId}` : '';
  }
  
  return url;
}
</script>

<style scoped>
.video-embed {
  /* Component styles are handled by Tailwind classes */
}
</style>
