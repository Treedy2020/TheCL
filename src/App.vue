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
  <div class="min-h-screen bg-[#f6fbff] text-slate-800">
    <div class="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_10%_10%,rgba(125,211,252,0.35),transparent_34%),radial-gradient(circle_at_90%_0%,rgba(167,243,208,0.4),transparent_32%),radial-gradient(circle_at_50%_100%,rgba(226,232,240,0.7),transparent_60%)]" />

    <main class="mx-auto max-w-6xl px-6 pb-16 pt-10">
      <section class="grid gap-8 rounded-[2rem] border border-white/70 bg-white/70 p-8 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl md:grid-cols-2">
        <div>
          <p class="mb-4 inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium tracking-wide text-sky-600">
            VOICE ACTOR PORTFOLIO
          </p>
          <h1 class="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">水何澹澹</h1>
          <p class="mt-4 text-slate-600">
            10+ 年配音经验，覆盖有声书、游戏、广播剧、广告与影视。声音清澈、情绪细腻，擅长从少女到成熟女性的多样化角色塑造。
          </p>

          <div class="mt-6 flex flex-wrap gap-2 text-sm">
            <span class="rounded-full bg-white px-3 py-1 text-slate-600 shadow-sm">中文</span>
            <span class="rounded-full bg-white px-3 py-1 text-slate-600 shadow-sm">粤语</span>
            <span class="rounded-full bg-white px-3 py-1 text-slate-600 shadow-sm">英语</span>
            <span class="rounded-full bg-white px-3 py-1 text-slate-600 shadow-sm">法语</span>
          </div>
        </div>

        <div class="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-[0_8px_24px_rgba(14,116,144,0.08)]">
          <h2 class="text-lg font-semibold text-slate-900">语音克隆体验（Mock）</h2>
          <p class="mt-2 text-sm text-slate-500">后端暂时关闭，当前为前端模拟生成效果。</p>

          <textarea
            v-model="text"
            class="mt-4 min-h-28 w-full rounded-2xl border border-slate-200 bg-white/90 p-3 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
          />

          <button
            :disabled="isGenerating"
            @click="mockClone"
            class="mt-3 w-full rounded-2xl bg-gradient-to-r from-sky-400 to-teal-300 px-4 py-2.5 font-medium text-white shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{ isGenerating ? '生成中...' : '生成示例语音' }}
          </button>

          <audio v-if="mockAudio" class="mt-4 w-full" controls :src="mockAudio" />
        </div>
      </section>

      <section class="mt-10 rounded-[2rem] border border-white/70 bg-white/65 p-6 shadow-[0_10px_35px_rgba(15,23,42,0.05)] backdrop-blur-xl">
        <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
          <h2 class="text-2xl font-semibold text-slate-900">代表作品</h2>

          <div class="flex flex-wrap gap-2">
            <button
              v-for="category in categories"
              :key="category"
              @click="activeCategory = category"
              :class="[
                'rounded-full px-3 py-1 text-sm transition',
                activeCategory === category
                  ? 'bg-sky-500 text-white shadow'
                  : 'bg-white text-slate-600 hover:bg-sky-50'
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
            class="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_26px_rgba(15,23,42,0.08)]"
          >
            <img :src="work.image" :alt="work.title" class="h-44 w-full object-cover" />
            <div class="p-4">
              <p class="text-xs text-sky-600">{{ work.year }} · {{ work.type }}</p>
              <h3 class="mt-1 font-semibold text-slate-900">{{ work.title }}</h3>
              <p class="mt-1 text-sm text-slate-600">角色：{{ work.role }}</p>
              <p class="mt-2 text-sm text-slate-500">{{ work.description }}</p>
            </div>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>
