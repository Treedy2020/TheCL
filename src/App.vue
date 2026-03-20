<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { works } from './works'

const isEn = ref(false)

const t = computed(() => ({
  role: isEn.value ? 'Voice Artist & Actor' : '配音演员 / 声音艺术家',
  name: isEn.value ? 'SUI HE DAN DAN' : '水何澹澹',
  desc: isEn.value 
    ? 'Over 10 years of sonic exploration. Wandering through audiobooks, games, radio dramas, and films. Using different voices to reflect an artistic world of colliding colors.'
    : '10余年声音探索之旅。游走于有声书、游戏、广播剧与影视之间。用不同的声线，折射色彩碰撞的艺术世界。',
  aiDesc: isEn.value 
    ? 'Embracing the era of generative AI. Exploring the resonance between human emotion and algorithmic logic, redefining the boundary of vocal art.'
    : '拥抱生成式 AI 时代，探索人类情感与算法逻辑的共振，重新定义声音艺术的边界。',
  langs: isEn.value ? ['Mandarin', 'Cantonese', 'English', 'French'] : ['中文', '粤语', '英语', '法语'],
  adv: isEn.value ? 'Parental Advisory: Explicit Talent' : '听觉警告：极度才华',
  side: isEn.value 
    ? 'SIDE A: Professional Dubbing / SIDE B: Artistic Expression / SIDE C: AI Resonance' 
    : 'A面：专业配音 / B面：艺术表达 / C面：AI 共振',
  artist: isEn.value ? 'Artist' : '艺术家',
  format: isEn.value ? 'Format' : '发行格式',
  tracklist: isEn.value ? 'Tracklist' : '作品曲目',
  duration: isEn.value ? 'Total Duration' : '总时长',
  infinite: isEn.value ? '∞ INFINITE HOURS' : '∞ 无限循环',
  categories: isEn.value ? ['All', 'Game', 'Comic', 'Radio', 'Audiobook', 'Film'] : ['全部', '游戏', '有声漫', '广播剧', '有声书', '电影'],
  roleLabel: isEn.value ? 'ROLE' : '角色',
  loadMore: isEn.value ? 'Flip the record / Load more' : '翻转唱片 / 加载更多',
  noMore: isEn.value ? 'NO MORE TRACKS' : '已播完所有曲目',
  contact: isEn.value ? 'Contact / Booking' : '联系 / 商务合作',
  scan: isEn.value ? 'Scan WeChat to collaborate' : '扫码添加企业微信合作',
  navIntro: isEn.value ? 'INTRO' : '介绍',
  navWorks: isEn.value ? 'WORKS' : '作品',
  navContact: isEn.value ? 'CONTACT' : '合作'
}))

// Map English categories back to original Chinese types for filtering
const categoryMap = {
  'All': '全部', 'Game': '游戏', 'Comic': '有声漫', 
  'Radio': '广播剧', 'Audiobook': '有声书', 'Film': '电影'
}

const activeCategoryIdx = ref(0)
const activeCategoryLabel = computed(() => t.value.categories[activeCategoryIdx.value])
const activeCategoryFilter = computed(() => {
  const label = t.value.categories[activeCategoryIdx.value]
  return isEn.value ? categoryMap[label] : label
})

const filteredWorks = computed(() => {
  if (activeCategoryFilter.value === '全部') return works
  return works.filter((w) => w.type === activeCategoryFilter.value)
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

const showQR = ref(false)

function goSection(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
  <div class="min-h-screen bg-[#EFECE6] text-[#111] font-sans selection:bg-[#FF3B00] selection:text-white pb-32 overflow-x-hidden relative">
    
    <!-- Top Nav / Lang Switch (Desktop) -->
    <nav class="absolute top-0 right-0 p-6 hidden xl:flex justify-end z-50">
      <button 
        @click="isEn = !isEn" 
        class="border-2 border-[#111] bg-white px-4 py-1 text-sm font-black uppercase hover:bg-[#FF3B00] hover:text-white transition-colors shadow-[4px_4px_0px_#111]"
      >
        {{ isEn ? '中' : 'EN' }}
      </button>
    </nav>

    <!-- Side Navigation (Desktop) -->
    <div class="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-12 items-center">
      <button @click="goSection('intro')" class="-rotate-90 text-xs font-black tracking-[0.2em] hover:text-[#0033FF] transition-colors">{{ t.navIntro }}</button>
      <button @click="goSection('works')" class="-rotate-90 text-xs font-black tracking-[0.2em] hover:text-[#FF3B00] transition-colors">{{ t.navWorks }}</button>
      <button @click="goSection('contact')" class="-rotate-90 text-xs font-black tracking-[0.2em] hover:text-[#0033FF] transition-colors">{{ t.navContact }}</button>
    </div>

    <!-- Top Navigation (Mobile) -->
    <div class="fixed top-0 left-0 right-0 z-50 bg-[#EFECE6]/95 backdrop-blur-xl border-b-4 border-[#111] xl:hidden flex justify-between items-center px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-transform duration-300">
      <div class="flex items-center gap-4">
        <button @click="goSection('intro')" class="text-sm font-black tracking-widest hover:text-[#0033FF] transition-colors">{{ t.navIntro }}</button>
        <button @click="goSection('works')" class="text-sm font-black tracking-widest hover:text-[#FF3B00] transition-colors">{{ t.navWorks }}</button>
        <button @click="goSection('contact')" class="text-sm font-black tracking-widest hover:text-[#0033FF] transition-colors">{{ t.navContact }}</button>
      </div>
      <button 
        @click="isEn = !isEn" 
        class="border-2 border-[#111] bg-white px-2 py-0.5 text-xs font-black uppercase hover:bg-[#FF3B00] hover:text-white transition-colors"
      >
        {{ isEn ? '中' : 'EN' }}
      </button>
    </div>

    <!-- Top Header / CD Case Concept -->
    <header id="intro" class="p-6 md:p-12 max-w-7xl mx-auto pt-20 md:pt-24 xl:pl-32 scroll-mt-24 mt-12 xl:mt-0">
      <div class="flex flex-col lg:flex-row gap-10 md:gap-16 items-center lg:items-start">
        
        <!-- Album Cover (The Case) -->
        <div class="w-full max-w-[400px] lg:w-[500px] shrink-0 relative">
          <div class="relative group">
            <!-- Vinyl sliding out effect behind the cover -->
            <div class="absolute right-0 top-1/2 -translate-y-1/2 w-[90%] aspect-square bg-[#111] rounded-full border-4 border-[#222] translate-x-[15%] md:translate-x-[20%] transition-transform duration-700 group-hover:translate-x-[30%] flex items-center justify-center -z-10 shadow-2xl">
              <div class="w-1/3 aspect-square rounded-full border-4 border-[#333] bg-[#FF3B00] flex items-center justify-center">
                <div class="w-4 h-4 bg-[#EFECE6] rounded-full"></div>
              </div>
            </div>

            <!-- The Cover -->
            <div class="relative z-10 border-4 border-[#111] bg-white shadow-[10px_10px_0px_rgba(0,51,255,1)] md:shadow-[15px_15px_0px_rgba(0,51,255,1)] overflow-hidden transition-transform group-hover:-translate-x-2">
              <!-- Removed grayscale here -->
              <img 
                src="/self.jpeg" 
                class="w-full h-auto block contrast-[1.05] saturate-[1.05] transition-all duration-700 hover:scale-105" 
                alt="Profile"
                onerror="this.src='https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=800&auto=format&fit=crop'"
              />
              <!-- Album Text Overlay -->
              <div class="absolute top-0 left-0 p-3 md:p-4 mix-blend-difference text-white">
                <p class="text-[8px] md:text-[10px] font-black tracking-[0.5em] uppercase opacity-70">STEREO / DIGITAL RELEASE</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Album Metadata -->
        <div class="flex-1 flex flex-col justify-between self-stretch pt-4 md:pt-8 w-full">
          <div>
            <div class="flex flex-wrap items-center gap-3 mb-6">
              <span class="bg-[#FF3B00] text-white px-2 py-1 text-[10px] md:text-xs font-black italic uppercase whitespace-nowrap">{{ t.adv }}</span>
              <span class="text-[10px] md:text-xs font-bold text-[#0033FF] tracking-widest uppercase">LP-2026-SJ</span>
            </div>
            
            <p class="text-xs md:text-sm font-bold uppercase tracking-widest text-[#0033FF] mb-2">{{ t.role }}</p>
            
            <h1 class="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] uppercase mb-6 md:mb-8" style="font-family: impact, ui-sans-serif, sans-serif; word-break: keep-all;">
              <span v-if="!isEn">水何<br/><span class="text-[#0033FF]">澹澹</span></span>
              <span v-else class="text-[#0033FF] leading-[0.9]">SUI HE<br/>DAN DAN</span>
            </h1>
            
            <div class="space-y-4">
              <p class="text-lg md:text-xl font-bold italic leading-tight border-l-4 md:border-l-8 border-[#FF3B00] pl-4 md:pl-6 py-1 md:py-2 text-[#222]">
                {{ t.desc }}
              </p>
              <p class="text-lg md:text-xl font-bold italic leading-tight border-l-4 md:border-l-8 border-[#0033FF] pl-4 md:pl-6 py-1 md:py-2 text-[#222]">
                {{ t.aiDesc }}
              </p>
              <p class="text-sm md:text-base font-medium text-[#555] max-w-xl">
                {{ t.side }}
              </p>
            </div>
            
            <div class="mt-6 flex flex-wrap gap-2">
              <span v-for="lang in t.langs" :key="lang" class="border-2 border-[#111] px-3 py-1 text-xs md:text-sm font-bold uppercase rounded-full hover:bg-[#111] hover:text-[#EFECE6] transition-colors">{{ lang }}</span>
            </div>
          </div>

          <div class="mt-10 md:mt-12">
            <div class="grid grid-cols-2 gap-4 border-t-4 border-[#111] pt-4 md:pt-6">
              <div>
                <p class="text-[10px] font-black text-[#0033FF] uppercase mb-1">{{ t.artist }}</p>
                <p class="font-bold text-sm md:text-base">SUI HE DAN DAN</p>
              </div>
              <div>
                <p class="text-[10px] font-black text-[#0033FF] uppercase mb-1">{{ t.format }}</p>
                <p class="font-bold text-sm md:text-base">HI-RES AUDIO LP</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Partners / AI Models Marquee -->
    <section class="max-w-7xl mx-auto px-6 md:px-12 mt-12 md:mt-16 xl:pl-32">
      <div class="text-left mb-3">
        <span class="text-xs md:text-sm font-black text-[#0033FF] uppercase tracking-widest border-l-4 border-[#FF3B00] pl-3">{{ isEn ? 'AI Voice Partners' : 'AI 语音模型训练合作' }}</span>
      </div>
      <div class="border-4 border-[#111] py-6 md:py-8 overflow-hidden relative bg-white shadow-[8px_8px_0px_#111]">
        <div class="absolute top-0 left-0 w-12 md:w-20 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div class="absolute top-0 right-0 w-12 md:w-20 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
        
        <div class="flex w-max animate-marquee hover:[animation-play-state:paused] items-center">
          <!-- Set 1 -->
          <div class="flex items-center gap-12 md:gap-24 px-6 md:px-12">
            <div class="flex flex-col items-center justify-center gap-3 group cursor-pointer">
              <div class="h-10 md:h-12 flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                <span class="text-2xl md:text-3xl font-black uppercase tracking-tighter text-[#111]">花小呗</span>
              </div>
              <span class="text-[10px] md:text-xs font-bold text-[#FF3B00] uppercase tracking-widest text-center">正太音 / 妩媚御姐<br/>温柔少御 / 活泼女友</span>
            </div>
            <div class="flex flex-col items-center justify-center gap-3 group cursor-pointer">
              <div class="h-10 md:h-12 flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e5/HoYoverse_logo.svg" alt="米哈游" class="h-full object-contain" />
              </div>
              <span class="text-[10px] md:text-xs font-bold text-[#0033FF] uppercase tracking-widest text-center">ASMR 专属定制</span>
            </div>
            <div class="flex flex-col items-center justify-center gap-3 group cursor-pointer">
              <div class="h-10 md:h-12 flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/IFLYTEK_Logo.svg" alt="科大讯飞" class="h-full object-contain" />
              </div>
              <span class="text-[10px] md:text-xs font-bold text-[#FF3B00] uppercase tracking-widest text-center">双人闲聊语料库</span>
            </div>
            <div class="flex flex-col items-center justify-center gap-3 group cursor-pointer">
              <div class="h-10 md:h-12 flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Tencent_Cloud_logo.svg" alt="腾讯云" class="h-full object-contain" />
              </div>
              <span class="text-[10px] md:text-xs font-bold text-[#0033FF] uppercase tracking-widest text-center">深圳腾讯云女声助手</span>
            </div>
          </div>
          <!-- Set 2 for seamless loop -->
          <div class="flex items-center gap-12 md:gap-24 px-6 md:px-12">
            <div class="flex flex-col items-center justify-center gap-3 group cursor-pointer">
              <div class="h-10 md:h-12 flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                <span class="text-2xl md:text-3xl font-black uppercase tracking-tighter text-[#111]">花小呗</span>
              </div>
              <span class="text-[10px] md:text-xs font-bold text-[#FF3B00] uppercase tracking-widest text-center">正太音 / 妩媚御姐<br/>温柔少御 / 活泼女友</span>
            </div>
            <div class="flex flex-col items-center justify-center gap-3 group cursor-pointer">
              <div class="h-10 md:h-12 flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e5/HoYoverse_logo.svg" alt="米哈游" class="h-full object-contain" />
              </div>
              <span class="text-[10px] md:text-xs font-bold text-[#0033FF] uppercase tracking-widest text-center">ASMR 专属定制</span>
            </div>
            <div class="flex flex-col items-center justify-center gap-3 group cursor-pointer">
              <div class="h-10 md:h-12 flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/IFLYTEK_Logo.svg" alt="科大讯飞" class="h-full object-contain" />
              </div>
              <span class="text-[10px] md:text-xs font-bold text-[#FF3B00] uppercase tracking-widest text-center">双人闲聊语料库</span>
            </div>
            <div class="flex flex-col items-center justify-center gap-3 group cursor-pointer">
              <div class="h-10 md:h-12 flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Tencent_Cloud_logo.svg" alt="腾讯云" class="h-full object-contain" />
              </div>
              <span class="text-[10px] md:text-xs font-bold text-[#0033FF] uppercase tracking-widest text-center">深圳腾讯云女声助手</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tracklist (The Album Structure) -->
    <main id="works" class="max-w-7xl mx-auto px-6 md:px-12 mt-16 md:mt-24 xl:pl-32 scroll-mt-12">
      <div class="flex flex-col sm:flex-row sm:items-baseline justify-between border-b-4 md:border-b-8 border-[#111] pb-4 mb-8 md:mb-12 gap-4">
        <h2 class="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">{{ t.tracklist }}</h2>
        <div class="text-left sm:text-right">
          <p class="text-[10px] md:text-xs font-black text-[#0033FF] uppercase">{{ t.duration }}</p>
          <p class="text-lg md:text-xl font-bold tracking-tighter">{{ t.infinite }}</p>
        </div>
      </div>

      <!-- Filter Tabs as 'Discs' (Scrollable on mobile) -->
      <div class="flex overflow-x-auto pb-4 mb-8 md:mb-16 gap-3 snap-x scrollbar-hide">
        <button
          v-for="(category, idx) in t.categories"
          :key="category"
          @click="activeCategoryIdx = idx; visibleCount = PAGE_SIZE"
          :class="[
            'group relative overflow-hidden px-5 md:px-8 py-2 md:py-3 transition-all duration-300 shrink-0 snap-start',
            activeCategoryIdx === idx ? 'text-white' : 'text-[#111]'
          ]"
        >
          <div :class="['absolute inset-0 border-2 md:border-4 border-[#111] transition-transform duration-300', activeCategoryIdx === idx ? 'bg-[#111] translate-x-0 translate-y-0' : 'bg-transparent translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0']"></div>
          <span class="relative z-10 font-black uppercase text-xs md:text-sm tracking-widest whitespace-nowrap">{{ category }}</span>
        </button>
      </div>

      <!-- Compact List Style -->
      <div class="divide-y-2 md:divide-y-4 divide-[#111] border-b-2 md:border-b-4 border-[#111]">
        <article
          v-for="(work, index) in displayedWorks"
          :key="work.title"
          class="group flex flex-col sm:flex-row sm:items-center py-5 md:py-6 gap-3 md:gap-6 transition-colors hover:bg-white/40"
        >
          <!-- Number & Mobile Title row -->
          <div class="flex items-center gap-3 sm:w-12 sm:shrink-0">
            <span class="text-xl md:text-2xl font-black text-[#0033FF] italic w-8 md:w-12 shrink-0">{{ String(index + 1).padStart(2, '0') }}</span>
            <h3 class="text-xl font-black uppercase tracking-tight leading-none sm:hidden flex-1">{{ work.title }}</h3>
          </div>
          
          <div class="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-2 md:gap-4 items-start sm:items-center pl-11 sm:pl-0">
            <div class="sm:col-span-4 hidden sm:block">
              <h3 class="text-xl md:text-2xl font-black uppercase tracking-tight group-hover:text-[#FF3B00] transition-colors leading-none mb-1">{{ work.title }}</h3>
              <p class="text-[10px] md:text-xs font-bold text-[#888] uppercase tracking-widest">{{ t.roleLabel }}: {{ work.role }}</p>
            </div>
            <div class="sm:hidden mb-1">
               <p class="text-[10px] font-bold text-[#888] uppercase tracking-widest">{{ t.roleLabel }}: {{ work.role }}</p>
            </div>
            
            <div class="sm:col-span-5">
              <p class="text-xs md:text-sm font-medium text-[#444] line-clamp-2 md:line-clamp-1 italic pr-4">"{{ work.description }}"</p>
            </div>

            <div class="sm:col-span-1 hidden sm:block text-center">
              <span class="text-[10px] md:text-xs font-black bg-[#111] text-[#EFECE6] px-2 py-0.5 rounded uppercase whitespace-nowrap">{{ isEn ? 'TRACK' : work.type }}</span>
            </div>

            <div class="sm:col-span-2 flex justify-between sm:justify-end items-center gap-4 mt-2 sm:mt-0">
              <div class="flex items-center gap-3">
                <span class="text-[10px] font-black bg-[#111] text-[#EFECE6] px-2 py-0.5 rounded uppercase sm:hidden">{{ isEn ? 'TRACK' : work.type }}</span>
                <span class="text-xs md:text-sm font-black italic tracking-tighter opacity-40">[{{ work.year }}]</span>
              </div>
              <a v-if="work.link" :href="work.link" target="_blank" class="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full border-2 border-[#111] flex items-center justify-center hover:bg-[#FF3B00] hover:text-white transition-all bg-white sm:bg-transparent">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            </div>
          </div>
        </article>
      </div>

      <!-- Load More -->
      <div ref="loadMoreRef" class="mt-16 md:mt-20 flex flex-col items-center">
        <button
          v-if="hasMoreWorks"
          @click="loadMoreWorks"
          class="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] md:tracking-[0.5em] border-b-2 md:border-b-4 border-[#111] pb-1 hover:text-[#0033FF] hover:border-[#0033FF] transition-all"
        >
          {{ t.loadMore }}
        </button>
        <div v-else class="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 md:w-12 md:h-12 mx-auto text-[#111] mb-2 md:mb-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 3-3 4 4 4-4 3 3z"/></svg>
          <p class="text-[10px] md:text-sm font-black text-[#111] tracking-[0.2em] md:tracking-[0.3em] uppercase opacity-50">{{ t.noMore }}</p>
        </div>
      </div>
      
      <!-- Contact / QR Code Footer -->
      <div id="contact" class="mt-32 pt-16 border-t-8 border-[#111] relative scroll-mt-24">
        <div class="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#FF3B00] text-white px-6 py-2 font-black italic uppercase tracking-widest border-4 border-[#111] shadow-[4px_4px_0px_#111]">
          {{ t.contact }}
        </div>
        
        <div class="mx-auto max-w-3xl rounded-3xl border-4 border-[#111] bg-white p-6 md:p-8 shadow-[10px_10px_0px_#111]">
          <div class="flex flex-col md:flex-row items-center justify-between gap-8">
            <div class="text-center md:text-left">
              <h3 class="text-3xl font-black uppercase tracking-tighter mb-2">Booking & Inquiries</h3>
              <p class="text-sm font-medium text-[#555] mb-6">{{ t.scan }}</p>
              <button @click="showQR = !showQR" class="bg-[#111] text-white px-8 py-3 font-bold uppercase tracking-wider hover:bg-[#0033FF] transition-colors border-2 border-[#111] rounded-full">
                {{ showQR ? (isEn ? 'Close QR' : '收起二维码') : (isEn ? 'Show WeChat QR' : '显示企微二维码') }}
              </button>
            </div>
            
            <div v-if="showQR" class="w-48 h-48 bg-white border-4 border-[#111] p-4 shadow-[8px_8px_0px_#111] animate-[fadeInUp_0.3s_ease-out]">
            <!-- Placeholder for QR code -->
            <div class="w-full h-full border-2 border-dashed border-[#ccc] flex items-center justify-center bg-[#f9f9f9]">
              <span class="text-[#888] font-bold text-sm text-center">QR CODE<br/>PLACEHOLDER</span>
            </div>
          </div>
        </div>
      </div>
        
        <div class="mt-24 text-center">
          <p class="text-[10px] font-black text-[#888] uppercase tracking-widest mb-4">Produced by OpenClaw & TreeDy</p>
          <div class="flex justify-center gap-8 opacity-20 filter grayscale">
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
