<script setup lang="ts">
import { ref } from 'vue'
import DemoCard from './DemoCard.vue'
import BottomSheet from './BottomSheet.vue'

const showQuickStart = ref(false)
</script>

<template>
  <div class="demo-page">
    <!-- Header -->
    <header class="header">
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <span class="logo-icon">📱</span>
            <span class="logo-text">Bottom Sheet Wrappers</span>
          </div>
          <nav class="nav">
            <a href="https://github.com/coderoycc/bottom-sheet-wrappers" target="_blank" class="nav-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
            <!--<a disabled href="https://www.npmjs.com/package/@coderoycc/bottom-sheet-wrappers" target="_blank" class="nav-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z"/>
              </svg>
              npm
            </a> -->
          </nav>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            Mobile-First Vue 3<br/>
            <span class="gradient-text">Bottom Sheet Component</span>
          </h1>
          <p class="hero-description">
            Designed specifically for mobile devices with native-like touch gestures. 
            Three display modes, smooth 60fps animations, and zero dependencies.
            Built with Vue 3 Composition API and TypeScript.
          </p>
          <div class="hero-actions">
            <button class="btn btn-primary" @click="showQuickStart = true">
              Quick Start
            </button>
            <a href="https://github.com/coderoycc/bottom-sheet-wrappers" target="_blank" class="btn btn-secondary">
              View on GitHub
            </a>
          </div>
          <div class="hero-stats">
            <div class="stat">
              <div class="stat-value">3</div>
              <div class="stat-label">Display Modes</div>
            </div>
            <div class="stat">
              <div class="stat-value">0</div>
              <div class="stat-label">Dependencies</div>
            </div>
            <div class="stat">
              <div class="stat-value">~16KB</div>
              <div class="stat-label">Bundle Size</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="container">
        <h2 class="section-title">Why Bottom Sheet Wrappers?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3 class="feature-title">Three Display Modes</h3>
            <p class="feature-description">Dynamic, Auto-fit, and Fixed modes to cover all your use cases</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">👆</div>
            <h3 class="feature-title">Touch Gestures</h3>
            <p class="feature-description">Smooth swipe, drag, and tap interactions with native feel</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <h3 class="feature-title">Customizable</h3>
            <p class="feature-description">Easy to style with CSS variables and custom classes</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3 class="feature-title">Mobile-First Design</h3>
            <p class="feature-description">Built specifically for mobile devices with native-like touch interactions and 60fps animations</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔧</div>
            <h3 class="feature-title">TypeScript</h3>
            <p class="feature-description">Full TypeScript support with complete type definitions</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🪶</div>
            <h3 class="feature-title">Lightweight</h3>
            <p class="feature-description">Small bundle size with zero external dependencies</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Examples Section -->
    <section class="examples">
      <div class="container">
        <h2 class="section-title">Interactive Examples</h2>
        <p class="section-subtitle">Click on any card to try the different modes</p>
        
        <div class="examples-grid">
          <DemoCard
            mode="dynamic"
            title="Dynamic Mode"
            description="Resize between small, medium, and large with smooth gestures"
            icon="🔄"
          />
          <DemoCard
            mode="auto-fit"
            title="Auto-fit Mode"
            description="Height automatically adjusts to fit your content"
            icon="📏"
          />
          <DemoCard
            mode="fixed"
            title="Fixed Mode"
            description="Stay at a fixed height with scrollable content"
            icon="📌"
          />
        </div>
      </div>
    </section>

    <!-- Installation Section -->
    <section class="installation">
      <div class="container">
        <h2 class="section-title">Installation</h2>
        <div class="install-tabs">
          <div class="install-card">
            <div class="install-header">
              <span class="install-label">npm</span>
            </div>
            <pre class="install-code"><code>npm install @coderoycc/bottom-sheet-wrappers</code></pre>
          </div>
          <div class="install-card">
            <div class="install-header">
              <span class="install-label">yarn</span>
            </div>
            <pre class="install-code"><code>yarn add @coderoycc/bottom-sheet-wrappers</code></pre>
          </div>
          <div class="install-card">
            <div class="install-header">
              <span class="install-label">pnpm</span>
            </div>
            <pre class="install-code"><code>pnpm add @coderoycc/bottom-sheet-wrappers</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-info">
            <div class="footer-logo">
              <span class="logo-icon">📱</span>
              <span class="logo-text">Bottom Sheet Wrappers</span>
            </div>
            <p class="footer-description">
              A mobile-first Vue 3 bottom sheet component with native-like touch gestures
            </p>
          </div>
          <div class="footer-links">
            <div class="footer-section">
              <h4 class="footer-heading">Resources</h4>
              <a href="https://github.com/coderoycc/bottom-sheet-wrappers" target="_blank" class="footer-link">Documentation</a>
              <a href="https://github.com/coderoycc/bottom-sheet-wrappers/issues" target="_blank" class="footer-link">Issues</a>
              <a href="https://github.com/coderoycc/bottom-sheet-wrappers/blob/main/CHANGELOG.md" target="_blank" class="footer-link">Changelog</a>
            </div>
            <!-- <div class="footer-section">
              <h4 class="footer-heading">Community</h4>
              <a href="https://github.com/coderoycc" target="_blank" class="footer-link">GitHub</a>
              <a href="https://www.npmjs.com/~coderoycc" target="_blank" class="footer-link">npm</a>
            </div> -->
          </div>
        </div>
        <div class="footer-bottom">
          <p>Made with ❤️ by <a href="https://github.com/coderoycc" target="_blank" class="footer-author">coderoycc</a></p>
          <p>Licensed under MIT</p>
        </div>
      </div>
    </footer>

    <!-- Quick Start Bottom Sheet -->
    <BottomSheet
      v-model="showQuickStart"
      title="Quick Start"
      mode="auto-fit"
      show-close-button
      :show-backdrop="true"
      :close-on-backdrop="true"
    >
      <div class="quick-start-content">
        <h3>Get Started in 3 Steps</h3>
        
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h4>Install the package</h4>
            <pre class="code-snippet"><code>npm install @coderoycc/bottom-sheet-wrappers</code></pre>
          </div>
        </div>

        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h4>Import in your component</h4>
            <pre class="code-snippet"><code>import { BottomSheet } from '@coderoycc/bottom-sheet-wrappers'
import '@coderoycc/bottom-sheet-wrappers/dist/style.css'</code></pre>
          </div>
        </div>

        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h4>Use in your template</h4>
            <pre class="code-snippet"><code>&lt;BottomSheet 
  v-model="isOpen" 
  title="My Sheet"
&gt;
  &lt;p&gt;Your content here&lt;/p&gt;
&lt;/BottomSheet&gt;</code></pre>
          </div>
        </div>

        <a href="https://github.com/coderoycc/bottom-sheet-wrappers#readme" target="_blank" class="docs-link">
          View Full Documentation →
        </a>
      </div>
    </BottomSheet>
  </div>
</template>

<style scoped>
.demo-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f9fafb 0%, #ffffff 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Header */
.header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  font-size: 18px;
  color: #111827;
}

.logo-icon {
  font-size: 24px;
}

.nav {
  display: flex;
  gap: 24px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #111827;
}

/* Hero */
.hero {
  padding: 80px 0;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 56px;
  font-weight: 800;
  line-height: 1.1;
  color: #111827;
  margin-bottom: 24px;
}

.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 20px;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 40px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 60px;
}

.btn {
  padding: 14px 32px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-secondary:hover {
  background: #667eea;
  color: white;
}

.hero-stats {
  display: flex;
  gap: 48px;
  justify-content: center;
}

.stat {
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
}

/* Features */
.features {
  padding: 80px 0;
  background: white;
}

.section-title {
  font-size: 40px;
  font-weight: 700;
  text-align: center;
  color: #111827;
  margin-bottom: 16px;
}

.section-subtitle {
  text-align: center;
  color: #6b7280;
  font-size: 18px;
  margin-bottom: 48px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  margin-top: 48px;
}

.feature-card {
  text-align: center;
  padding: 32px;
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.feature-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 12px;
}

.feature-description {
  font-size: 15px;
  color: #6b7280;
  line-height: 1.6;
}

/* Examples */
.examples {
  padding: 80px 0;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
  margin-top: 48px;
}

/* Installation */
.installation {
  padding: 80px 0;
  background: white;
}

.install-tabs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 48px;
}

.install-card {
  background: #f9fafb;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.install-header {
  padding: 12px 16px;
  background: #111827;
  color: white;
}

.install-label {
  font-size: 14px;
  font-weight: 600;
}

.install-code {
  padding: 20px;
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  color: #111827;
  overflow-x: auto;
}

.install-code code {
  color: #111827;
}

/* Footer */
.footer {
  background: #111827;
  color: white;
  padding: 60px 0 24px;
  margin-top: 80px;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 64px;
  margin-bottom: 48px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 16px;
}

.footer-description {
  color: #9ca3af;
  font-size: 14px;
  line-height: 1.6;
  max-width: 400px;
}

.footer-links {
  display: flex;
  gap: 64px;
}

.footer-heading {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
  color: white;
}

.footer-link {
  display: block;
  color: #9ca3af;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 12px;
  transition: color 0.2s;
}

.footer-link:hover {
  color: white;
}

.footer-bottom {
  padding-top: 24px;
  border-top: 1px solid #374151;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #9ca3af;
}

.footer-author {
  color: #667eea;
  text-decoration: none;
}

.footer-author:hover {
  text-decoration: underline;
}

/* Quick Start Content */
.quick-start-content {
  padding: 0 8px 24px;
}

.quick-start-content h3 {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 24px;
}

.step {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.step-number {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
}

.step-content {
  flex: 1;
}

.step-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
}

.code-snippet {
  background: #1f2937;
  color: #e5e7eb;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  margin: 0;
  max-width: 100%;
  word-break: break-word;
  white-space: pre-wrap;
}

.code-snippet code {
  color: #e5e7eb;
  word-break: break-word;
}

.docs-link {
  display: inline-block;
  margin-top: 24px;
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
}

.docs-link:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }

  .hero-description {
    font-size: 16px;
  }

  .hero-actions {
    flex-direction: column;
  }

  .hero-stats {
    flex-direction: column;
    gap: 24px;
  }

  .section-title {
    font-size: 32px;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }

  .nav {
    gap: 16px;
  }

  .nav-link span {
    display: none;
  }
}
</style>
