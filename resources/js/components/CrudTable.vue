<template>
  <div class="crud-table">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            v-for="column in columns"
            :key="column.key"
            :class="cn(column.className, column.sortable && 'cursor-pointer hover:bg-gray-50')"
            @click="column.sortable && onSort?.(column.key)"
          >
            <div class="flex items-center space-x-2">
              <span>{{ column.label }}</span>
              <div v-if="column.sortable" class="flex flex-col">
                <ChevronUp
                  class="w-3 h-3 -mb-1"
                  :class="cn(
                    sortField === column.key && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'
                  )"
                />
                <ChevronDown
                  class="w-3 h-3"
                  :class="cn(
                    sortField === column.key && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'
                  )"
                />
              </div>
            </div>
          </TableHead>
          <TableHead v-if="actions.length > 0" class="text-right">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(row, index) in data" :key="row.id || index">
          <TableCell
            v-for="column in columns"
            :key="column.key"
            :class="cn(column.className)"
          >
            <component
              :is="getColumnRenderer(column)"
              :column="column"
              :row="row"
              :value="getCellValue(row, column)"
              :index="index"
              :from="from"
              :context="context"
            />
          </TableCell>
          <TableCell v-if="actions.length > 0" class="text-right">
            <div class="flex justify-end space-x-2">
              <template v-for="action in getFilteredActions(row)" :key="action.key">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        :class="cn(
                          action.className,
                          showActionsAsIcons && 'p-1 h-8 w-8'
                        )"
                        @click="handleAction(action.key, row)"
                      >
                        <component
                          :is="getActionIcon(action.icon)"
                          v-if="showActionsAsIcons"
                          class="w-4 h-4"
                        />
                        <span v-else>{{ action.label }}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{{ action.label }}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </template>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTranslation } from 'vue-i18n';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, Eye, Edit, Trash2, MoreHorizontal } from 'lucide-vue-next';
import { hasPermission } from '@/utils/authorization';
import type { TableColumn, TableAction } from '@/types/crud';

interface CrudTableProps {
  columns: TableColumn[];
  actions: TableAction[];
  data: any[];
  from: number;
  onAction: (action: string, row: any) => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string) => void;
  statusColors?: Record<string, string>;
  permissions: string[];
  entityPermissions?: {
    view: string;
    edit: string;
    delete: string;
  };
  showActionsAsIcons?: boolean;
  context?: any;
}

const props = withDefaults(defineProps<CrudTableProps>(), {
  showActionsAsIcons: true,
  statusColors: () => ({
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
    draft: 'bg-gray-100 text-gray-800'
  })
});

const { t } = useTranslation();

const getCellValue = (row: any, column: TableColumn) => {
  const value = column.key.split('.').reduce((obj, key) => obj?.[key], row);
  return value;
};

const getColumnRenderer = (column: TableColumn) => {
  if (column.render) {
    return column.render;
  }

  if (column.type === 'badge') {
    return 'BadgeRenderer';
  }

  if (column.type === 'date') {
    return 'DateRenderer';
  }

  if (column.type === 'boolean') {
    return 'BooleanRenderer';
  }

  if (column.type === 'image') {
    return 'ImageRenderer';
  }

  return 'TextRenderer';
};

const getFilteredActions = (row: any) => {
  return props.actions.filter(action => {
    if (action.permission && !hasPermission(props.permissions, action.permission)) {
      return false;
    }

    if (action.condition && !action.condition(row, props.context)) {
      return false;
    }

    return true;
  });
};

const getActionIcon = (iconName: string) => {
  const icons: Record<string, any> = {
    eye: Eye,
    edit: Edit,
    delete: Trash2,
    'more-horizontal': MoreHorizontal
  };

  return icons[iconName] || MoreHorizontal;
};

const handleAction = (actionKey: string, row: any) => {
  props.onAction(actionKey, row);
};

// Render Components
const TextRenderer = ({ value }: { value: any }) => {
  return <span>{{ value || '-' }}</span>;
};

const BadgeRenderer = ({ value, column }: { value: any; column: TableColumn }) => {
  if (!value) return <span>-</span>;
  
  const color = props.statusColors?.[value] || 'bg-gray-100 text-gray-800';
  
  return (
    <Badge :class="color">
      {column.options?.[value] || value}
    </Badge>
  );
};

const DateRenderer = ({ value }: { value: any }) => {
  if (!value) return <span>-</span>;
  
  try {
    const date = new Date(value);
    return <span>{{ date.toLocaleDateString() }}</span>;
  } catch {
    return <span>{{ value }}</span>;
  }
};

const BooleanRenderer = ({ value }: { value: any }) => {
  if (value === true) {
    return <Badge class="bg-green-100 text-green-800">Yes</Badge>;
  }
  if (value === false) {
    return <Badge class="bg-red-100 text-red-800">No</Badge>;
  }
  return <span>-</span>;
};

const ImageRenderer = ({ value, column }: { value: any; column: TableColumn }) => {
  if (!value) return <span>-</span>;
  
  return (
    <img
      :src="value"
      :alt="column.alt || 'Image'"
      class="w-8 h-8 rounded object-cover"
    />
  );
};
</script>

<style scoped>
.crud-table {
  /* Component styles are handled by Tailwind classes */
}
</style>
