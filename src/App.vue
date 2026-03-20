<script setup>
import { computed, ref } from 'vue'
import { works } from './works'

const text = ref('你好，我是水何澹澹。欢迎来到我的配音作品集。')
const isGenerating = ref(false)
const mockAudio = ref('')
const isPlaying = ref(false)
const audioRef = ref(null)

const categories = ['全部', ...new Set(works.map((w) => w.type))]
const activeCategory = ref('全部')

const filteredWorks = computed(() => {
  if (activeCategory.value === '全部') return works
  return works.filter((w) => w.type === activeCategory.value)
})

function mockClone() {
  if (!text.value.trim()) return
  isGenerating.value = true
  mockAudio.value = ''
  isPlaying.value = false
  
  setTimeout(() => {
    mockAudio.value = `${import.meta.env.BASE_URL}audio.wav`
    isGenerating.value = false
    // Auto play
    setTimeout(() => {
      if (audioRef.value) {
        audioRef.value.play().catch(e => console.log('Autoplay prevented', e))
      }
    }, 100)
  }, 1500)
}

function togglePlay() {
  if (!audioRef.value) return
  if (isPlaying.value) {
    audioRef.value.pause()
  } else {
    audioRef.value.play()
  }
}
</script>

<template>
  <div class="relative min-h-screen bg-[#050505] text-white selection:bg-white/30 pb-32">
    <!-- Ambient Background -->
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute -left-[20%] -top-[10%] h-[70vh] w-[70vw] rounded-full bg-indigo-900/20 blur-[120px]" />
      <div class="absolute -right-[10%] top-[40%] h-[50vh] w-[50vw] rounded-full bg-cyan-900/20 blur-[100px]" />
    </div>

    <main class="mx-auto max-w-6xl px-6 pt-12 lg:flex lg:gap-16 lg:pt-24">
      
      <!-- Artist Profile (Album Cover side) -->
      <aside class="fade-in-up lg:sticky lg:top-24 lg:w-[400px] lg:shrink-0 lg:self-start">
        <div class="group relative aspect-square w-full overflow-hidden rounded-2xl shadow-2xl shadow-cyan-900/20">
          <img 
            src="/self.jpeg" 
            alt="水何澹澹" 
            class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            onerror="this.src='https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=800&auto=format&fit=crop'"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div class="absolute bottom-6 left-6 right-6">
            <p class="text-xs font-medium tracking-widest text-cyan-400">VOICE ARTIST</p>
            <h1 class="mt-2 text-4xl font-light tracking-wide sm:text-5xl">水何澹澹</h1>
          </div>
        </div>

        <div class="mt-8 space-y-6 text-white/70">
          <p class="text-base font-light leading-relaxed">
            10余年声音探索之旅。游走于有声书、游戏、广播剧与影视之间。
            <br/><br/>
            清澈而不失力量，细腻亦能承载宏大。用声音为纸上世界注入灵魂。
          </p>
          
          <div class="flex flex-wrap gap-2 pt-2">
            <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-light">中文</span>
            <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-light">粤语</span>
            <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-light">英语</span>
            <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-light">法语</span>
          </div>
        </div>
      </aside>

      <!-- Tracklist (Works) -->
      <section class="fade-in-up mt-16 flex-1 lg:mt-0" style="animation-delay: 0.2s">
        
        <div class="mb-8 flex items-end justify-between border-b border-white/10 pb-4">
          <h2 class="text-2xl font-light tracking-wide text-white/90">Selected Works</h2>
          
          <div class="hidden gap-4 sm:flex">
            <button
              v-for="category in categories"
              :key="category"
              @click="activeCategory = category"
              :class="[
                'text-sm transition-colors duration-300',
                activeCategory === category ? 'text-cyan-400 font-medium' : 'text-white/40 hover:text-white/80'
              ]"
            >
              {{ category }}
            </button>
          </div>
        </div>
        
        <!-- Mobile categories -->
        <div class="mb-6 flex gap-3 overflow-x-auto pb-2 sm:hidden scrollbar-hide">
          <button
            v-for="category in categories"
            :key="`m-${category}`"
            @click="activeCategory = category"
            :class="[
              'shrink-0 rounded-full px-4 py-1.5 text-xs transition-colors',
              activeCategory === category ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-white/5 text-white/60 border border-white/10'
            ]"
          >
            {{ category }}
          </button>
        </div>

        <div class="space-y-2">
          <article
            v-for="(work, index) in filteredWorks"
            :key="work.title"
            class="group flex flex-col gap-4 rounded-xl p-3 transition-colors hover:bg-white/5 sm:flex-row sm:items-center sm:p-4"
          >
            <div class="flex items-center gap-4 sm:w-1/2">
              <span class="w-6 text-center text-xs font-light text-white/30">{{ String(index + 1).padStart(2, '0') }}</span>
              <div class="h-12 w-12 shrink-0 overflow-hidden rounded bg-white/10">
                <img :src="work.image" :alt="work.title" loading="lazy" class="h-full w-full object-cover opacity-80 grayscale transition duration-500 group-hover:grayscale-0 group-hover:opacity-100" />
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="truncate text-base font-medium text-white/90">{{ work.title }}</h3>
                <p class="truncate text-xs text-cyan-400/80">{{ work.role }}</p>
              </div>
            </div>
            
            <div class="ml-10 flex flex-1 items-center justify-between sm:ml-0">
              <p class="line-clamp-2 text-xs font-light text-white/50 sm:pr-4">
                {{ work.description }}
              </p>
              
              <div class="flex shrink-0 items-center gap-4 pl-2">
                <span class="text-xs font-light text-white/30">{{ work.year }}</span>
                <a 
                  v-if="work.link"
                  :href="work.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/50 opacity-0 transition-all hover:bg-white/20 hover:text-white group-hover:opacity-100 sm:flex"
                  title="View Project"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>

    <!-- Floating Interactive Player (AI Clone Mock) -->
    <div class="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/60 p-4 backdrop-blur-2xl sm:p-6">
      <div class="mx-auto flex max-w-6xl flex-col items-center gap-4 sm:flex-row">
        
        <!-- Vinyl Disk -->
        <div class="hidden shrink-0 sm:block">
          <div :class="['relative h-14 w-14 overflow-hidden rounded-full border border-white/20 bg-zinc-900', isPlaying ? 'album-spin' : 'album-spin-paused']">
            <div class="absolute inset-2 rounded-full border border-white/5" />
            <div class="absolute inset-4 rounded-full border border-white/5" />
            <div class="absolute inset-[22px] rounded-full bg-cyan-500/80" />
            <div class="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%,rgba(255,255,255,0.1)_100%)] mix-blend-overlay" />
          </div>
        </div>

        <div class="flex-1 w-full space-y-2">
          <div class="flex items-center justify-between px-1">
            <span class="text-xs font-medium text-cyan-400">AI 声线体验</span>
            <span class="text-[10px] text-white/40">Powered by OpenClaw Mock</span>
          </div>
          <div class="flex w-full items-center gap-3">
            <input 
              v-model="text"
              type="text"
              placeholder="输入文本，倾听她的声音..."
              class="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-light text-white outline-none transition focus:border-cyan-500/50 focus:bg-white/10"
              @keyup.enter="mockClone"
            />
            <button 
              @click="mockClone"
              :disabled="isGenerating"
              class="shrink-0 flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition hover:bg-cyan-50 disabled:opacity-50"
            >
              <svg v-if="isGenerating" class="h-4 w-4 animate-spin text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span v-else>Generate</span>
            </button>
          </div>
        </div>

        <!-- Audio Player Controls -->
        <div v-if="mockAudio" class="flex shrink-0 items-center justify-center sm:pl-4">
          <button @click="togglePlay" class="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 text-black transition hover:scale-105 hover:bg-cyan-400">
            <!-- Play/Pause Icon -->
            <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="ml-1"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          </button>
          <audio 
            ref="audioRef" 
            :src="mockAudio" 
            @play="isPlaying = true" 
            @pause="isPlaying = false" 
            @ended="isPlaying = false" 
            class="hidden" 
          />
        </div>

      </div>
    </div>
  </div>
</template>
