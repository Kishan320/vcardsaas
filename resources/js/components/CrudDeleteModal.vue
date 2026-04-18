<template>
  <Dialog :open="isOpen" @update:open="onClose">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Delete {{ entityName }}</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete {{ itemName || `this ${entityName}` }}? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter class="sm:justify-end">
        <Button type="button" variant="outline" @click="onClose">
          Cancel
        </Button>
        <Button type="button" variant="destructive" @click="onConfirm">
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CrudDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  entityName: string;
}

defineProps<CrudDeleteModalProps>();
</script>

<style scoped>
.crud-delete-modal {
  /* Component styles are handled by Tailwind classes */
}
</style>
