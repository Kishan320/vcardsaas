<template>
  <Dialog :open="isOpen" @update:open="onClose">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Share {{ title }}</DialogTitle>
      </DialogHeader>

      <div class="space-y-4">
        <!-- URL Input -->
        <div>
          <Label for="share-url">Share Link</Label>
          <div class="flex gap-2 mt-1">
            <Input
              id="share-url"
              :value="url"
              readonly
              class="flex-1"
            />
            <Button @click="handleCopyLink" variant="outline" size="sm">
              <Link class="w-4 h-4" />
            </Button>
          </div>
        </div>

        <!-- Social Share Buttons -->
        <div class="space-y-2">
          <Label>Share on</Label>
          <div class="grid grid-cols-2 gap-2">
            <Button @click="handleFacebookShare" variant="outline" size="sm" class="flex items-center gap-2">
              <Facebook class="w-4 h-4" />
              Facebook
            </Button>
            <Button @click="handleLinkedInShare" variant="outline" size="sm" class="flex items-center gap-2">
              <Linkedin class="w-4 h-4" />
              LinkedIn
            </Button>
            <Button @click="handleTwitterShare" variant="outline" size="sm" class="flex items-center gap-2">
              <XLogo class="w-4 h-4" />
              X (Twitter)
            </Button>
            <Button @click="handleEmailShare" variant="outline" size="sm" class="flex items-center gap-2">
              <Mail class="w-4 h-4" />
              Email
            </Button>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button @click="onClose" variant="outline">
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/custom-toast';
import { Facebook, Linkedin, Mail, Link } from 'lucide-vue-next';
import XLogo from '@/components/icons/XLogo.vue';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

const props = defineProps<ShareModalProps>();

const handleCopyLink = () => {
  // Fallback clipboard function for HTTP environments
  const copyToClipboard = (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      // Use modern clipboard API for HTTPS
      return navigator.clipboard.writeText(text);
    } else {
      // Fallback for HTTP environments
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      return new Promise<void>((resolve, reject) => {
        if (document.execCommand('copy')) {
          textArea.remove();
          resolve();
        } else {
          textArea.remove();
          reject(new Error('Copy failed'));
        }
      });
    }
  };

  copyToClipboard(props.url)
    .then(() => {
      toast.success('Link copied to clipboard');
    })
    .catch(() => {
      toast.error('Failed to copy link');
    });
};

const handleFacebookShare = () => {
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(props.url)}`;
  window.open(shareUrl, '_blank', 'width=600,height=400');
};

const handleLinkedInShare = () => {
  const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(props.url)}`;
  window.open(shareUrl, '_blank', 'width=600,height=400');
};

const handleTwitterShare = () => {
  const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(props.url)}&text=${encodeURIComponent(props.title)}`;
  window.open(shareUrl, '_blank', 'width=600,height=400');
};

const handleEmailShare = () => {
  const shareUrl = `mailto:?subject=${encodeURIComponent(props.title)}&body=${encodeURIComponent(`Check out this ${props.title}: ${props.url}`)}`;
  window.location.href = shareUrl;
};
</script>

<style scoped>
.share-modal {
  /* Component styles are handled by Tailwind classes */
}
</style>
