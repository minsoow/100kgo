import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { association } from "@/content/association";
import { privacy } from "@/content/privacy";
import { isPending, resolveContent } from "@/lib/content-utils";

export const metadata: Metadata = {
  title: privacy.title,
  description:
    "사단법인 한국온라인해외직판협회의 개인정보처리방침입니다.",
};

/** 개인정보 보호책임자 연락처 (협회 기본 정보 재사용) */
function ResponsibleOfficer() {
  const rows = [
    { label: "담당 부서", value: "사무국" },
    { label: "연락처", value: association.contact.tel },
    { label: "전자우편", value: association.contact.email },
  ];

  return (
    <dl className="mt-6 divide-y divide-line border-y border-line">
      {rows.map((row) => (
        <div key={row.label} className="flex gap-6 py-4">
          <dt className="w-28 shrink-0 text-[14px] text-ink-400">{row.label}</dt>
          <dd className="text-[15px] text-ink-900">
            {resolveContent(row.value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <Header variant="plain" />
      <main className="flex-1 pt-24">
        <div className="border-b border-line bg-surface">
          <div className="container-page py-16 md:py-24">
            <h1 className="display-lg text-brand-900">{privacy.title}</h1>
            <p className="mt-5 max-w-3xl text-[16px] leading-[1.85] text-ink-500">
              {privacy.intro}
            </p>
          </div>
        </div>

        <div className="container-page py-16 md:py-20">
          <div className="max-w-3xl">
            {privacy.sections.map((section) => (
              <section key={section.heading} className="mb-14 last:mb-0">
                <h2 className="display-md text-brand-900">{section.heading}</h2>

                {"paragraphs" in section &&
                  section.paragraphs?.map((text) => (
                    <p
                      key={text.slice(0, 20)}
                      className="mt-4 text-[15px] leading-[1.9] text-ink-700 md:text-[16px]"
                    >
                      {text}
                    </p>
                  ))}

                {"items" in section && section.items && (
                  <ul className="mt-4 space-y-2.5">
                    {section.items.map((item) => (
                      <li
                        key={item.slice(0, 20)}
                        className="flex gap-3 text-[15px] leading-[1.9] text-ink-700 md:text-[16px]"
                      >
                        <span aria-hidden className="text-brand-400">
                          ·
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {"table" in section && section.table && (
                  <div className="mt-5 overflow-x-auto">
                    <table className="w-full min-w-[44rem] border-collapse text-left text-[14px]">
                      <thead>
                        <tr className="border-y border-line bg-surface">
                          {section.table.head.map((cell) => (
                            <th
                              key={cell}
                              scope="col"
                              className="px-4 py-3 font-bold text-ink-900"
                            >
                              {cell}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.table.rows.map((row) => (
                          <tr key={row[0]} className="border-b border-line">
                            {row.map((cell) => (
                              <td
                                key={cell}
                                className="px-4 py-3 align-top leading-[1.7] text-ink-700"
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {"paragraphs2" in section &&
                  section.paragraphs2?.map((text) => (
                    <p
                      key={text.slice(0, 20)}
                      className="mt-4 text-[15px] leading-[1.9] text-ink-700 md:text-[16px]"
                    >
                      {text}
                    </p>
                  ))}

                {"contact" in section && section.contact && (
                  <ResponsibleOfficer />
                )}
              </section>
            ))}

            <p className="mt-16 border-t border-line pt-6 text-[14px] text-ink-400">
              시행일{" "}
              {isPending(privacy.effectiveDate)
                ? "지정 예정"
                : privacy.effectiveDate}
            </p>

            <p className="mt-10">
              <Link
                href="/"
                className="text-[15px] font-medium text-brand-600 transition-colors hover:text-brand-700"
              >
                ← 홈으로 돌아가기
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
