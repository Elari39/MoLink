/**
 * 全屏水墨背景：以宣纸纹理、墨晕和雾化远山构成抽象层次。
 *
 * 颜色跟随主题变量，明亮主题偏淡墨宣纸，暗色主题偏夜色积墨。
 */
export function InkBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--paper-soft)_0%,var(--paper)_36%,var(--paper)_100%)] dark:bg-[linear-gradient(180deg,#0c1118_0%,var(--paper)_46%,#12151c_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_86%_14%,rgba(166,58,48,0.12)_0_10%,transparent_42%),radial-gradient(ellipse_at_16%_88%,rgba(28,26,23,0.12)_0_16%,transparent_54%)] opacity-90 dark:bg-[radial-gradient(ellipse_at_84%_12%,rgba(192,82,74,0.12)_0_10%,transparent_44%),radial-gradient(ellipse_at_18%_88%,rgba(241,239,232,0.1)_0_16%,transparent_55%)] dark:opacity-70" />

      {/* 宣纸纤维与细微沉积 */}
      <div className="absolute inset-0 opacity-[0.34] mix-blend-multiply dark:opacity-[0.12] dark:mix-blend-screen">
        <div className="h-full w-full bg-[radial-gradient(circle_at_18%_24%,rgba(28,26,23,0.07)_0_1px,transparent_1.5px),radial-gradient(circle_at_76%_64%,rgba(28,26,23,0.05)_0_1px,transparent_1.7px),linear-gradient(105deg,transparent_0_46%,rgba(28,26,23,0.035)_47%,transparent_49%)] bg-[length:42px_42px,68px_68px,180px_180px]" />
      </div>

      <svg
        className="absolute inset-0 h-full w-full text-ink"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="paper-grain" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.92" numOctaves="3" seed="9" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="table" tableValues="0 0.18" />
            </feComponentTransfer>
          </filter>
          <filter id="ink-wash-soften" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
          <filter id="ink-edge-soften" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <linearGradient id="lowerWash" x1="0" x2="0" y1="380" y2="900" gradientUnits="userSpaceOnUse">
            <stop stopColor="currentColor" stopOpacity="0.03" />
            <stop offset="0.52" stopColor="currentColor" stopOpacity="0.08" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width="1440" height="900" filter="url(#paper-grain)" className="opacity-[0.18] dark:opacity-[0.08]" />

        {/* 大面积淡墨沉积 */}
        <g filter="url(#ink-wash-soften)" className="fill-current">
          <path
            d="M-180 594 C 60 482 186 526 350 560 C 518 594 662 476 842 520 C 1028 566 1184 482 1620 540 L1620 940 L-180 940 Z"
            className="opacity-[0.07] dark:opacity-[0.16]"
          />
          <path
            d="M-160 338 C 92 254 238 296 404 332 C 610 378 766 258 942 318 C 1108 374 1264 302 1600 350 L1600 612 C 1282 560 1100 632 906 574 C 740 524 548 614 362 568 C 178 522 48 520 -160 604 Z"
            className="opacity-[0.045] dark:opacity-[0.11]"
          />
        </g>

        {/* 雾化远山，只保留水墨层次，不绘制具象细节；慢速漂移形成轻微视差 */}
        <path
          d="M-120 394 C 96 286 212 308 374 368 C 520 422 652 314 810 364 C 950 408 1034 330 1182 356 C 1328 382 1436 330 1560 368 L1560 900 L-120 900 Z"
          className="ink-drift fill-current opacity-[0.04] dark:opacity-[0.12]"
          style={{ animationDelay: '0s', animationDuration: '22s' }}
        />
        <path
          d="M-120 498 C 82 410 244 448 396 492 C 568 542 706 440 884 498 C 1064 556 1198 470 1560 512 L1560 900 L-120 900 Z"
          className="ink-drift fill-current opacity-[0.065] dark:opacity-[0.18]"
          style={{ animationDelay: '-6s', animationDuration: '26s', animationDirection: 'reverse' }}
        />
        <path
          d="M-96 438 C 126 408 304 430 490 426 C 710 422 914 394 1146 424 C 1310 445 1450 438 1538 424"
          className="ink-drift stroke-current opacity-[0.08] dark:opacity-[0.15]"
          strokeWidth="34"
          strokeLinecap="round"
          filter="url(#ink-edge-soften)"
          style={{ animationDelay: '-3s', animationDuration: '30s' }}
        />

        {/* 宣纸留白下的水气层 */}
        <rect x="-60" y="470" width="1560" height="430" fill="url(#lowerWash)" />
        <g className="stroke-current opacity-[0.055] dark:opacity-[0.12]" strokeLinecap="round">
          <path d="M140 574 C 310 548 500 554 704 574" strokeWidth="2" />
          <path d="M604 628 C 788 602 1016 604 1240 632" strokeWidth="1.8" />
          <path d="M228 704 C 482 676 742 684 996 710" strokeWidth="1.5" />
        </g>
      </svg>

      {/* 浮动墨点（墨花）：轻微上下浮动，作为氛围粒子；暗色主题更克制 */}
      <div className="absolute inset-0 opacity-[0.5] dark:opacity-[0.35]" aria-hidden="true">
        <span className="ink-float absolute left-[8%] top-[18%] h-1.5 w-1.5 rounded-full bg-ink/30 dark:bg-ink/40" style={{ animationDelay: '0s', animationDuration: '7s' }} />
        <span className="ink-float absolute left-[22%] top-[68%] h-1 w-1 rounded-full bg-ink/25 dark:bg-ink/35" style={{ animationDelay: '-2s', animationDuration: '8s' }} />
        <span className="ink-float absolute left-[36%] top-[30%] h-[3px] w-[3px] rounded-full bg-seal/25 dark:bg-seal/30" style={{ animationDelay: '-4s', animationDuration: '9s' }} />
        <span className="ink-float absolute left-[58%] top-[12%] h-1 w-1 rounded-full bg-ink/30 dark:bg-ink/40" style={{ animationDelay: '-1s', animationDuration: '7.5s' }} />
        <span className="ink-float absolute left-[72%] top-[56%] h-1.5 w-1.5 rounded-full bg-ink/25 dark:bg-ink/35" style={{ animationDelay: '-3s', animationDuration: '8.5s' }} />
        <span className="ink-float absolute left-[86%] top-[26%] h-[3px] w-[3px] rounded-full bg-ink/30 dark:bg-ink/40" style={{ animationDelay: '-5s', animationDuration: '6.5s' }} />
        <span className="ink-float absolute left-[14%] top-[44%] h-[3px] w-[3px] rounded-full bg-ink/20 dark:bg-ink/30" style={{ animationDelay: '-2.5s', animationDuration: '9.5s' }} />
        <span className="ink-float absolute left-[48%] top-[80%] h-1 w-1 rounded-full bg-ink/25 dark:bg-ink/35" style={{ animationDelay: '-4.5s', animationDuration: '7s' }} />
        <span className="ink-float absolute left-[92%] top-[70%] h-1 w-1 rounded-full bg-ink/20 dark:bg-ink/30" style={{ animationDelay: '-1.5s', animationDuration: '8s' }} />
        <span className="ink-float absolute left-[4%] top-[84%] h-[3px] w-[3px] rounded-full bg-seal/20 dark:bg-seal/25" style={{ animationDelay: '-3.5s', animationDuration: '6s' }} />
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-paper via-paper/78 to-transparent dark:from-paper dark:via-paper/52" />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-paper/70 to-transparent dark:from-paper/55" />
    </div>
  )
}
