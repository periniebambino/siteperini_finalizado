(() => {
  'use strict';
  const cfg = window.PERINI_CONFIG || {};
  const videoTrigger = document.querySelector('[data-coc-page-video-play]');
  if (videoTrigger) {
    const configuredVideoId = cfg.media?.cocVideoId;
    const configuredVideoUrl = cfg.media?.cocVideoUrl;
    if (configuredVideoId) videoTrigger.dataset.videoId = configuredVideoId;
    if (configuredVideoUrl) videoTrigger.href = configuredVideoUrl;
    const cover = videoTrigger.querySelector('[data-coc-video-cover]');
    if (cover && configuredVideoId) {
      cover.src = `https://i.ytimg.com/vi/${encodeURIComponent(configuredVideoId)}/maxresdefault.jpg`;
      cover.onerror = () => {
        cover.onerror = null;
        cover.src = `https://i.ytimg.com/vi/${encodeURIComponent(configuredVideoId)}/hqdefault.jpg`;
      };
    }
    videoTrigger.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const videoId = cfg.media?.cocVideoId || videoTrigger.dataset.videoId;
      if (!videoId) return;
      const iframe = document.createElement('iframe');
      iframe.className = 'coc-video-embed';
      iframe.src = `${cfg.media?.cocEmbedBase || 'https://www.youtube-nocookie.com/embed/'}${encodeURIComponent(videoId)}?autoplay=1&rel=0`;
      iframe.title = 'Vídeo do Sistema COC de Ensino';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.setAttribute('tabindex', '0');
      videoTrigger.replaceWith(iframe);
      iframe.focus({ preventScroll: true });
    }, { once: true });
  }

  const stageTabs = [...document.querySelectorAll('[data-coc-stage-tab]')];
  const stageTracks = [...document.querySelectorAll('[data-coc-gallery-track]')];
  const summaries = [...document.querySelectorAll('[data-coc-stage-summary]')];
  let activeStage = stageTabs.find((tab) => tab.classList.contains('is-active'))?.dataset.cocStageTab || 'fundamental-1';

  const activateStage = (stage) => {
    activeStage = stage;
    stageTabs.forEach((tab) => {
      const isActive = tab.dataset.cocStageTab === stage;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });
    stageTracks.forEach((track) => {
      const isActive = track.dataset.cocGalleryTrack === stage;
      track.hidden = !isActive;
      if (isActive) track.scrollTo({ left: 0, behavior: 'auto' });
    });
    summaries.forEach((summary) => { summary.hidden = summary.dataset.cocStageSummary !== stage; });
  };

  stageTabs.forEach((tab) => tab.addEventListener('click', () => activateStage(tab.dataset.cocStageTab)));

  const prev = document.querySelector('[data-coc-gallery-prev]');
  const next = document.querySelector('[data-coc-gallery-next]');
  const activeTrack = () => stageTracks.find((track) => track.dataset.cocGalleryTrack === activeStage && !track.hidden);
  const move = (direction) => {
    const track = activeTrack();
    if (!track) return;
    const card = track.querySelector('.coc-art-card');
    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || '16');
    const amount = card ? card.getBoundingClientRect().width + gap : track.clientWidth * .82;
    track.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };
  if (prev) prev.addEventListener('click', () => move(-1));
  if (next) next.addEventListener('click', () => move(1));
})();
