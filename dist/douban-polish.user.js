// ==UserScript==
// @name         Douban Polish
// @namespace    http://tampermonkey.net/
// @version      3.3.1
// @author       arvin
// @description  Modernize Douban interface with auto-expand comments and rating filters
// @match        https://movie.douban.com/subject/*
// @match        https://book.douban.com/subject/*
// @match        https://music.douban.com/subject/*
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

(o=>{if(typeof GM_addStyle=="function"){GM_addStyle(o);return}const e=document.createElement("style");e.textContent=o,document.head.append(e)})(" .douban-opt-section{max-height:var(--h, 500px);overflow-y:auto!important;border:1px solid #e0e0e0;border-radius:8px;padding:15px;background:#fafafa;margin:20px 0;position:relative}.douban-opt-section::-webkit-scrollbar{width:6px}.douban-opt-section::-webkit-scrollbar-thumb{background:#c1c1c1;border-radius:3px}.opt-header{position:sticky;top:0;background:#fafafa;padding:12px 15px;margin:-15px -15px 15px;border-bottom:2px solid #00b51d;z-index:10;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px}.opt-title{font-size:16px;font-weight:700;color:#111}.opt-count{font-size:12px;color:#666;background:#e8f5e9;padding:3px 10px;border-radius:12px}.filter-bar{display:flex;gap:8px;flex-wrap:wrap;width:100%;margin-top:8px;padding-top:8px;border-top:1px dashed #ddd}.filter-btn{font-size:12px;padding:4px 12px;border:1px solid #ddd;border-radius:15px;background:#fff;cursor:pointer;transition:all .2s}.filter-btn:hover{border-color:#00b51d;color:#00b51d}.filter-btn.active{background:#00b51d;color:#fff;border-color:#00b51d}.star-filter{display:flex;align-items:center;gap:4px;font-size:12px}.star-option{cursor:pointer;padding:2px 6px;border-radius:4px;opacity:.4;transition:all .2s}.star-option:hover,.star-option.active{opacity:1;background:#fff3cd}.star-option.active{font-weight:700;color:#e09015}.douban-nav{position:fixed;top:100px;right:20px;z-index:9999;background:#fff;border-radius:12px;box-shadow:0 4px 20px #00000026;padding:12px;display:flex;flex-direction:column;gap:8px;min-width:140px;border:1px solid #e0e0e0}.nav-btn{background:linear-gradient(135deg,#00b51d,#009615);color:#fff;padding:10px;border-radius:8px;cursor:pointer;font-size:13px;border:none;font-weight:600;transition:all .3s}.nav-btn:hover{transform:translateY(-2px)}.nav-btn.secondary{background:linear-gradient(135deg,#4a90e2,#357abd)}.nav-btn.top{background:#fff;color:#666;border:1px solid #ddd}.review-item-enhanced{border-bottom:1px solid #eee;padding:15px 0}.review-item-enhanced:last-child{border-bottom:none}.script-expand-content{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;line-height:1.6;color:#666}.script-expand-content.expanded{display:block;-webkit-line-clamp:unset}.script-expand-btn{color:#00b51d;cursor:pointer;font-size:13px;margin-top:8px;display:inline-block;font-weight:500}.script-expand-btn:hover{text-decoration:underline}.rating-tag{display:inline-block;padding:2px 8px;border-radius:4px;font-size:12px;margin-right:8px;font-weight:700}.rating-5{background:#00b51d;color:#fff}.rating-4{background:#9b59b6;color:#fff}.rating-3{background:#f39c12;color:#fff}.rating-2{background:#e74c3c;color:#fff}.rating-1{background:#c0392b;color:#fff}.rating-hidden{display:none!important}.douban-opt-section~.pl2,.douban-opt-section+div[class*=more]{display:none!important}.douban-reply-modal{position:fixed;top:0;left:0;right:0;bottom:0;z-index:10000;display:flex;align-items:center;justify-content:center}.reply-modal-overlay{position:absolute;top:0;left:0;right:0;bottom:0;background:#00000080}.reply-modal-content{position:relative;background:#fff;border-radius:12px;width:95%;max-width:800px;max-height:85vh;display:flex;flex-direction:column;box-shadow:0 10px 40px #0000004d;animation:modalSlideIn .3s ease;overflow:hidden}@keyframes modalSlideIn{0%{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}.reply-modal-header{display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid #eee}.reply-modal-header h3{margin:0;font-size:16px;color:#111}.reply-modal-close{background:none;border:none;font-size:24px;color:#999;cursor:pointer;padding:0;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:all .2s}.reply-modal-close:hover{background:#f5f5f5;color:#333}.reply-modal-body{padding:0 20px 20px;overflow-y:auto;max-height:calc(85vh - 60px);border-radius:0 0 12px 12px}.douban-comments-wrapper .comment-list{display:flex;flex-direction:column}.reply-loading,.reply-empty{text-align:center;color:#999;padding:40px}.reply-error{text-align:center;padding:40px}.reply-error p{color:#e74c3c;margin-bottom:16px}.reply-open-original{color:#00b51d;text-decoration:none}.reply-open-original:hover{text-decoration:underline}.reply-iframe-wrapper{width:100%;height:100%;min-height:500px}.reply-iframe-wrapper iframe{width:100%;height:100%;border:none;border-radius:0 0 12px 12px}.reply-list-popup,.douban-comments-wrapper .comment-list{display:flex;flex-direction:column}.douban-comments-wrapper .comment-list h3{color:#111;font-size:14px;margin:0 0 16px;padding-bottom:8px;border-bottom:1px solid #eee}.douban-comments-wrapper .comment-item{display:flex;gap:12px;padding:16px 0;border-bottom:1px solid #eee}.douban-comments-wrapper .comment-item:last-child{border-bottom:none}.douban-comments-wrapper .avatar{flex-shrink:0}.douban-comments-wrapper .avatar img{border-radius:4px}.douban-comments-wrapper .content{flex:1;min-width:0}.douban-comments-wrapper .header{display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap}.douban-comments-wrapper .header a{color:#00b51d;text-decoration:none;font-size:13px}.douban-comments-wrapper .header a:hover{text-decoration:underline}.douban-comments-wrapper .author-tag{background:#00b51d;color:#fff;font-size:11px;padding:2px 6px;border-radius:3px}.douban-comments-wrapper .time{color:#999;font-size:12px}.douban-comments-wrapper .content>p{color:#333;line-height:1.6;font-size:13px;margin:0 0 12px}.douban-comments-wrapper .actions{display:flex;gap:12px;font-size:12px;color:#999}.douban-comments-wrapper .actions span{cursor:pointer}.douban-comments-wrapper .actions span:hover{color:#00b51d}.douban-comments-wrapper .vote-count,.douban-comments-wrapper .reply-vote,.douban-comments-wrapper .reply-btn,.douban-comments-wrapper .reply-report,.douban-comments-wrapper .report{color:#999}.douban-comments-wrapper .reply-list{margin-top:12px;padding-left:20px;border-left:2px solid #e0e0e0}.douban-comments-wrapper .reply-item{display:flex;gap:8px;padding:12px 0;border-bottom:1px solid #f0f0f0}.douban-comments-wrapper .reply-item:last-child{border-bottom:none}.douban-comments-wrapper .bg-img{flex-shrink:0}.douban-comments-wrapper .bg-img img{border-radius:4px}.douban-comments-wrapper .reply-con{flex:1;min-width:0}.douban-comments-wrapper .reply-meta{display:flex;align-items:center;gap:6px;margin-bottom:4px;flex-wrap:wrap}.douban-comments-wrapper .reply-meta a{color:#00b51d;text-decoration:none;font-size:12px}.douban-comments-wrapper .reply-meta a:hover{text-decoration:underline}.douban-comments-wrapper .reply-time{color:#999;font-size:11px}.douban-comments-wrapper .reply-content{color:#333;font-size:12px;line-height:1.5;margin-bottom:4px}.douban-comments-wrapper .reply-quote{display:block;color:#999;background:#f5f5f5;padding:4px 8px;border-radius:3px;margin-bottom:4px;font-size:11px;border-left:2px solid #ddd}.douban-comments-wrapper .reply-actions{display:flex;gap:8px;font-size:11px;color:#999}.douban-comments-wrapper .reply-actions span{cursor:pointer}.douban-comments-wrapper .reply-actions span:hover{color:#00b51d} ");

(function () {
  'use strict';

  const CONFIG = {
    heights: {
      short: 500,
      review: 600
    },
    delay: 1e3,
    pageType: location.hostname.includes("movie") ? "movie" : location.hostname.includes("book") ? "book" : "music"
  };
  const TYPE_NAMES = {
    movie: { short: "短评", review: "影评" },
    book: { short: "短评", review: "书评" },
    music: { short: "短评", review: "乐评" }
  }[CONFIG.pageType];
  const SELECTORS = {
    movie: {
      short: ["#comments-section", ".short-comment", "#hot-comments", ".comment-list", ".mod-bd .short-comment"],
      review: ["#reviews-wrapper", ".reviews", "#reviews", ".review-list", ".mod-bd .review", ".review-section"]
    },
    book: {
      short: [".short-comment", "#comments", ".comment-list", '[data-type="comments"]', "#db-comments-section"],
      review: [".review-list", "#reviews", ".reviews", ".article-list", "#db-reviews-section"]
    },
    music: {
      short: [".short-comment", "#comments", ".comment-list", "#hot-comments"],
      review: [".review-list", "#reviews", ".music-review", ".mod-bd .review"]
    }
  }[CONFIG.pageType];
  const log = (...args) => {
    {
      console.log("[豆瓣优化]", ...args);
    }
  };
  function observeDynamicContent(callback, delay = 500) {
    const observer = new MutationObserver(() => {
      clearTimeout(window._doubanOptTimer);
      window._doubanOptTimer = setTimeout(callback, delay);
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    return observer;
  }
  function observeRouteChange(callback) {
    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        setTimeout(callback, 1200);
      }
    });
    observer.observe(document, {
      subtree: true,
      childList: true
    });
    return observer;
  }
  const state = {
    expanded: { short: false, review: false }
  };
  function safeExpand(type, findContainerFn, optimizeFn) {
    if (state.expanded[type]) return;
    const typeName = type === "short" ? CONFIG.pageType === "movie" ? "短评" : "短评" : CONFIG.pageType === "movie" ? "影评" : CONFIG.pageType === "book" ? "书评" : "乐评";
    log(`开始处理${typeName}...`);
    let container = findContainerFn(type);
    const expandBtn = findSafeExpandButton(type, typeName);
    if (expandBtn) {
      log(`找到安全的展开按钮: "${expandBtn.textContent.trim()}"`);
      const originalHref = expandBtn.getAttribute("href");
      if (originalHref && originalHref.includes("/subject/")) {
        expandBtn.removeAttribute("href");
        log("已移除跳转链接，改为AJAX展开");
      }
      expandBtn.click();
      state.expanded[type] = true;
      setTimeout(() => {
        container = findContainerFn(type) || container;
        if (container) optimizeFn(container, type);
      }, 800);
    } else {
      log(`未找到展开按钮，直接优化现有内容`);
      if (container) optimizeFn(container, type);
    }
  }
  function findSafeExpandButton(type, typeName) {
    const keywords = type === "short" ? ["展开", "更多", "全部", "...", "▼"] : ["展开", "更多", "全部", "...", "▼", "加载"];
    const unsafePatterns = ["/reviews", "/comments", "/subject/", "douban.com/subject"];
    const candidates = document.querySelectorAll('a, button, .j a, .pl2 a, [data-action="expand"], .expand-btn, .load-more');
    for (const btn of candidates) {
      const text = btn.textContent.trim();
      const isMatch = keywords.some((kw) => text.includes(kw));
      if (!isMatch) continue;
      const href = btn.getAttribute("href") || "";
      const isUnsafe = unsafePatterns.some((p) => href.includes(p)) || href && !href.startsWith("#") && !href.startsWith("javascript:");
      const hasAjaxMarker = btn.hasAttribute("data-action") || btn.classList.contains("j") || btn.onclick || btn.getAttribute("data-target");
      if (isUnsafe && !hasAjaxMarker) {
        log(`跳过跳转链接: "${text}" -> ${href}`);
        continue;
      }
      const parent = btn.closest('.mod, section, [id*="comment"], [id*="review"]');
      if (parent && !parent.textContent.includes(typeName)) continue;
      return btn;
    }
    return null;
  }
  function applyBaseOptimization(container, type, count) {
    if (container.classList.contains("douban-opt-section")) return false;
    container.style.setProperty("--h", `${CONFIG.heights[type]}px`);
    container.classList.add("douban-opt-section");
    container.dataset.sectionType = type;
    return true;
  }
  function findContainer(selectors) {
    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el && el.children.length > 0) return el;
    }
    return null;
  }
  function findContainerByTitle(titleText, selectors) {
    var _a;
    const headings = document.querySelectorAll("h2, h3, .pl2, .mod-hd h2, span, div");
    for (const h of headings) {
      if (h.textContent.includes(titleText)) {
        let sibling = (_a = h.parentElement) == null ? void 0 : _a.nextElementSibling;
        if (sibling && sibling.children.length > 2) return sibling;
        const parent = h.closest(".mod, section, article");
        if (parent) {
          const content = parent.querySelector(".bd, .mod-bd, .content, ul, .list");
          if (content) return content;
        }
      }
    }
    return null;
  }
  function hasNativeExpand(item) {
    const nativeExpand = item.querySelector('.expand-btn, [data-action="expand"], .review-expand, .expand, .unfold, .j a');
    if (nativeExpand) {
      const text = nativeExpand.textContent || "";
      if (text.includes("展开") || text.includes("▼") || text.includes("更多")) {
        return true;
      }
      if (nativeExpand.getAttribute("data-action") === "expand") {
        return true;
      }
    }
    const allLinks = item.querySelectorAll("a, button, span");
    for (const link of allLinks) {
      const text = link.textContent.trim();
      if ((text.includes("展开全文") || text === "展开" || text.includes("展开 ▼")) && link.className !== "script-expand-btn") {
        return true;
      }
    }
    return false;
  }
  function createHeader(title, count) {
    const header = document.createElement("div");
    header.className = "opt-header";
    header.innerHTML = `
        <span class="opt-title">${title}</span>
        <span class="opt-count" data-total="${count}">共 ${count} 条</span>
    `;
    return header;
  }
  function isStandaloneListPage$2() {
    const path = location.pathname;
    return path.includes("/reviews") || path.includes("/review") || path.includes("/comments") || path.includes("/comment");
  }
  function findShortCommentContainer() {
    if (isStandaloneListPage$2()) {
      return null;
    }
    let container = findContainer(SELECTORS.short);
    if (!container) {
      container = findContainerByTitle(TYPE_NAMES.short, SELECTORS.short);
    }
    return container;
  }
  function optimizeShortComments(container) {
    const items = container.querySelectorAll(".comment-item, .short-comment-item, .item");
    const count = items.length;
    if (!applyBaseOptimization(container, "short")) return;
    const header = createHeader(TYPE_NAMES.short, count);
    container.insertBefore(header, container.firstChild);
    addRatingTags(container);
    addFilterControls(container);
    log(`短评区域优化完成，共 ${count} 条`);
  }
  function addRatingTags(container) {
    const items = container.querySelectorAll(".comment-item, .short-comment-item, .item");
    items.forEach((item) => {
      if (item.dataset.ratingTagged) return;
      let rating = extractRating(item);
      item.dataset.rating = rating;
      item.dataset.ratingTagged = "true";
      if (rating > 0) {
        const tag = document.createElement("span");
        tag.className = `rating-tag rating-${rating}`;
        tag.textContent = "★".repeat(rating);
        const header = item.querySelector(".header, .hd, .comment-header, .title, .user-info");
        if (header) header.insertBefore(tag, header.firstChild);
      }
    });
  }
  function extractRating(item) {
    let rating = 0;
    const ratingEl = item.querySelector('.rating, .stars, [class*="star"], .allstar');
    if (ratingEl) {
      const className = ratingEl.className || "";
      const match = className.match(/allstar(\d+)/) || className.match(/rating(\d+)/);
      if (match) rating = parseInt(match[1]) / 10;
      const title = ratingEl.getAttribute("title");
      if (title) {
        const map = { "力荐": 5, "推荐": 4, "还行": 3, "较差": 2, "很差": 1 };
        for (const [k, v] of Object.entries(map)) {
          if (title.includes(k)) rating = v;
        }
      }
    }
    if (!rating) {
      const text = item.textContent;
      const map = { "力荐": 5, "推荐": 4, "还行": 3, "较差": 2, "很差": 1 };
      for (const [k, v] of Object.entries(map)) {
        if (text.includes(k)) rating = v;
      }
    }
    return rating;
  }
  function addFilterControls(container) {
    const header = container.querySelector(".opt-header");
    if (!header || header.querySelector(".filter-bar")) return;
    const filterBar = document.createElement("div");
    filterBar.className = "filter-bar";
    filterBar.innerHTML = `
        <div class="star-filter">
            <span>筛选:</span>
            <span class="star-option active" data-rating="0">全部</span>
            <span class="star-option" data-rating="5">★★★★★</span>
            <span class="star-option" data-rating="4">★★★★</span>
            <span class="star-option" data-rating="3">★★★</span>
            <span class="star-option" data-rating="2">★★</span>
            <span class="star-option" data-rating="1">★</span>
        </div>
    `;
    filterBar.querySelectorAll(".star-option").forEach((opt) => {
      opt.addEventListener("click", (e) => {
        const rating = parseInt(e.target.dataset.rating);
        filterBar.querySelectorAll(".star-option").forEach((o) => o.classList.remove("active"));
        e.target.classList.add("active");
        filterByRating(container, rating);
      });
    });
    header.appendChild(filterBar);
  }
  function filterByRating(container, rating) {
    const items = container.querySelectorAll("[data-rating]");
    let visible = 0;
    items.forEach((item) => {
      const itemRating = parseInt(item.dataset.rating) || 0;
      const show = rating === 0 || itemRating === rating;
      item.classList.toggle("rating-hidden", !show);
      if (show) visible++;
    });
    const countEl = container.querySelector(".opt-count");
    const total = countEl.dataset.total;
    countEl.textContent = `显示 ${visible}/${total} 条`;
  }
  function isStandaloneListPage$1() {
    const path = location.pathname;
    return path.includes("/reviews") || path.includes("/review") || path.includes("/comments") || path.includes("/comment");
  }
  function findReviewContainer() {
    if (isStandaloneListPage$1()) {
      return null;
    }
    let container = findContainer(SELECTORS.review);
    if (!container) {
      container = findContainerByTitle(TYPE_NAMES.review, SELECTORS.review);
    }
    return container;
  }
  function optimizeReviews(container) {
    const items = container.querySelectorAll(".review-item, .article, .review, [data-cid]");
    const count = items.length;
    if (!applyBaseOptimization(container, "review")) return;
    const header = createHeader(TYPE_NAMES.review, count);
    container.insertBefore(header, container.firstChild);
    smartEnhanceReviews(container);
    addReviewFilters(container);
    log(`影评区域优化完成，共 ${count} 条`);
  }
  function smartEnhanceReviews(container) {
    const items = container.querySelectorAll(".review-item, .article, .review, [data-cid]");
    items.forEach((item) => {
      if (item.classList.contains("script-enhanced") || item.classList.contains("douban-native-enhanced")) {
        return;
      }
      if (hasNativeExpand(item)) {
        item.classList.add("douban-native-enhanced");
        log("跳过已有原生展开按钮的影评");
        return;
      }
      const content = item.querySelector(".short-content, .review-content, .content, .main-bd > div");
      if (content && content.textContent.trim().length > 150) {
        addScriptExpand(item, content);
      } else {
        item.classList.add("script-enhanced");
      }
    });
  }
  function addScriptExpand(item, content) {
    content.classList.add("script-expand-content");
    const expandBtn = document.createElement("span");
    expandBtn.className = "script-expand-btn";
    expandBtn.innerHTML = '展开全文 <span style="font-size:10px">▼</span>';
    expandBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isExpanded = content.classList.contains("expanded");
      content.classList.toggle("expanded");
      expandBtn.innerHTML = isExpanded ? '展开全文 <span style="font-size:10px">▼</span>' : '收起 <span style="font-size:10px">▲</span>';
    });
    if (content.nextElementSibling) {
      content.parentElement.insertBefore(expandBtn, content.nextElementSibling);
    } else {
      item.appendChild(expandBtn);
    }
    item.classList.add("review-item-enhanced", "script-enhanced");
  }
  function addReviewFilters(container) {
    const header = container.querySelector(".opt-header");
    if (!header || header.querySelector(".filter-bar")) return;
    const filterBar = document.createElement("div");
    filterBar.className = "filter-bar";
    filterBar.innerHTML = `
        <button class="filter-btn active" data-filter="all">全部</button>
        <button class="filter-btn" data-filter="spoiler">有剧透</button>
        <button class="filter-btn" data-filter="nospoiler">无剧透</button>
        <button class="filter-btn" data-filter="image">带图片</button>
    `;
    filterBar.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        filterBar.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
        filterReviews(container, e.target.dataset.filter);
      });
    });
    header.appendChild(filterBar);
  }
  function filterReviews(container, type) {
    const items = container.querySelectorAll(".review-item, .article, .review, [data-cid]");
    let visible = 0;
    items.forEach((item) => {
      const text = item.textContent.toLowerCase();
      const hasSpoiler = text.includes("剧透") || text.includes("spoiler");
      const hasImage = item.querySelector("img") !== null;
      let show = true;
      if (type === "spoiler") show = hasSpoiler;
      else if (type === "nospoiler") show = !hasSpoiler;
      else if (type === "image") show = hasImage;
      item.style.display = show ? "" : "none";
      if (show) visible++;
    });
    container.querySelector(".opt-count").textContent = `显示 ${visible} 条`;
  }
  function isStandaloneListPage() {
    const path = location.pathname;
    const isReviewsPage = path.includes("/reviews") || path.includes("/review");
    const isCommentsPage = path.includes("/comments") || path.includes("/comment");
    if (isReviewsPage || isCommentsPage) {
      return true;
    }
    return false;
  }
  function addNavPanel() {
    if (document.querySelector(".douban-nav")) return;
    if (isStandaloneListPage()) {
      return;
    }
    const nav = document.createElement("div");
    nav.className = "douban-nav";
    nav.innerHTML = `
        <button class="nav-btn" data-target="short">${TYPE_NAMES.short}</button>
        <button class="nav-btn secondary" data-target="review">${TYPE_NAMES.review}</button>
        <button class="nav-btn top">⬆️ 顶部</button>
    `;
    nav.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const target = e.target.dataset.target;
        if (target) {
          const section = document.querySelector(`[data-section-type="${target}"]`);
          if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
            section.style.boxShadow = "0 0 20px rgba(0,181,29,0.4)";
            setTimeout(() => section.style.boxShadow = "", 1500);
          }
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    });
    document.body.appendChild(nav);
  }
  let replyModal = null;
  function initReplyModal() {
    document.addEventListener("click", handleReplyClick, true);
    log("回应弹窗功能已初始化");
  }
  function handleReplyClick(e) {
    const replyLink = e.target.closest('a[href*="/review/"], a[href*="#comments"]');
    if (!replyLink) return;
    const text = replyLink.textContent.trim();
    if (!text.includes("回应") && !text.includes("回复")) return;
    e.preventDefault();
    e.stopPropagation();
    const href = replyLink.getAttribute("href");
    if (!href) return;
    const url = href.startsWith("http") ? href : `https://${location.hostname}${href}`;
    showReplyModal(url);
  }
  function showReplyModal(url, triggerElement) {
    if (replyModal) {
      replyModal.remove();
    }
    replyModal = document.createElement("div");
    replyModal.className = "douban-reply-modal";
    replyModal.innerHTML = `
        <div class="reply-modal-overlay"></div>
        <div class="reply-modal-content">
            <div class="reply-modal-header">
                <h3>回应</h3>
                <button class="reply-modal-close">×</button>
            </div>
            <div class="reply-modal-body">
                <div class="reply-loading">加载中...</div>
            </div>
        </div>
    `;
    replyModal.querySelector(".reply-modal-close").addEventListener("click", closeModal);
    replyModal.querySelector(".reply-modal-overlay").addEventListener("click", closeModal);
    document.addEventListener("keydown", handleEscKey);
    document.body.appendChild(replyModal);
    document.body.style.overflow = "hidden";
    loadReplies(url);
  }
  async function loadReplies(url) {
    try {
      log("开始加载回应:", url);
      const response = await fetch(url, {
        credentials: "include",
        // 包含 cookies
        headers: {
          "Accept": "text/html,application/xhtml+xml"
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const html = await response.text();
      log("获取到HTML，长度:", html.length);
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      if (!doc.querySelector("title") || !html.includes("douban")) {
        throw new Error("返回内容不是豆瓣页面");
      }
      const commentsSection = extractCommentsSection(doc);
      log("提取结果:", commentsSection ? "有内容" : "无内容");
      updateModalContent(commentsSection, url);
    } catch (error) {
      log("加载回应失败:", error);
      const body = replyModal == null ? void 0 : replyModal.querySelector(".reply-modal-body");
      if (body) {
        body.innerHTML = `
                <div class="reply-error">
                    <p>加载失败: ${error.message}</p>
                    <a href="${url}" target="_blank" class="reply-open-original">在原页面查看</a>
                </div>
            `;
      }
    }
  }
  function extractCommentsSection(doc) {
    var _a;
    const commentsContainer = doc.querySelector("#comments.comment-list");
    if (commentsContainer) {
      const children = commentsContainer.querySelectorAll(".comment-item, [data-cid]");
      log("找到评论区DOM容器，子评论元素数:", children.length);
      if (children.length > 0) {
        return commentsContainer.outerHTML;
      }
    }
    const scripts = doc.querySelectorAll("script");
    log("查找脚本数量:", scripts.length);
    for (const script of scripts) {
      const text = script.textContent;
      if (text.includes("_COMMENTS_CONFIG") && text.includes("comments")) {
        log("找到包含 _COMMENTS_CONFIG 的脚本");
        try {
          const varIdx = text.indexOf("var _COMMENTS_CONFIG");
          if (varIdx === -1) continue;
          const eqIdx = text.indexOf("=", varIdx);
          if (eqIdx === -1) continue;
          let startIdx = -1;
          for (let i = eqIdx + 1; i < text.length; i++) {
            if (text[i] === "{") {
              startIdx = i;
              break;
            }
          }
          if (startIdx === -1) continue;
          let braceCount = 1;
          let inStr = false;
          let strChar = "";
          let endIdx = -1;
          for (let i = startIdx + 1; i < text.length; i++) {
            const ch = text[i];
            const prevCh = text[i - 1];
            if (inStr) {
              if (ch === strChar && prevCh !== "\\") {
                inStr = false;
              }
            } else {
              if (ch === '"' || ch === "'") {
                inStr = true;
                strChar = ch;
              } else if (ch === "{") {
                braceCount++;
              } else if (ch === "}") {
                braceCount--;
                if (braceCount === 0) {
                  endIdx = i + 1;
                  break;
                }
              }
            }
          }
          if (endIdx === -1) {
            log("未能找到对象结束位置");
            continue;
          }
          let configStr = text.substring(startIdx, endIdx);
          log("提取到对象，长度:", configStr.length);
          configStr = configStr.replace(/'afterRender'\s*:\s*function\s*\([^)]*\)\s*\{[\s\S]*?\}\s*(,|$)/, "'afterRender':null$1");
          configStr = configStr.replace(/'\w+'\s*:\s*function\s*\([^)]*\)\s*\{[\s\S]*?\}\s*(,|$)/g, (match, endChar) => "null" + endChar);
          log("清理后长度:", configStr.length);
          const parseFunc = new Function("return " + configStr);
          const config = parseFunc();
          if (config && config.comments && Array.isArray(config.comments) && config.comments.length > 0) {
            log("成功解析，评论数:", config.comments.length);
            return buildCommentsHTML(config.comments);
          } else {
            log("解析成功但没有评论数据，comments:", config == null ? void 0 : config.comments);
          }
        } catch (e) {
          log("解析失败:", e.message, (_a = e.stack) == null ? void 0 : _a.substring(0, 200));
          try {
            log("尝试备用方案：直接提取 comments 数组");
            const commentsMatch = text.match(/'comments'\s*:\s*(\[[\s\S]*\])\s*,?\s*'/);
            if (commentsMatch) {
              const commentsJson = commentsMatch[1].replace(/'([^']*)':/g, '"$1":').replace(/'/g, '"');
              const comments = JSON.parse(commentsJson);
              if (comments && comments.length > 0) {
                log("备用方案成功，评论数:", comments.length);
                return buildCommentsHTML(comments);
              }
            }
          } catch (e2) {
            log("备用方案也失败:", e2.message);
          }
        }
      }
    }
    const anyComments = doc.querySelectorAll("[data-cid]");
    if (anyComments.length > 0) {
      log("找到", anyComments.length, "个评论元素，但未在预期容器中");
    }
    log("未能提取到评论区数据");
    return null;
  }
  function buildCommentsHTML(comments) {
    const commentsHtml = comments.map((comment) => {
      const author = comment.author || {};
      const avatar = author.avatar || "https://img3.doubanio.com/f/shire/3eacdfaa61874a0910d83207302268420e8d5161/pics/icon/default_user_medium.png";
      const isAuthor = comment.is_owner || false;
      let repliesHtml = "";
      if (comment.replies && comment.replies.length > 0) {
        const repliesContent = comment.replies.map((reply) => {
          var _a;
          const rAuthor = reply.author || {};
          const rAvatar = rAuthor.avatar || "https://img3.doubanio.com/f/shire/3eacdfaa61874a0910d83207302268420e8d5161/pics/icon/default_user_medium.png";
          const rIsAuthor = reply.is_owner || false;
          return `
                    <div class="reply-item" data-cid="${reply.id}">
                        <div class="bg-img">
                            <a href="${rAuthor.url || "#"}">
                                <img width="24" height="24" src="${rAvatar}" alt="${rAuthor.name || "未知用户"}">
                            </a>
                        </div>
                        <div class="reply-con">
                            <div class="reply-meta">
                                <a href="${rAuthor.url || "#"}">${rAuthor.name || "未知用户"}</a>
                                ${rIsAuthor ? '<span class="author-tag">作者</span>' : ""}
                                <span class="reply-time">${reply.create_time || ""}</span>
                            </div>
                            <div class="reply-content">
                                ${reply.ref_comment ? `<span class="reply-quote">${((_a = reply.ref_comment.author) == null ? void 0 : _a.name) || ""}: ${reply.ref_comment.text}</span>` : ""}
                                ${reply.text || ""}
                            </div>
                            <div class="reply-actions">
                                <span class="reply-vote">赞(${reply.vote_count || 0})</span>
                                <span class="reply-report">投诉</span>
                            </div>
                        </div>
                    </div>
                `;
        }).join("");
        repliesHtml = `<div class="reply-list">${repliesContent}</div>`;
      }
      return `
            <div class="comment-item" data-cid="${comment.id}">
                <div class="avatar">
                    <a href="${author.url || "#"}">
                        <img width="32" height="32" src="${avatar}" alt="${author.name || "未知用户"}">
                    </a>
                </div>
                <div class="content">
                    <div class="header">
                        <a href="${author.url || "#"}">${author.name || "未知用户"}</a>
                        ${isAuthor ? '<span class="author-tag">作者</span>' : ""}
                        <span class="time">${comment.create_time || ""}</span>
                    </div>
                    <p>${comment.text || ""}</p>
                    <div class="actions">
                        <span class="vote-count">赞(${comment.vote_count || 0})</span>
                        <span class="reply-btn">回应</span>
                        <span class="report">投诉</span>
                    </div>
                    ${repliesHtml}
                </div>
            </div>
        `;
    }).join("");
    return `
        <div id="comments" class="comment-list">
            ${commentsHtml}
        </div>
    `;
  }
  function updateModalContent(commentsHtml, url) {
    const body = replyModal == null ? void 0 : replyModal.querySelector(".reply-modal-body");
    if (!body) return;
    if (!commentsHtml) {
      const iframeUrl = url.includes("#") ? url : url + "#comments";
      body.innerHTML = `
            <div class="reply-iframe-wrapper">
                <iframe src="${iframeUrl}" frameborder="0" style="width:100%;height:100%;min-height:500px;"></iframe>
            </div>
        `;
      return;
    }
    body.innerHTML = `
        <div class="douban-comments-wrapper">
            ${commentsHtml}
        </div>
    `;
  }
  function closeModal() {
    if (replyModal) {
      replyModal.remove();
      replyModal = null;
    }
    document.body.style.overflow = "";
    document.removeEventListener("keydown", handleEscKey);
  }
  function handleEscKey(e) {
    if (e.key === "Escape") {
      closeModal();
    }
  }
  function init() {
    log("初始化开始，页面类型:", CONFIG.pageType);
    initReplyModal();
    setTimeout(() => {
      safeExpand("short", findShortCommentContainer, optimizeShortComments);
      safeExpand("review", findReviewContainer, optimizeReviews);
      addNavPanel();
      setupObservers();
    }, CONFIG.delay);
  }
  function setupObservers() {
    observeDynamicContent(() => {
      const shortContainer = document.querySelector('[data-section-type="short"]');
      const reviewContainer = document.querySelector('[data-section-type="review"]');
      if (shortContainer) {
        const event = new CustomEvent("reapply-ratings", { detail: shortContainer });
        document.dispatchEvent(event);
      }
      if (reviewContainer) {
        const event = new CustomEvent("reapply-reviews", { detail: reviewContainer });
        document.dispatchEvent(event);
      }
    });
    observeRouteChange(() => {
      log("页面路由变化，重新初始化");
      state.expanded = { short: false, review: false };
      init();
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    setTimeout(init, 300);
  }

})();