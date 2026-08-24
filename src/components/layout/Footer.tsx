import Image from "next/image";
import Link from "next/link";
import { association, navItems, BOARD_LABEL } from "@/content/association";
import { resolveContent } from "@/lib/content-utils";

const contactRows = [
  { label: "대표자", value: association.contact.representative },
  { label: "주소", value: association.contact.address },
  { label: "대표전화", value: association.contact.tel },
  { label: "이메일", value: association.contact.email },
  {
    label: "사업자등록번호",
    value: association.contact.businessNumber,
    // 발급 진행 중이라 번호 대신 상태를 표기합니다
    fallback: "발급 진행 중",
  },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-brand-950 text-white/70">
      <div className="container-page py-20 md:py-24">
        {/* 어두운 배경이라 로고를 흰색 단색으로 반전해 사용합니다 */}
        <Image
          src="/images/logo.png"
          alt={association.nameFull}
          width={900}
          height={340}
          className="h-12 w-auto brightness-0 invert md:h-14"
        />
        <p className="mt-6 text-[17px] font-medium text-white">
          {association.nameFull}
        </p>
        <p className="mt-2 text-[12px] tracking-[0.16em] text-white/45">
          {association.nameEn}
        </p>

        <div className="mt-16 grid gap-12 border-t border-white/12 pt-12 md:grid-cols-[1.6fr_1fr_1fr]">
          <dl className="space-y-3 text-[14px]">
            {contactRows.map((row) => (
              <div key={row.label} className="flex gap-5">
                <dt className="w-28 shrink-0 text-white/40">{row.label}</dt>
                <dd className="text-white/80">
                  {resolveContent(row.value, row.fallback)}
                </dd>
              </div>
            ))}
          </dl>

          <nav aria-label="주요 메뉴">
            <p className="text-[12px] tracking-[0.18em] text-white/40">MENU</p>
            <ul className="mt-5 space-y-3 text-[14px]">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white/80 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/board"
                  className="text-white/80 transition-colors hover:text-white"
                >
                  {BOARD_LABEL}
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="운영 채널">
            <p className="text-[12px] tracking-[0.18em] text-white/40">
              CHANNEL
            </p>
            <ul className="mt-5 space-y-3 text-[14px]">
              <li>
                <a
                  href={association.channels.academy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 transition-colors hover:text-white"
                >
                  해외직판아카데미 ↗
                </a>
              </li>
              <li>
                <a
                  href={association.channels.forum}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 transition-colors hover:text-white"
                >
                  해외직판포럼 ↗
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/12 pt-8 text-[13px] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {association.nameFull}. All rights
            reserved.
          </p>
          <Link href="/privacy" className="transition-colors hover:text-white">
            개인정보처리방침
          </Link>
        </div>
      </div>
    </footer>
  );
}
