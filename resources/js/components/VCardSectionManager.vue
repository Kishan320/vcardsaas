<template>
  <div class="vcard-section-manager space-y-6">
    <Card>
      <CardContent class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold">Section Manager</h3>
          <Badge variant="outline">
            {{ enabledSections.length }}/{{ sections.length }} Active
          </Badge>
        </div>

        <DragDropContext @drag-end="handleDragEnd">
          <Droppable droppableId="sections">
            <template #provided>
              <div 
                v-bind="provided.droppableProps"
                :ref="provided.innerRef"
                class="space-y-3"
              >
                <Draggable
                  v-for="(section, index) in orderedSections"
                  :key="section.key"
                  :draggable-id="section.key"
                  :index="index"
                >
                  <template #provided>
                    <div
                      v-bind="provided.draggableProps"
                      :ref="provided.innerRef"
                      class="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                          <div
                            v-bind="provided.dragHandleProps"
                            class="cursor-grab"
                          >
                            <GripVertical class="w-5 h-5 text-gray-400" />
                          </div>
                          
                          <div class="flex-1">
                            <div class="flex items-center gap-2">
                              <h4 class="font-medium">{{ section.name }}</h4>
                              {section.required && (
                                <Badge variant="secondary" class="text-xs">
                                  Required
                                </Badge>
                              )}
                            </div>
                            
                            {section.description && (
                              <p class="text-sm text-gray-500 mt-1">
                                {{ section.description }}
                              </p>
                            )}
                          </div>
                        </div>

                        <div class="flex items-center gap-2">
                          <Switch
                            :checked="section.enabled"
                            @update:checked="toggleSection(section.key, $event)"
                          />
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            @click="editSection(section)"
                          >
                            <Settings class="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {section.enabled && section.fields && section.fields.length > 0 && (
                        <div class="mt-4 pt-4 border-t">
                          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {section.fields.map((field: any) => (
                              <div :key="field.key" class="space-y-2">
                                <Label :for="field.key">
                                  {{ field.label }}
                                  {field.required && <span class="text-red-500">*</span>}
                                </Label>
                                
                                {field.type === 'text' && (
                                  <Input
                                    :id="field.key"
                                    :value="getFieldValue(section.key, field.key)"
                                    @input="updateField(section.key, field.key, $event.target.value)"
                                    :placeholder="field.placeholder"
                                  />
                                )}
                                
                                {field.type === 'textarea' && (
                                  <Textarea
                                    :id="field.key"
                                    :value="getFieldValue(section.key, field.key)"
                                    @input="updateField(section.key, field.key, $event.target.value)"
                                    :placeholder="field.placeholder"
                                    rows="3"
                                  />
                                )}
                                
                                {field.type === 'media' && (
                                  <MediaPicker
                                    :value="getFieldValue(section.key, field.key)"
                                    @change="updateField(section.key, field.key, $event)"
                                    :accept="field.accept"
                                  />
                                )}
                                
                                {field.type === 'switch' && (
                                  <Switch
                                    :checked="getFieldValue(section.key, field.key)"
                                    @update:checked="updateField(section.key, field.key, $event)"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </template>
                </Draggable>
                
                <div v-bind="provided.placeholder" />
              </div>
            </template>
          </Droppable>
        </DragDropContext>
      </CardContent>
    </Card>

    <!-- Section Edit Modal -->
    <Modal v-if="editingSection" @close="editingSection = null">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full">
        <h3 class="text-lg font-semibold mb-4">Edit {{ editingSection.name }}</h3>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <Label>Enable Section</Label>
            <Switch
              :checked="editingSection.enabled"
              @update:checked="toggleSection(editingSection.key, $event)"
            />
          </div>

          {editingSection.fields && editingSection.fields.map((field: any) => (
            <div :key="field.key" class="space-y-2">
              <Label :for="`edit-${field.key}`">
                {{ field.label }}
                {field.required && <span class="text-red-500">*</span>}
              </Label>
              
              {field.type === 'text' && (
                <Input
                  :id="`edit-${field.key}`"
                  :value="getFieldValue(editingSection.key, field.key)"
                  @input="updateField(editingSection.key, field.key, $event.target.value)"
                  :placeholder="field.placeholder"
                />
              )}
              
              {field.type === 'textarea' && (
                <Textarea
                  :id="`edit-${field.key}`"
                  :value="getFieldValue(editingSection.key, field.key)"
                  @input="updateField(editingSection.key, field.key, $event.target.value)"
                  :placeholder="field.placeholder"
                  rows="3"
                />
              )}
              
              {field.type === 'media' && (
                <MediaPicker
                  :value="getFieldValue(editingSection.key, field.key)"
                  @change="updateField(editingSection.key, field.key, $event)"
                  :accept="field.accept"
                />
              )}
            </div>
          ))}
        </div>

        <div class="flex justify-end gap-2 mt-6">
          <Button variant="outline" @click="editingSection = null">
            Cancel
          </Button>
          <Button @click="editingSection = null">
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/ui/Modal.vue';
import MediaPicker from '@/components/MediaPicker.vue';
import { 
  DragDropContext, 
  Droppable, 
  Draggable,
  type DropResult 
} from '@hello-pangea/dnd';
import { 
  GripVertical, 
  Settings
} from 'lucide-vue-next';

interface SectionConfig {
  key: string;
  name: string;
  description?: string;
  enabled: boolean;
  order: number;
  fields: any[];
  required: boolean;
}

interface VCardSectionManagerProps {
  sections: any[];
  templateConfig: any;
  onUpdateSection: (sectionKey: string, field: string, value: any) => void;
  onToggleSection: (sectionKey: string, enabled: boolean) => void;
  onReorderSections: (sections: SectionConfig[]) => void;
  planFeatures?: { business_template_sections?: string[] };
  isSuperAdmin?: boolean;
}

const props = defineProps<VCardSectionManagerProps>();

const editingSection = ref<SectionConfig | null>(null);

const orderedSections = computed(() => {
  return props.sections
    .map(section => ({
      ...section,
      enabled: props.templateConfig.sectionSettings?.[section.key]?.enabled !== false
    }))
    .sort((a, b) => {
      const orderA = props.templateConfig.sectionSettings?.[a.key]?.order ?? a.order;
      const orderB = props.templateConfig.sectionSettings?.[b.key]?.order ?? b.order;
      return orderA - orderB;
    });
});

const enabledSections = computed(() => {
  return orderedSections.value.filter(section => section.enabled);
});

const toggleSection = (sectionKey: string, enabled: boolean) => {
  props.onToggleSection(sectionKey, enabled);
};

const editSection = (section: SectionConfig) => {
  editingSection.value = section;
};

const getFieldValue = (sectionKey: string, fieldKey: string) => {
  return props.templateConfig.sectionSettings?.[sectionKey]?.[fieldKey] || '';
};

const updateField = (sectionKey: string, fieldKey: string, value: any) => {
  props.onUpdateSection(sectionKey, fieldKey, value);
};

const handleDragEnd = (result: DropResult) => {
  if (!result.destination) return;

  const items = Array.from(orderedSections.value);
  const [reorderedItem] = items.splice(result.source.index, 1);
  items.splice(result.destination.index, 0, reorderedItem);

  const updatedSections = items.map((section, index) => ({
    ...section,
    order: index
  }));

  props.onReorderSections(updatedSections);
};
</script>

<style scoped>
.vcard-section-manager {
  max-width: 100%;
}
</style>
