<script setup>
import { computed, ref } from 'vue'
import { works } from './works'

const text = ref('你好，我是水何澹澹。欢迎来到我的配音作品展示站。')
const isGenerating = ref(false)
const mockAudio = ref('')

const categories = ['全部', ...new Set(works.map((w) => w.type))]
const activeCategory = ref('全部')

const filteredWorks = computed(() => {
  if (activeCategory.value === '全部') return works
  return works.filter((w) => w.type === activeCategory.value)
})

function mockClone() {
  isGenerating.value = true
  setTimeout(() => {
    mockAudio.value = `${import.meta.env.BASE_URL}audio.wav`
    isGenerating.value = false
  }, 1200)
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <div class="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.25),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(168,85,247,0.2),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(15,23,42,0.8),transparent_55%)]" />

    <main class="relative z-10 mx-auto max-w-6xl px-6 pb-16 pt-10">
      <section class="grid gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur md:grid-cols-2">
        <div>
          <p class="mb-3 inline-flex rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs tracking-wide text-cyan-200">VOICE ACTOR PORTFOLIO</p>
          <h1 class="text-4xl font-semibold leading-tight md:text-5xl">水何澹澹</h1>
          <p class="mt-4 text-slate-300">10+ 年配音经验，覆盖有声书、游戏、广播剧、广告与影视。声音风格清澈明亮，情绪层次细腻，可塑性强。</p>
          <div class="mt-6 flex flex-wrap gap-2 text-sm text-slate-200">
            <span class="rounded-full border border-white/20 px-3 py-1">中文</span>
            <span class="rounded-full border border-white/20 px-3 py-1">粤语</span>
            <span class="rounded-full border border-white/20 px-3 py-1">英语</span>
            <span class="rounded-full border border-white/20 px-3 py-1">法语</span>
          </div>
        </div>
        <div class="rounded-2xl border border-white/10 bg-black/20 p-5">
          <h2 class="text-lg font-medium">AI 语音克隆体验（Mock）</h2>
          <p class="mt-2 text-sm text-slate-400">后端已暂时关闭；当前按钮将模拟生成并返回示例音频。</p>
          <textarea v-model="text" class="mt-4 min-h-28 w-full rounded-xl border border-white/10 bg-slate-900/70 p-3 text-sm outline-none ring-cyan-400/0 transition focus:ring-2" />
          <button
            :disabled="isGenerating"
            @click="mockClone"
            class="mt-3 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 font-medium text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{ isGenerating ? '生成中...' : '生成示例语音' }}
          </button>
          <audio v-if="mockAudio" class="mt-4 w-full" controls :src="mockAudio" />
        </div>
      </section>

      <section class="mt-10">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h2 class="text-2xl font-semibold">代表作品</h2>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="category in categories"
              :key="category"
              @click="activeCategory = category"
              :class="[
                'rounded-full border px-3 py-1 text-sm transition',
                activeCategory === category
                  ? 'border-cyan-300 bg-cyan-300/20 text-cyan-100'
                  : 'border-white/20 text-slate-300 hover:border-white/40'
              ]"
            >
              {{ category }}
            </button>
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="work in filteredWorks"
            :key="work.title"
            class="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
          >
            <img :src="work.image" :alt="work.title" class="h-44 w-full object-cover" />
            <div class="p-4">
              <p class="text-xs text-cyan-200">{{ work.year }} · {{ work.type }}</p>
              <h3 class="mt-1 font-medium">{{ work.title }}</h3>
              <p class="mt-1 text-sm text-slate-300">角色：{{ work.role }}</p>
              <p class="mt-2 text-sm text-slate-400">{{ work.description }}</p>
            </div>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>
