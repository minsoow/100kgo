import Image from "next/image";
import { channels } from "@/content/association";

/**
 * 레이아웃: 풀블리드 50/50 미디어 패널
 * 컨테이너 없이 화면 끝까지 붙여 두 패널이 화면을 반씩 나눠 갖습니다.
 */
export function Channels() {
  return (
    <section className="grid md:grid-cols-2">
      {channels.map((channel) => (
        <article
          key={channel.id}
          id={channel.id}
          className="reveal group relative isolate flex min-h-[32rem] scroll-mt-20 flex-col justify-end overflow-hidden bg-brand-950 p-10 md:min-h-[38rem] md:p-14"
        >
          <Image
            src={`/images/channel-${channel.id}.jpg`}
            alt=""
            aria-hidden
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="-z-20 object-cover transition-transform duration-[1200ms] group-hover:scale-105"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-950/92 via-brand-950/55 to-brand-950/30"
          />

          <h2 className="display-lg text-white">{channel.label}</h2>
          <p className="mt-5 max-w-md text-[15px] leading-[1.85] text-white/75 md:text-[16px]">
            {channel.description}
          </p>
          <a
            href={channel.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-9 inline-flex w-fit items-center gap-2 border-b border-white/45 pb-1.5 text-[15px] font-medium whitespace-nowrap text-white transition-colors hover:border-white"
          >
            {channel.linkLabel}
            <span aria-hidden>↗</span>
          </a>
        </article>
      ))}
    </section>
  );
}
