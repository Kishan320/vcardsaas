<template>
  <Dialog :open="isOpen" @update:open="onClose">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>QR Code for {{ title }}</DialogTitle>
      </DialogHeader>
      <div class="flex flex-col items-center justify-center p-4">
        <img v-if="qrUrl" :src="qrUrl" alt="QR Code" class="border rounded-md w-[300px] h-[300px]" />
        <div v-else class="border rounded-md w-[300px] h-[300px] flex items-center justify-center bg-gray-100">
          <p class="text-gray-500">Loading QR code...</p>
        </div>
        <p class="mt-4 text-sm text-center text-muted-foreground">
          Scan this QR code to access the vCard
        </p>
      </div>
      <DialogFooter class="flex flex-col sm:flex-row sm:justify-between gap-2">
        <Button variant="outline" @click="onClose">
          Close
        </Button>
        <Button @click="handleDownload">
          Download QR Code
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import QRCode from 'qrcode';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

const props = defineProps<QRCodeModalProps>();

const qrUrl = ref('');

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    // Generate QR code as data URL
    QRCode.toDataURL(props.url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })
    .then(dataUrl => {
      qrUrl.value = dataUrl;
    })
    .catch(err => {
      console.error('Error generating QR code:', err);
    });
  }
});

const handleDownload = () => {
  if (qrUrl.value) {
    const link = document.createElement('a');
    link.download = `${props.title.replace(/\s+/g, '-').toLowerCase()}-qrcode.png`;
    link.href = qrUrl.value;
    link.click();
  }
};
</script>

<style scoped>
.qr-code-modal {
  /* Component styles are handled by Tailwind classes */
}
</style>
