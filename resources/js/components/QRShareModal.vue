<template>
  <Dialog :open="isOpen" @update:open="onClose">
    <DialogContent class="sm:max-w-md">
      <div class="flex items-center justify-between">
        <DialogTitle>Share QR Code</DialogTitle>
        <Button variant="ghost" size="sm" @click="onClose">
          <X class="w-4 h-4" />
        </Button>
      </div>

      <div class="space-y-6">
        <!-- QR Code -->
        <div class="text-center">
          <div v-if="qrUrl" class="inline-block p-4 bg-white rounded-lg border">
            <img :src="qrUrl" alt="QR Code" class="w-48 h-48" />
          </div>
          <div v-else class="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
            <div class="text-gray-400">Generating QR Code...</div>
          </div>
        </div>

        <!-- URL Display -->
        <div class="space-y-2">
          <Label>Share URL</Label>
          <div class="flex items-center gap-2">
            <Input
              :value="url"
              readonly
              class="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              @click="handleCopyUrl"
            >
              <Copy v-if="!copied" class="w-4 h-4" />
              <Check v-else class="w-4 h-4" />
            </Button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-2 gap-2">
          <Button @click="handleDownload">
            <Download class="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button @click="handleShare">
            <Share2 class="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>

        <!-- Social Share -->
        <div class="space-y-3">
          <Button
            variant="outline"
            class="w-full"
            @click="showSocialIcons = !showSocialIcons"
          >
            Share on Social Media
          </Button>

          <div v-if="showSocialIcons && socialLinks.length > 0" class="flex justify-center gap-3">
            <a
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.url"
              target="_blank"
              class="p-2 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <SocialIcon :platform="social.name" class="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SocialIcon from '@/pages/link-bio-builder/components/SocialIcon.vue';
import QRCode from 'qrcode';
import { X, Download, Share2, Copy, Check } from 'lucide-vue-next';

interface QRShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  colors?: any;
  font?: string;
  socialLinks?: any[];
}

const props = withDefaults(defineProps<QRShareModalProps>(), {
  socialLinks: () => []
});

const qrUrl = ref('');
const copied = ref(false);
const showSocialIcons = ref(false);

watch(() => props.isOpen, async (isOpen) => {
  if (isOpen && props.url) {
    try {
      qrUrl.value = await QRCode.toDataURL(props.url, {
        width: 200,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' }
      });
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  }
});

const handleDownload = () => {
  if (qrUrl.value) {
    const link = document.createElement('a');
    link.download = 'qr-code.png';
    link.href = qrUrl.value;
    link.click();
  }
};

const handleShare = async () => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: 'My Contact',
        text: 'Check out my digital business card',
        url: props.url
      });
    } else {
      // Fallback: copy to clipboard
      handleCopyUrl();
    }
  } catch (error) {
    console.error('Failed to share:', error);
  }
};

const handleCopyUrl = async () => {
  try {
    await navigator.clipboard.writeText(props.url);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (error) {
    console.error('Failed to copy URL:', error);
  }
};
</script>

<style scoped>
.qr-share-modal {
  max-width: 100%;
}
</style>
