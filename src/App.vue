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
    
    <!-- Top Header / Editorial Profile -->
    <header class="p-6 md:p-12 flex flex-col md:flex-row justify-between items-start gap-8">
      <div class="max-w-2xl">
        <p class="text-xs md:text-sm font-bold uppercase tracking-widest text-[#0033FF] mb-4">Voice Artist & Actor</p>
        <h1 class="text-6xl md:text-8xl lg:text-[140px] font-black tracking-tighter leading-[0.85] uppercase" style="font-family: impact, ui-sans-serif, sans-serif;">
          水何<br/><span class="text-[#FF3B00]">澹澹</span>
        </h1>
        <p class="mt-8 text-lg md:text-2xl font-medium leading-relaxed max-w-xl">
          10余年声音探索之旅。游走于有声书、游戏、广播剧与影视之间。用不同的声线，折射色彩碰撞的艺术世界。
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <span class="border-2 border-[#111] px-4 py-1.5 text-sm font-bold uppercase rounded-full hover:bg-[#111] hover:text-[#EFECE6] transition-colors cursor-default">中文</span>
          <span class="border-2 border-[#111] px-4 py-1.5 text-sm font-bold uppercase rounded-full hover:bg-[#111] hover:text-[#EFECE6] transition-colors cursor-default">粤语</span>
          <span class="border-2 border-[#111] px-4 py-1.5 text-sm font-bold uppercase rounded-full bg-[#111] text-[#EFECE6] cursor-default">英语</span>
          <span class="border-2 border-[#111] px-4 py-1.5 text-sm font-bold uppercase rounded-full hover:bg-[#111] hover:text-[#EFECE6] transition-colors cursor-default">法语</span>
        </div>
      </div>
      
      <!-- Profile Picture treated as album cover -->
      <div class="w-full md:w-80 lg:w-[450px] shrink-0 relative group">
        <!-- Hard Shadow Base -->
        <div class="absolute inset-0 border-4 border-[#111] bg-[#0033FF] translate-x-4 translate-y-4"></div>
        <!-- Image Container -->
        <div class="relative border-4 border-[#111] bg-white overflow-hidden">
          <img 
            src="/self.jpeg" 
            class="w-full h-auto block filter grayscale group-hover:grayscale-0 transition-all duration-700" 
            alt="Profile"
            onerror="this.src='https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=800&auto=format&fit=crop'"
          />
        </div>
        <!-- Sticker -->
        <div class="absolute -right-6 -top-6 w-24 h-24 bg-[#FF3B00] rounded-full border-4 border-[#111] flex items-center justify-center animate-[spin_10s_linear_infinite]">
          <span class="text-white font-black text-xl transform -rotate-12">10+ YRS</span>
        </div>
      </div>
    </header>

    <!-- Marquee Tape -->
    <div class="w-full overflow-hidden border-y-4 border-[#111] bg-[#FF3B00] text-[#EFECE6] py-3 flex items-center whitespace-nowrap mt-12 md:mt-24">
      <div class="animate-marquee font-black uppercase text-2xl tracking-widest flex gap-8">
        <span>AUDIO BOOKS</span><span>•</span>
        <span>GAMING VOICES</span><span>•</span>
        <span>RADIO DRAMA</span><span>•</span>
        <span>FILM & TV DUBBING</span><span>•</span>
        <span>AUDIO BOOKS</span><span>•</span>
        <span>GAMING VOICES</span><span>•</span>
        <span>RADIO DRAMA</span><span>•</span>
        <span>FILM & TV DUBBING</span><span>•</span>
        <span>AUDIO BOOKS</span><span>•</span>
        <span>GAMING VOICES</span><span>•</span>
        <span>RADIO DRAMA</span><span>•</span>
        <span>FILM & TV DUBBING</span><span>•</span>
      </div>
    </div>

    <!-- Works Grid Section -->
    <main class="p-6 md:p-12 mt-12">
      <!-- Filter -->
      <div class="flex flex-wrap gap-3 mb-16">
        <button
          v-for="category in categories"
          :key="category"
          @click="activeCategory = category; visibleCount = PAGE_SIZE"
          :class="[
            'px-6 py-2 rounded-full text-base font-black uppercase transition-all duration-300 border-4',
            activeCategory === category 
              ? 'bg-[#0033FF] border-[#0033FF] text-white' 
              : 'border-[#111] text-[#111] hover:bg-[#111] hover:text-[#EFECE6]'
          ]"
        >
          {{ category }}
        </button>
      </div>

      <!-- Asymmetric / Brutalist Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
        <article
          v-for="(work, index) in displayedWorks"
          :key="work.title"
          class="group relative"
        >
          <!-- Image Block -->
          <div class="relative w-full aspect-[4/3]">
            <!-- Hard Shadow Base -->
            <div class="absolute inset-0 border-4 border-[#111] bg-[#111] translate-x-3 translate-y-3 transition-transform duration-300 group-hover:translate-x-5 group-hover:translate-y-5"></div>
            <!-- Image Container -->
            <div class="absolute inset-0 border-4 border-[#111] bg-[#FF3B00] overflow-hidden">
              <img 
                :src="work.image" 
                :alt="work.title" 
                loading="lazy"
                class="w-full h-full object-cover opacity-80 mix-blend-luminosity group-hover:opacity-100 group-hover:mix-blend-normal group-hover:scale-105 transition-all duration-700"
              />
              
              <!-- Hover Overlay for Link -->
              <a v-if="work.link" :href="work.link" target="_blank" class="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-sm">
                <span class="bg-[#EFECE6] text-[#111] px-6 py-3 font-black text-lg rounded-full border-4 border-[#111] flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  PLAY / VIEW 
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                </span>
              </a>
            </div>
            
            <!-- Type Tag -->
            <div class="absolute -left-2 top-6 bg-[#0033FF] text-white px-4 py-1 font-black text-sm border-2 border-[#111] uppercase rotate-[-2deg]">
              {{ work.type }}
            </div>
            <!-- Year Tag -->
            <div class="absolute -right-2 bottom-6 bg-[#FF3B00] text-white px-4 py-1 font-black text-xl border-2 border-[#111] rotate-[3deg]">
              '{{ String(work.year).slice(2) }}
            </div>
          </div>
          
          <!-- Typography Info -->
          <div class="mt-8 pr-4">
            <h3 class="text-3xl font-black leading-none mb-3 uppercase tracking-tight">{{ work.title }}</h3>
            <div class="flex items-center gap-3 mb-3">
              <span class="px-2 py-0.5 bg-[#111] text-[#EFECE6] text-xs font-bold uppercase rounded-sm">ROLE</span>
              <span class="font-bold text-[#FF3B00] text-lg">{{ work.role }}</span>
            </div>
            <p class="text-base font-medium text-[#444] leading-relaxed line-clamp-3">
              {{ work.description }}
            </p>
          </div>
        </article>
      </div>

      <!-- Load More / End Marker -->
      <div ref="loadMoreRef" class="mt-24 pt-12 border-t-4 border-[#111] flex justify-center">
        <button
          v-if="hasMoreWorks"
          @click="loadMoreWorks"
          class="border-4 border-[#111] bg-[#FF3B00] text-white px-10 py-4 font-black text-xl hover:bg-[#111] hover:text-[#EFECE6] transition-colors shadow-[6px_6px_0px_#111] hover:shadow-[2px_2px_0px_#111] hover:translate-x-1 hover:translate-y-1"
        >
          LOAD MORE ARCHIVES
        </button>
        <div v-else class="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mx-auto text-[#111] mb-4 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 3-3 4 4 4-4 3 3z"/></svg>
          <p class="text-sm font-black text-[#111] tracking-[0.3em] uppercase">NO MORE TRACKS</p>
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
