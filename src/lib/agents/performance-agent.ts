/**
 * Performance Agent - Otimiza performance do aplicativo
 * Monitora e melhora: loading times, bundle size, re-renders
 */

import React from 'react'

// Use browser performance API instead of Node.js perf_hooks

interface PerformanceMetrics {
  pageLoadTime: number
  componentRenderTime: number
  bundleSize: number
  memoryUsage: number
  apiResponseTime: number
}

class PerformanceAgent {
  private metrics: PerformanceMetrics = {
    pageLoadTime: 0,
    componentRenderTime: 0,
    bundleSize: 0,
    memoryUsage: 0,
    apiResponseTime: 0
  }

  private observers: PerformanceObserver[] = []

  constructor() {
    this.initializeObservers()
  }

  private initializeObservers() {
    // Observer para navigation timing
    if (typeof window !== 'undefined') {
      const navObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming
            this.metrics.pageLoadTime = navEntry.loadEventEnd - navEntry.loadEventStart
          }
        })
      })
      navObserver.observe({ entryTypes: ['navigation'] })
      this.observers.push(navObserver)

      // Observer para resource timing
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === 'resource') {
            const resource = entry as PerformanceResourceTiming
            this.metrics.apiResponseTime = Math.max(
              this.metrics.apiResponseTime,
              resource.responseEnd - resource.requestStart
            )
          }
        })
      })
      resourceObserver.observe({ entryTypes: ['resource'] })
      this.observers.push(resourceObserver)
    }
  }

  // Medir tempo de renderização de componente
  measureComponentRender(componentName: string, renderFunction: () => void) {
    const start = Date.now()
    renderFunction()
    const end = Date.now()
    this.metrics.componentRenderTime = end - start
    
    console.log(`[Performance] ${componentName} render time: ${this.metrics.componentRenderTime.toFixed(2)}ms`)
    return this.metrics.componentRenderTime
  }

  // Medir uso de memória
  measureMemoryUsage() {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory
      this.metrics.memoryUsage = memory.usedJSHeapSize
      return this.metrics.memoryUsage
    }
    return 0
  }

  // Otimizar lazy loading de componentes
  createLazyComponent<T extends React.ComponentType<any>>(
    importFunc: () => Promise<{ default: T }>,
    componentName: string
  ) {
    return React.lazy(() => {
      const start = performance.now()
      return importFunc().then(module => {
        const end = performance.now()
        console.log(`[Performance] ${componentName} lazy load time: ${(end - start).toFixed(2)}ms`)
        return module
      })
    })
  }

  // Analisar e sugerir otimizações
  analyzePerformance() {
    const suggestions: string[] = []

    if (this.metrics.pageLoadTime > 3000) {
      suggestions.push('Page load time > 3s - Consider code splitting and lazy loading')
    }

    if (this.metrics.componentRenderTime > 100) {
      suggestions.push('Component render time > 100ms - Consider React.memo or useMemo')
    }

    if (this.metrics.memoryUsage > 50 * 1024 * 1024) { // 50MB
      suggestions.push('High memory usage - Check for memory leaks')
    }

    if (this.metrics.apiResponseTime > 1000) {
      suggestions.push('API response time > 1s - Consider caching or optimization')
    }

    return {
      metrics: this.metrics,
      suggestions,
      score: this.calculatePerformanceScore()
    }
  }

  private calculatePerformanceScore(): number {
    let score = 100
    
    // Penalidades baseadas nas métricas
    if (this.metrics.pageLoadTime > 3000) score -= 20
    if (this.metrics.pageLoadTime > 5000) score -= 20
    
    if (this.metrics.componentRenderTime > 100) score -= 15
    if (this.metrics.componentRenderTime > 200) score -= 15
    
    if (this.metrics.memoryUsage > 50 * 1024 * 1024) score -= 20
    if (this.metrics.memoryUsage > 100 * 1024 * 1024) score -= 20
    
    if (this.metrics.apiResponseTime > 1000) score -= 15
    if (this.metrics.apiResponseTime > 2000) score -= 15
    
    return Math.max(0, score)
  }

  // Limpar observers
  cleanup() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

export const performanceAgent = new PerformanceAgent()
export type { PerformanceMetrics }
