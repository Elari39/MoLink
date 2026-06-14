/**
 * 全屏水墨背景：代码绘制远山、湖面、竹影、飞鸟、舟影与日/月。
 *
 * 颜色跟随主题变量，明亮主题偏宣纸淡墨，暗色主题偏夜山冷墨。
 */
export function InkBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_21%,rgba(166,58,48,0.16),transparent_0_8%,transparent_16%),linear-gradient(180deg,var(--paper-soft)_0%,var(--paper)_45%,var(--paper)_100%)] dark:bg-[radial-gradient(circle_at_86%_20%,rgba(241,239,232,0.18),transparent_0_8%,transparent_15%),linear-gradient(180deg,#09111a_0%,#111821_48%,#151820_100%)]" />
      <div className="absolute inset-0 opacity-[0.28] mix-blend-multiply dark:opacity-[0.1]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_22%_18%,rgba(28,26,23,0.08)_0_1px,transparent_1.6px),radial-gradient(circle_at_72%_68%,rgba(28,26,23,0.06)_0_1px,transparent_1.8px)] bg-[length:44px_44px,62px_62px]" />
      </div>

      {/* 日 / 月 */}
      <div className="absolute right-[7%] top-[16%] h-24 w-24 rounded-full bg-seal/20 blur-[1px] dark:hidden sm:h-28 sm:w-28" />
      <div className="absolute right-[7%] top-[16%] hidden h-24 w-24 rounded-full bg-ink-soft/30 shadow-[0_0_48px_rgba(241,239,232,0.18)] dark:block sm:h-28 sm:w-28">
        <span className="absolute left-5 top-4 h-5 w-5 rounded-full bg-paper/30" />
        <span className="absolute bottom-7 right-6 h-3 w-3 rounded-full bg-paper/25" />
      </div>

      <svg
        className="absolute inset-0 h-full w-full text-ink"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="ink-soft-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <linearGradient id="lakeFade" x1="0" x2="0" y1="360" y2="760" gradientUnits="userSpaceOnUse">
            <stop stopColor="currentColor" stopOpacity="0.06" />
            <stop offset="0.55" stopColor="currentColor" stopOpacity="0.02" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 远山与雾层 */}
        <path
          d="M-120 365 C 50 245 180 240 310 330 C 418 404 532 304 664 346 C 820 396 930 252 1080 322 C 1220 388 1322 260 1560 342 L1560 900 L-120 900 Z"
          className="fill-current opacity-[0.045] dark:opacity-[0.11]"
        />
        <path
          d="M-120 418 C 76 302 220 330 352 392 C 514 468 602 344 754 398 C 884 444 968 374 1112 392 C 1248 410 1340 336 1560 412 L1560 900 L-120 900 Z"
          className="fill-current opacity-[0.06] dark:opacity-[0.14]"
        />
        <path
          d="M-120 520 C 80 430 202 466 352 506 C 540 558 720 456 884 510 C 1048 564 1218 448 1560 510 L1560 900 L-120 900 Z"
          className="fill-current opacity-[0.08] dark:opacity-[0.18]"
        />
        <path
          d="M-80 435 C 190 404 354 432 520 428 C 760 424 944 398 1216 430 C 1364 447 1480 438 1540 430"
          className="stroke-current opacity-[0.09] dark:opacity-[0.16]"
          strokeWidth="28"
          strokeLinecap="round"
          filter="url(#ink-soft-blur)"
        />

        {/* 湖面 */}
        <rect x="-40" y="470" width="1520" height="430" fill="url(#lakeFade)" />
        <g className="stroke-current opacity-[0.08] dark:opacity-[0.14]" strokeLinecap="round">
          <path d="M284 548 C 420 530 560 536 690 548" strokeWidth="2" />
          <path d="M762 590 C 936 566 1138 572 1288 594" strokeWidth="2" />
          <path d="M158 648 C 322 626 520 632 656 648" strokeWidth="1.6" />
          <path d="M810 706 C 1018 684 1206 690 1392 708" strokeWidth="1.6" />
        </g>

        {/* 左侧竹影 */}
        <g className="stroke-current opacity-[0.32] dark:opacity-[0.28]" strokeLinecap="round">
          <path d="M38 900 C 42 710 56 548 102 360" strokeWidth="6" />
          <path d="M94 900 C 96 708 120 514 178 310" strokeWidth="4.5" />
          <path d="M144 900 C 132 712 154 548 236 392" strokeWidth="4" />
          <path d="M74 558 C 16 526 -38 528 -88 552" strokeWidth="3" />
          <path d="M84 508 C 32 458 -22 446 -82 468" strokeWidth="3" />
          <path d="M122 468 C 90 400 38 368 -26 358" strokeWidth="3" />
          <path d="M146 610 C 198 562 242 542 300 548" strokeWidth="3" />
          <path d="M154 536 C 208 492 254 484 318 506" strokeWidth="3" />
          <path d="M196 438 C 258 414 306 420 354 456" strokeWidth="3" />
        </g>
        <g className="fill-current opacity-[0.24] dark:opacity-[0.22]">
          <path d="M42 545 C 0 530 -22 506 -34 474 C 6 488 34 510 42 545 Z" />
          <path d="M79 497 C 30 476 4 445 -8 404 C 42 425 70 456 79 497 Z" />
          <path d="M134 461 C 104 420 100 374 118 330 C 152 370 160 414 134 461 Z" />
          <path d="M150 596 C 198 574 238 578 278 610 C 226 622 188 616 150 596 Z" />
          <path d="M170 520 C 218 492 260 494 302 526 C 252 540 210 536 170 520 Z" />
          <path d="M216 430 C 268 410 306 420 344 458 C 294 462 254 454 216 430 Z" />
        </g>

        {/* 飞鸟 */}
        <g className="stroke-current opacity-[0.28] dark:opacity-[0.34]" strokeWidth="1.6" strokeLinecap="round">
          <path d="M196 214 C 204 206 212 206 220 214 C 228 206 236 206 244 214" />
          <path d="M282 238 C 290 230 298 230 306 238 C 314 230 322 230 330 238" />
          <path d="M1114 242 C 1120 236 1126 236 1132 242 C 1138 236 1144 236 1150 242" />
        </g>

        {/* 右侧小舟 */}
        <g className="stroke-current opacity-[0.24] dark:opacity-[0.32]" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1216 686 C 1264 706 1322 704 1372 682 C 1340 730 1260 732 1216 686 Z" strokeWidth="2.2" />
          <path d="M1304 682 L1304 604" strokeWidth="2" />
          <path d="M1304 608 C 1278 638 1282 666 1304 682" strokeWidth="1.6" />
          <path d="M1306 610 C 1348 642 1354 666 1308 684" strokeWidth="1.6" />
          <path d="M1196 724 C 1264 714 1326 716 1398 728" strokeWidth="1.5" />
        </g>

        {/* 近景山脚 */}
        <path
          d="M-120 780 C 150 692 352 748 536 762 C 778 780 882 700 1042 748 C 1210 798 1344 728 1560 764 L1560 900 L-120 900 Z"
          className="fill-current opacity-[0.08] dark:opacity-[0.22]"
        />
      </svg>

      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-paper via-paper/70 to-transparent dark:from-paper dark:via-paper/45" />
    </div>
  )
}
