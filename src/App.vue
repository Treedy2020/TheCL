<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { works } from './works'

const categories = ['全部', ...new Set(works.map((w) => w.type))]
const activeCategory = ref('全部')

const filteredWorks = computed(() => {
  if (activeCategory.value === '全部') return works
  return works.filter((w) => w.type === activeCategory.value)
})

const PAGE_SIZE = 6
const visibleCount = ref(PAGE_SIZE)
const loadMoreRef = ref(null)
let observer

const displayedWorks = computed(() => filteredWorks.value.slice(0, visibleCount.value))
const hasMoreWorks = computed(() => visibleCount.value < filteredWorks.value.length)

function loadMoreWorks() {
  if (hasMoreWorks.value) {
    visibleCount.value += PAGE_SIZE
  }
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) loadMoreWorks()
    },
    { rootMargin: '200px' }
  )
  if (loadMoreRef.value) observer.observe(loadMoreRef.value)
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})
</script>

<template>
  <div class="min-h-screen bg-[#EFECE6] text-[#111] font-sans selection:bg-[#FF3B00] selection:text-white pb-32 overflow-x-hidden">
    
    <!-- Top Header / CD Case Concept -->
    <header class="p-6 md:p-12 max-w-7xl mx-auto">
      <div class="flex flex-col lg:flex-row gap-12 items-start">
        
        <!-- Album Cover (The Case) -->
        <div class="w-full lg:w-[500px] shrink-0">
          <div class="relative group">
            <!-- Vinyl sliding out effect behind the cover -->
            <div class="absolute right-0 top-1/2 -translate-y-1/2 w-full aspect-square bg-[#111] rounded-full border-4 border-[#222] translate-x-12 transition-transform duration-700 group-hover:translate-x-24 hidden md:flex items-center justify-center">
              <div class="w-1/3 aspect-square rounded-full border-4 border-[#333] bg-[#FF3B00] flex items-center justify-center">
                <div class="w-4 h-4 bg-[#EFECE6] rounded-full"></div>
              </div>
            </div>

            <!-- The Cover -->
            <div class="relative z-10 border-4 border-[#111] bg-white shadow-[15px_15px_0px_rgba(0,51,255,1)] overflow-hidden transition-transform group-hover:-translate-x-2">
              <img 
                src="/self.jpeg" 
                class="w-full h-auto block filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700" 
                alt="Profile"
                onerror="this.src='https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=800&auto=format&fit=crop'"
              />
              <!-- Album Text Overlay -->
              <div class="absolute top-0 left-0 p-4 mix-blend-difference text-white">
                <p class="text-[10px] font-black tracking-[0.5em] uppercase opacity-50">STEREO / DIGITAL RELEASE</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Album Metadata -->
        <div class="flex-1 flex flex-col justify-between self-stretch pt-4">
          <div>
            <div class="flex items-center gap-4 mb-6">
              <span class="bg-[#FF3B00] text-white px-3 py-1 text-xs font-black italic uppercase">Parental Advisory: Explicit Talent</span>
              <span class="text-xs font-bold text-[#0033FF] tracking-widest uppercase">LP-2026-SJ</span>
            </div>
            <h1 class="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] uppercase mb-8" style="font-family: impact, ui-sans-serif, sans-serif;">
              水何<br/><span class="text-[#0033FF]">澹澹</span>
            </h1>
            <div class="space-y-4">
              <p class="text-2xl font-bold italic leading-tight border-l-8 border-[#FF3B00] pl-6 py-2">
                "Voice is the mirror of the soul, and I have many mirrors."
              </p>
              <p class="text-lg font-medium text-[#444] max-w-xl">
                SIDE A: Professional Dubbing / SIDE B: Artistic Expression. <br/>
                10+ Years of Sonic Exploration. Featured in Games, Movies & Literature.
              </p>
            </div>
          </div>

          <div class="mt-12">
            <div class="grid grid-cols-2 gap-4 border-t-4 border-[#111] pt-6">
              <div>
                <p class="text-[10px] font-black text-[#0033FF] uppercase mb-1">Artist</p>
                <p class="font-bold">SUI HE DAN DAN</p>
              </div>
              <div>
                <p class="text-[10px] font-black text-[#0033FF] uppercase mb-1">Format</p>
                <p class="font-bold">HI-RES AUDIO LP</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Tracklist (The Album Structure) -->
    <main class="max-w-7xl mx-auto px-6 md:px-12 mt-24">
      <div class="flex items-baseline justify-between border-b-8 border-[#111] pb-4 mb-12">
        <h2 class="text-5xl font-black italic uppercase tracking-tighter">Tracklist</h2>
        <div class="text-right hidden sm:block">
          <p class="text-xs font-black text-[#0033FF] uppercase">Total Duration</p>
          <p class="text-xl font-bold tracking-tighter">∞ INFINITE HOURS</p>
        </div>
      </div>

      <!-- Filter Tabs as 'Discs' -->
      <div class="flex flex-wrap gap-4 mb-16">
        <button
          v-for="category in categories"
          :key="category"
          @click="activeCategory = category; visibleCount = PAGE_SIZE"
          :class="[
            'group relative overflow-hidden px-8 py-3 transition-all duration-300',
            activeCategory === category ? 'text-white' : 'text-[#111]'
          ]"
        >
          <div :class="['absolute inset-0 border-4 border-[#111] transition-transform duration-300', activeCategory === category ? 'bg-[#111] translate-x-0 translate-y-0' : 'bg-transparent translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0']"></div>
          <span class="relative z-10 font-black uppercase text-sm tracking-widest">{{ category }}</span>
        </button>
      </div>

      <!-- Compact List Style (Like back of a CD) -->
      <div class="divide-y-4 divide-[#111] border-b-4 border-[#111]">
        <article
          v-for="(work, index) in displayedWorks"
          :key="work.title"
          class="group flex items-center py-6 gap-6 transition-colors hover:bg-white/40"
        >
          <span class="text-2xl font-black text-[#0033FF] italic w-12">{{ String(index + 1).padStart(2, '0') }}</span>
          
          <div class="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div class="md:col-span-4">
              <h3 class="text-2xl font-black uppercase tracking-tight group-hover:text-[#FF3B00] transition-colors leading-none mb-1">{{ work.title }}</h3>
              <p class="text-xs font-bold text-[#888] uppercase tracking-widest">{{ work.role }}</p>
            </div>
            
            <div class="md:col-span-5">
              <p class="text-sm font-medium text-[#444] line-clamp-1 italic italic">"{{ work.description }}"</p>
            </div>

            <div class="md:col-span-1 text-center">
              <span class="text-xs font-black bg-[#111] text-[#EFECE6] px-2 py-0.5 rounded uppercase">{{ work.type }}</span>
            </div>

            <div class="md:col-span-2 flex justify-end items-center gap-6">
              <span class="text-sm font-black italic tracking-tighter opacity-40">[{{ work.year }}]</span>
              <a v-if="work.link" :href="work.link" target="_blank" class="w-10 h-10 rounded-full border-2 border-[#111] flex items-center justify-center hover:bg-[#FF3B00] hover:text-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            </div>
          </div>
        </article>
      </div>

      <!-- Load More / Footer Credits -->
      <div ref="loadMoreRef" class="mt-20 flex flex-col items-center">
        <button
          v-if="hasMoreWorks"
          @click="loadMoreWorks"
          class="text-xs font-black uppercase tracking-[0.5em] border-b-4 border-[#111] pb-1 hover:text-[#0033FF] hover:border-[#0033FF] transition-all"
        >
          Flip the record / Load more
        </button>
        
        <div class="mt-24 text-center">
          <p class="text-[10px] font-black text-[#888] uppercase tracking-widest mb-4">Produced by OpenClaw & TreeDy</p>
          <div class="flex justify-center gap-8 opacity-20 filter grayscale">
             <!-- Fake logos for aesthetic -->
             <div class="font-black text-xl italic tracking-tighter border-2 border-[#111] px-2">RECORDS</div>
             <div class="font-black text-xl tracking-widest underline decoration-4">STUDIO</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
@keyframes marquee {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}
.animate-marquee {
  animation: marquee 10s linear infinite;
  min-width: 200%;
}
</style>
