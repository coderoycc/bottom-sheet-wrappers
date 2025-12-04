<script setup lang="ts">
import { ref } from 'vue'
import BottomSheet from './BottomSheet.vue'

const props = defineProps<{
  mode: 'dynamic' | 'auto-fit' | 'fixed'
  title: string
  description: string
  icon: string
}>()

const isOpen = ref(false)

const openSheet = () => {
  isOpen.value = true
}
</script>

<template>
  <div class="demo-card">
    <div class="demo-card-header">
      <div class="demo-icon">{{ icon }}</div>
      <div class="demo-info">
        <h3 class="demo-title">{{ title }}</h3>
        <p class="demo-description">{{ description }}</p>
      </div>
    </div>
    
    <button class="demo-button" @click="openSheet">
      Try {{ mode }} mode
    </button>

    <BottomSheet 
      v-model="isOpen"
      :mode="mode"
      :title="`${title} Example`"
      show-close-button
      :show-backdrop="mode === 'dynamic' || mode === 'auto-fit'"
      :close-on-backdrop="mode === 'auto-fit'"
      initial-size="medium"
    >
      <div class="sheet-content">
        <div class="content-section">
          <h4>{{ mode.charAt(0).toUpperCase() + mode.slice(1) }} Mode Features</h4>
          
          <ul v-if="mode === 'dynamic'" class="feature-list">
            <li>✅ Swipe up/down to resize between small, medium, and large</li>
            <li>✅ Click header to expand to next size</li>
            <li>✅ Backdrop collapses to small size when clicked</li>
            <li>✅ Smart expansion (won't expand to large if content fits in medium)</li>
            <li>✅ Smooth animations and transitions</li>
          </ul>

          <ul v-else-if="mode === 'auto-fit'" class="feature-list">
            <li>✅ Height automatically adjusts to content</li>
            <li>✅ Swipe down to close</li>
            <li>✅ Scrolls when content exceeds max-height</li>
            <li>✅ Click backdrop to close (when enabled)</li>
            <li>✅ Perfect for dynamic content</li>
          </ul>

          <ul v-else class="feature-list">
            <li>✅ Fixed height at 45% screen height (medium)</li>
            <li>✅ Swipe down to close</li>
            <li>✅ No resizing gestures</li>
            <li>✅ No backdrop interference</li>
            <li>✅ Content scrolls when overflowing</li>
          </ul>
        </div>

        <div class="content-section">
          <h4>Sample Content</h4>
          <div class="sample-items">
            <div v-for="i in 8" :key="i" class="sample-item">
              <div class="item-icon">📄</div>
              <div class="item-content">
                <div class="item-title">Item {{ i }}</div>
                <div class="item-subtitle">Sample description for item {{ i }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="content-section">
          <h4>Code Example</h4>
          <pre class="code-block"><code>&lt;BottomSheet 
  v-model="isOpen"
  mode="{{ mode }}"
  title="My Sheet"
  {{ mode === 'dynamic' ? 'initial-size="medium"' : '' }}
  {{ mode === 'auto-fit' ? ':close-on-backdrop="true"' : '' }}
&gt;
  &lt;p&gt;Your content here&lt;/p&gt;
&lt;/BottomSheet&gt;</code></pre>
        </div>
      </div>
    </BottomSheet>
  </div>
</template>

<style scoped>
.demo-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}

.demo-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.demo-card-header {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.demo-icon {
  font-size: 48px;
  line-height: 1;
}

.demo-info {
  flex: 1;
}

.demo-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
}

.demo-description {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

.demo-button {
  width: 100%;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.demo-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.demo-button:active {
  transform: translateY(0);
}

.sheet-content {
  padding: 0 8px 16px;
}

.content-section {
  margin-bottom: 24px;
}

.content-section h4 {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 12px;
}

.feature-list {
  list-style: none;
  padding: 0;
}

.feature-list li {
  padding: 8px 0;
  color: #374151;
  font-size: 14px;
  line-height: 1.6;
}

.sample-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sample-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  transition: background 0.2s;
}

.sample-item:hover {
  background: #f3f4f6;
}

.item-icon {
  font-size: 24px;
}

.item-content {
  flex: 1;
}

.item-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.item-subtitle {
  font-size: 12px;
  color: #6b7280;
}

.code-block {
  background: #1f2937;
  color: #e5e7eb;
  padding: 16px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.code-block code {
  color: #e5e7eb;
}
</style>
