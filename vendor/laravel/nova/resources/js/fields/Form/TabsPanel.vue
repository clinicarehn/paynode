<template>
  <div class="tab-group" :dusk="`${panel.attribute}-tab-panel`">
    <div>
      <Heading v-if="panel.showTitle" :level="1" v-text="panel.name" />
      <p
        v-if="panel.helpText"
        class="text-gray-500 text-sm font-semibold italic"
        :class="panel.helpText ? 'mt-2' : 'mt-3'"
        v-html="panel.helpText"
      />
    </div>
    <div
      class="tab-card"
      :class="[panel.showTitle && !panel.showToolbar ? 'mt-3' : '']"
    >
      <TabGroup>
        <TabList
          :aria-label="panel.name"
          class="tab-menu divide-x dark:divide-gray-700 border-l-gray-200 border-r-gray-200 border-t-gray-200 border-b-gray-200 dark:border-l-gray-700 dark:border-r-gray-700 dark:border-t-gray-700 dark:border-b-gray-700"
        >
          <Tab
            v-for="(tab, tabListIndex) in sortedTabs(tabs)"
            as="template"
            :key="tabListIndex"
            v-slot="{ selected, disabled }"
            :disabled="tab.visibleFieldsForPanel.visibleFieldsCount.value == 0"
          >
            <button
              :class="[
                selected
                  ? 'active text-primary-500 font-bold border-b-2 !border-b-primary-500'
                  : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 hover:dark:text-gray-200',
              ]"
              class="tab-item"
              :dusk="`${tab.attribute}-tab-trigger`"
            >
              <span class="capitalize">{{ tab.meta.name }}</span>
            </button>
          </Tab>
        </TabList>

        <TabPanels>
          <KeepAlive>
            <TabPanel
              v-for="(tab, tabPanelIndex) in sortedTabs(tabs)"
              :key="tabPanelIndex"
              :label="tab.name"
              :dusk="`${tab.attribute}-tab-content`"
              :class="[tab.attribute, 'tab fields-tab']"
              :unmount="false"
            >
              <div class="divide-y divide-gray-100 dark:divide-gray-700">
                <template
                  v-for="(field, fieldIndex) in tab.fields"
                  :key="fieldIndex"
                >
                  <component
                    v-if="!field.from"
                    :is="componentName(field)"
                    ref="fields"
                    :class="{
                      'remove-bottom-border':
                        fieldIndex === tab.fields.length - 1,
                    }"
                    :errors="validationErrors"
                    :field="field"
                    :form-unique-id="formUniqueId"
                    :related-resource-id="relatedResourceId"
                    :related-resource-name="relatedResourceName"
                    :resource-id="resourceId"
                    :resource-name="resourceName"
                    :show-help-text="field.helpText != null"
                    :shown-via-new-relation-modal="shownViaNewRelationModal"
                    :via-relationship="viaRelationship"
                    :via-resource="viaResource"
                    :via-resource-id="viaResourceId"
                    @field-changed="$emit('field-changed')"
                    @field-shown="tab.visibleFieldsForPanel.handleFieldShown"
                    @field-hidden="tab.visibleFieldsForPanel.handleFieldHidden"
                    @file-deleted="$emit('update-last-retrieved-at-timestamp')"
                    @file-upload-started="$emit('file-upload-started')"
                    @file-upload-finished="$emit('file-upload-finished')"
                  />

                  <component
                    v-if="field.from"
                    :is="componentName(field)"
                    :errors="validationErrors"
                    :resource-id="fieldResourceId(field)"
                    :resource-name="field.resourceName"
                    :field="field"
                    :via-resource="field.from.viaResource"
                    :via-resource-id="field.from.viaResourceId"
                    :via-relationship="field.from.viaRelationship"
                    :form-unique-id="relationFormUniqueId"
                    @field-changed="$emit('field-changed')"
                    @field-shown="tab.visibleFieldsForPanel.handleFieldShown"
                    @field-hidden="tab.visibleFieldsForPanel.handleFieldHidden"
                    @file-deleted="$emit('update-last-retrieved-at-timestamp')"
                    @file-upload-started="$emit('file-upload-started')"
                    @file-upload-finished="$emit('file-upload-finished')"
                    :show-help-text="field.helpText != null"
                  />
                </template>
              </div>
            </TabPanel>
          </KeepAlive>
        </TabPanels>
      </TabGroup>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { mapProps } from '@/mixins'
import { usePanelVisibility } from '@/composables/usePanelVisibility'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import forEach from 'lodash/forEach'
import orderBy from 'lodash/orderBy'

const emitter = defineEmits([
  'field-changed',
  'field-shown',
  'field-hidden',
  'update-last-retrieved-at-timestamp',
  'file-upload-started',
  'file-upload-finished',
])

const props = defineProps({
  name: { type: String, default: 'Panel' },
  panel: { type: Object, required: true },
  fields: { type: Array, default: [] },
  formUniqueId: { type: String, required: false },
  validationErrors: { type: Object, required: false },
  ...mapProps([
    'shownViaNewRelationModal',
    'mode',
    'resourceName',
    'resourceId',
    'relatedResourceName',
    'relatedResourceId',
    'viaResource',
    'viaResourceId',
    'viaRelationship',
  ]),
})

const tabs = computed(() => {
  const tabs = props.panel.fields.reduce((tabs, field) => {
    if (!(field.tab?.attribute in tabs)) {
      tabs[field.tab.attribute] = {
        name: field.tab.name,
        attribute: field.tab.attribute,
        position: field.tab.position,
        init: false,
        listable: field.tab.listable,
        fields: [],
        meta: field.tab.meta,
        classes: 'fields-tab',
        visibleFieldsForPanel: null,
      }

      if (
        [
          'belongs-to-many-field',
          'has-many-field',
          'has-many-through-field',
          'has-one-through-field',
          'morph-to-many-field',
        ].includes(field.component)
      ) {
        tabs[field.tab.attribute].classes = 'relationship-tab'
      }
    }

    tabs[field.tab.attribute].fields.push(field)

    return tabs
  }, {})

  forEach(tabs, tab => {
    tab.visibleFieldsForPanel = usePanelVisibility(tab, emitter)
  })

  return tabs
})

function sortedTabs(tabs) {
  return Object.values(orderBy(tabs, [c => c.position], ['asc']))
}

function componentName(field) {
  return field.prefixComponent ? `form-${field.component}` : field.component
}

function fieldResourceId(field) {
  if (field.relationshipType === 'hasOne') {
    return field.hasOneId
  }

  if (field.relationshipType === 'morphOne') {
    return field.hasOneId
  }

  return this.resourceId
}
</script>
