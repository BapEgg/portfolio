"use client";

import {Badge} from "@/components/ui/badge";
import {
    Activity,
    ArrowRight,
    ArrowUpRight,
    Bot,
    Database,
    KeyRound,
    LayoutDashboard,
    MessageSquareMore,
    Radio,
    RefreshCcw,
    ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import {type ReactNode, useRef, useState,} from "react";

import {Java} from "@/components/ui/svgs/java";
import {SpringBoot} from "@/components/ui/svgs/springBoot";
import {SpringSecurity} from "@/components/ui/svgs/springSecurity";
import {Postgresql} from "@/components/ui/svgs/postgresql";
import {Redis} from "@/components/ui/svgs/redis";
import {RabbitMq} from "@/components/ui/svgs/rabbitmq";
import {Debezium} from "@/components/ui/svgs/debezium";
import {Docker} from "@/components/ui/svgs/docker";
import {Nginx} from "@/components/ui/svgs/nginx";
import {Prometheus} from "@/components/ui/svgs/prometheus";
import {Grafana} from "@/components/ui/svgs/grafana";
import {ReactLight} from "@/components/ui/svgs/reactLight";
import {Typescript} from "@/components/ui/svgs/typescript";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type SectionId =
    | "overview"
    | "generation"
    | "async"
    | "outbox"
    | "validation"
    | "snapshot"
    | "auth"
    | "realtime"
    | "monitoring";

/*
 * 기능별 색상이 아니라
 * 문제 해결 과정의 의미에 따라 색상을 사용한다.
 *
 * problem  : 문제 / Before / 장애
 * analysis : 분석 / 비교 / 설계 과정
 * decision : 선택 / 적용 / 결과
 * tradeoff : 비용 / 한계 / 현실적인 판단
 */
type AccentTone =
    | "problem"
    | "analysis"
    | "decision"
    | "tradeoff"
    | "neutral";

interface NavigationItem {
    id: SectionId;
    number?: string;
    title: string;
    icon: ReactNode;
}

interface NavigationGroup {
    label?: string;
    items: readonly NavigationItem[];
}

interface CoreDecision {
    id: SectionId;
    number: string;
    category: string;
    title: string;
    description: string;
    technologies: readonly string[];
    icon: ReactNode;
}

/* -------------------------------------------------------------------------- */
/* Semantic Color System                                                      */
/* -------------------------------------------------------------------------- */

/*
 * 영상에서 본 Latency / Traffic / Errors / Saturation처럼
 * 채도가 너무 높지 않은 Blue / Red / Amber / Green 계열을 사용한다.
 *
 * 단, 밝은 포트폴리오 배경에 맞게 Soft Background를 별도로 둔다.
 */
const toneStyles = {
    /* Traffic 계열 - 문제 / 장애 */
    problem: {
        text: "text-[#B84F57] dark:text-[#E4939A]",
        bg: "bg-[#FBF1F2] dark:bg-[#2C1E20]",
        border: "border-[#E7C5C8] dark:border-[#633D42]",
        rail: "bg-[#DDA9AE] dark:bg-[#70464B]",
        badge: "bg-[#B84F57] text-white",
    },

    /* Latency 계열 - 분석 / 비교 */
    analysis: {
        text: "text-[#496AA8] dark:text-[#91A9D7]",
        bg: "bg-[#F1F4FA] dark:bg-[#1B2230]",
        border: "border-[#C6D0E4] dark:border-[#3E4C69]",
        rail: "bg-[#AABADA] dark:bg-[#485A7B]",
        badge: "bg-[#496AA8] text-white",
    },

    /* Saturation 계열 - 선택 / 적용 / 결과 */
    decision: {
        text: "text-[#41765A] dark:text-[#83B497]",
        bg: "bg-[#F0F6F2] dark:bg-[#19251E]",
        border: "border-[#C2D8CA] dark:border-[#3C5C49]",
        rail: "bg-[#9FBEAA] dark:bg-[#456853]",
        badge: "bg-[#41765A] text-white",
    },

    /* Errors 계열 - Trade-off / 현실 판단 */
    tradeoff: {
        text: "text-[#A48432] dark:text-[#D9BC72]",
        bg: "bg-[#FAF6EA] dark:bg-[#292419]",
        border: "border-[#DED0A6] dark:border-[#5F5636]",
        rail: "bg-[#CCB873] dark:bg-[#6A5D38]",
        badge: "bg-[#A48432] text-white",
    },

    neutral: {
        text: "text-muted-foreground",
        bg: "bg-muted/20",
        border: "border-border",
        rail: "bg-border",
        badge: "bg-foreground text-background",
    },
} as const;

/* -------------------------------------------------------------------------- */
/* Project Data                                                               */
/* -------------------------------------------------------------------------- */

const technologies = [
    {
        name: "Java 21",
        icon: Java,
    },
    {
        name: "Spring Boot",
        icon: SpringBoot,
    },
    {
        name: "PostgreSQL",
        icon: Postgresql,
    },
    {
        name: "RabbitMQ",
        icon: RabbitMq,
    },
    {
        name: "Debezium",
        icon: Debezium,
    },
    {
        name: "Redis",
        icon: Redis,
    },
    {
        name: "React",
        icon: ReactLight,
    },

    // +6
    {
        name: "Spring Security",
        icon: SpringSecurity,
    },
    {
        name: "Docker",
        icon: Docker,
    },
    {
        name: "Nginx",
        icon: Nginx,
    },
    {
        name: "Prometheus",
        icon: Prometheus,
    },
    {
        name: "Grafana",
        icon: Grafana,
    },
    {
        name: "TypeScript",
        icon: Typescript,
    },
] as const;

const navigationGroups: readonly NavigationGroup[] = [
    {
        items: [
            {
                id: "overview",
                title: "개요",
                icon: <LayoutDashboard className="size-4"/>,
            },
        ],
    },

    {
        label: "핵심 흐름",
        items: [
            {
                id: "generation",
                number: "01",
                title: "일정 생성",
                icon: <Bot className="size-4"/>,
            },
        ],
    },

    {
        label: "핵심 의사결정",
        items: [
            {
                id: "async",
                number: "02",
                title: "비동기 처리",
                icon: <MessageSquareMore className="size-4"/>,
            },
            {
                id: "outbox",
                number: "03",
                title: "Outbox & CDC",
                icon: <RefreshCcw className="size-4"/>,
            },
            {
                id: "validation",
                number: "04",
                title: "AI 검증",
                icon: <ShieldCheck className="size-4"/>,
            },
            {
                id: "snapshot",
                number: "05",
                title: "Snapshot",
                icon: <Database className="size-4"/>,
            },
        ],
    },

    {
        label: "지원 설계",
        items: [
            {
                id: "auth",
                number: "06",
                title: "인증",
                icon: <KeyRound className="size-4"/>,
            },
            {
                id: "realtime",
                number: "07",
                title: "실시간 상태",
                icon: <Radio className="size-4"/>,
            },
            {
                id: "monitoring",
                number: "08",
                title: "모니터링",
                icon: <Activity className="size-4"/>,
            },
        ],
    },
];

const coreDecisions: readonly CoreDecision[] = [
    {
        id: "generation",
        number: "01",
        category: "일정 생성",
        title:
            "실제 장소 후보를 기반으로 AI 일정을 생성하도록 구성했습니다.",
        description:
            "Google Places에서 실제 장소 후보를 먼저 수집하고, AI는 해당 후보 안에서 일정을 구성하도록 제한했습니다.",
        technologies: [
            "Google Places",
            "Snapshot",
            "AI",
        ],
        icon: <Bot className="size-5"/>,
    },

    {
        id: "async",
        number: "02",
        category: "비동기 처리",
        title:
            "HTTP 요청과 일정 생성 작업을 분리했습니다.",
        description:
            "요청은 generationId 반환까지만 담당하고, 외부 API를 포함한 긴 후보 수집 작업은 RabbitMQ Worker가 처리합니다.",
        technologies: [
            "RabbitMQ",
            "Worker",
            "ACK",
        ],
        icon: <MessageSquareMore className="size-5"/>,
    },

    {
        id: "outbox",
        number: "03",
        category: "메시지 정합성",
        title:
            "DB 저장과 메시지 발행의 정합성을 Outbox와 CDC로 보완했습니다.",
        description:
            "Business Data와 Outbox Event를 같은 Transaction으로 저장하고, Debezium이 PostgreSQL WAL 변경을 읽어 RabbitMQ로 전달합니다.",
        technologies: [
            "Outbox",
            "Debezium",
            "WAL",
        ],
        icon: <RefreshCcw className="size-5"/>,
    },

    {
        id: "validation",
        number: "04",
        category: "AI 검증",
        title:
            "AI 생성 결과를 서버에서 검증한 뒤 저장합니다.",
        description:
            "AI 응답을 그대로 신뢰하지 않고 Candidate, 일정 구조, 시간 조건과 Domain Rule을 기준으로 다시 검증합니다.",
        technologies: [
            "Validation",
            "Whitelist",
            "Idempotency",
        ],
        icon: <ShieldCheck className="size-5"/>,
    },

    {
        id: "snapshot",
        number: "05",
        category: "생성 데이터 보존",
        title:
            "일정 생성 시점의 입력과 후보 데이터를 Snapshot으로 보존합니다.",
        description:
            "이후 Trip 수정이나 외부 Place 데이터 변경이 과거 Generation의 의미를 바꾸지 않도록 생성 당시 데이터를 저장합니다.",
        technologies: [
            "InputSnapshot",
            "CandidateSnapshot",
        ],
        icon: <Database className="size-5"/>,
    },
];

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function PlanMatePage() {
    const [selectedSection, setSelectedSection] =
        useState<SectionId>("overview");

    const contentRef = useRef<HTMLDivElement>(null);

    const selectSection = (section: SectionId) => {
        setSelectedSection(section);

        if (window.innerWidth < 768) {
            setTimeout(() => {
                contentRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }, 30);
        }
    };

    return (
        <main
            className="
                relative left-1/2
                w-[min(1240px,calc(100vw-32px))]
                -translate-x-1/2
                pb-24 pt-10
                sm:pt-14
            "
        >
            <div
                className="
                    grid
                    md:grid-cols-[210px_minmax(0,1fr)]
                    md:gap-10
                    lg:gap-12
                "
            >
                <ProjectSidebar
                    selectedSection={selectedSection}
                    onSelect={selectSection}
                />

                <div className="min-w-0">
                    <ProjectHeader/>

                    <ProjectMobileNavigation
                        selectedSection={selectedSection}
                        onSelect={selectSection}
                    />

                    <div
                        ref={contentRef}
                        className="mt-10"
                    >
                        <AnimatedContent
                            selectedSection={selectedSection}
                            onSelect={selectSection}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}

/* -------------------------------------------------------------------------- */
/* Header                                                                     */

/* -------------------------------------------------------------------------- */

function ProjectHeader() {
    return (
        <header className="border-b border-border pb-9">
            <h1
                className="
                    text-4xl font-bold
                    tracking-tighter
                    sm:text-5xl
                "
            >
                PlanMate
            </h1>

            <p className="mt-2 text-lg text-muted-foreground sm:text-xl">
                AI 기반 여행 일정 생성 서비스
            </p>

            <p
                className="
                    mt-5 max-w-[850px]
                    break-keep
                    text-sm leading-7
                    text-muted-foreground
                    sm:text-base sm:leading-8
                "
            >
                사용자 여행 조건을 기반으로 실제 장소 후보를 수집하고,
                검증 가능한 AI 여행 일정을 생성하는 서비스입니다.
            </p>

            <div className="mt-5">
                <ProjectTechStack/>
            </div>
        </header>
    );
}

function ProjectTechStack() {
    const [expanded, setExpanded] = useState(false);

    const visibleCount = 7;

    const visibleTechnologies = expanded
        ? technologies
        : technologies.slice(0, visibleCount);

    const hiddenCount =
        technologies.length - visibleCount;

    return (
        <div className="flex flex-wrap items-center gap-2">
            {visibleTechnologies.map((technology) => (
                <div
                    key={technology.name}
                    className="
                        flex h-8 items-center gap-2
                        rounded-lg
                        border border-border
                        bg-background
                        px-2.5
                    "
                >
                    <technology.icon className="size-4 shrink-0"/>

                    <span className="text-xs font-medium">
                        {technology.name}
                    </span>
                </div>
            ))}

            {hiddenCount > 0 && (
                <button
                    type="button"
                    onClick={() =>
                        setExpanded((prev) => !prev)
                    }
                    className="
                        flex h-8 items-center
                        rounded-lg
                        border border-border
                        bg-background
                        px-3
                        text-xs font-semibold
                        text-foreground
                        transition-colors
                        hover:bg-muted
                    "
                >
                    {expanded
                        ? "접기"
                        : `+${hiddenCount}`}
                </button>
            )}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Sidebar                                                                    */

/* -------------------------------------------------------------------------- */

interface ProjectNavigationProps {
    selectedSection: SectionId;
    onSelect: (section: SectionId) => void;
}

function ProjectSidebar({
                            selectedSection,
                            onSelect,
                        }: ProjectNavigationProps) {
    return (
        <aside
            className="
                hidden
                border-r border-border
                pr-6
                md:block
            "
        >
            <div className="sticky top-8">
                <div className="mb-7">
                    <p
                        className="
                            text-[10px] font-bold
                            uppercase tracking-[0.18em]
                            text-foreground
                        "
                    >
                        Project Index
                    </p>

                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        PlanMate 기술 구현 목차
                    </p>
                </div>

                <nav className="space-y-6">
                    {navigationGroups.map(
                        (group, groupIndex) => (
                            <div key={groupIndex}>
                                {group.label && (
                                    <p
                                        className="
                                            mb-2 px-3
                                            text-[10px] font-semibold
                                            tracking-[0.1em]
                                            text-muted-foreground/60
                                        "
                                    >
                                        {group.label}
                                    </p>
                                )}

                                <div className="space-y-1">
                                    {group.items.map(
                                        (item) => {
                                            const active =
                                                selectedSection ===
                                                item.id;

                                            return (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() =>
                                                        onSelect(item.id)
                                                    }
                                                    className={[
                                                        "relative flex w-full items-center gap-2.5 border-l-2 px-3 py-2.5 text-left text-sm transition-all",
                                                        active
                                                            ? "border-foreground bg-muted font-semibold text-foreground"
                                                            : "border-transparent text-muted-foreground hover:border-border hover:bg-muted/50 hover:text-foreground",
                                                    ].join(" ")}
                                                >
                                                    <span className="shrink-0">
                                                        {item.icon}
                                                    </span>

                                                    {item.number && (
                                                        <span
                                                            className={[
                                                                "w-5 shrink-0 text-[10px] tabular-nums",
                                                                active
                                                                    ? "text-foreground"
                                                                    : "text-muted-foreground/50",
                                                            ].join(" ")}
                                                        >
                                                            {item.number}
                                                        </span>
                                                    )}

                                                    <span className="truncate">
                                                        {item.title}
                                                    </span>
                                                </button>
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                        )
                    )}
                </nav>
            </div>
        </aside>
    );
}

function ProjectMobileNavigation({
                                     selectedSection,
                                     onSelect,
                                 }: ProjectNavigationProps) {
    return (
        <div className="mt-6 md:hidden">
            <p
                className="
                    mb-2
                    text-[10px] font-bold
                    uppercase tracking-[0.16em]
                    text-foreground
                "
            >
                Project Index
            </p>

            <div className="flex gap-2 overflow-x-auto pb-2">
                {navigationGroups
                    .flatMap((group) => group.items)
                    .map((item) => {
                        const active =
                            selectedSection === item.id;

                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() =>
                                    onSelect(item.id)
                                }
                                className={[
                                    "flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-colors",
                                    active
                                        ? "border-foreground bg-foreground font-semibold text-background"
                                        : "border-border bg-background text-muted-foreground",
                                ].join(" ")}
                            >
                                {item.icon}
                                {item.title}
                            </button>
                        );
                    })}
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Selected Content                                                           */

/* -------------------------------------------------------------------------- */

interface AnimatedContentProps {
    selectedSection: SectionId;
    onSelect: (section: SectionId) => void;
}

function AnimatedContent({
                             selectedSection,
                             onSelect,
                         }: AnimatedContentProps) {
    return (
        <div
            key={selectedSection}
            className="
                animate-in
                fade-in
                slide-in-from-bottom-2
                duration-300
            "
        >
            {selectedSection === "overview" && (
                <OverviewSection onSelect={onSelect}/>
            )}

            {selectedSection === "generation" && (
                <GenerationSection/>
            )}

            {selectedSection === "async" && (
                <AsyncSection onSelect={onSelect}/>
            )}

            {selectedSection === "outbox" && (
                <OutboxSection/>
            )}

            {selectedSection === "validation" && (
                <ValidationSection/>
            )}

            {selectedSection === "snapshot" && (
                <SnapshotSection/>
            )}

            {selectedSection === "auth" && (
                <AuthenticationSection/>
            )}

            {selectedSection === "realtime" && (
                <RealtimeSection/>
            )}

            {selectedSection === "monitoring" && (
                <MonitoringSection/>
            )}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Overview                                                                   */

/* -------------------------------------------------------------------------- */

function OverviewSection({
                             onSelect,
                         }: {
    onSelect: (section: SectionId) => void;
}) {
    return (
        <div className="space-y-16">
            <section>
                <SectionEyebrow>
                    주요 기능과 기술 설계
                </SectionEyebrow>

                <h2
                    className="
                        mt-3 max-w-[900px]
                        break-keep
                        text-3xl font-bold
                        leading-[1.3] tracking-tighter
                        sm:text-4xl
                    "
                >
                    PlanMate의 주요 구현을
                    기능 흐름별로 정리했습니다.
                </h2>

                <p
                    className="
                        mt-5 max-w-[820px]
                        break-keep
                        text-sm leading-7
                        text-muted-foreground
                        sm:text-base sm:leading-8
                    "
                >
                    실제 장소 후보 수집과 AI 일정 생성부터
                    비동기 작업 처리, 메시지 정합성,
                    AI 결과 검증, 생성 데이터 보존,
                    인증과 실시간 상태 전달, 모니터링까지
                    각 구현에서 어떤 구조와 기술을 선택했는지 확인할 수 있습니다.
                </p>

                <div className="mt-8 space-y-3">
                    {coreDecisions.map((decision) => (
                        <CoreDecisionCard
                            key={decision.id}
                            decision={decision}
                            onClick={() =>
                                onSelect(decision.id)
                            }
                        />
                    ))}
                </div>
            </section>

            <section>
                <div className="flex items-end justify-between gap-5">
                    <div>
                        <SectionEyebrow>
                            전체 흐름
                        </SectionEyebrow>

                        <h3 className="mt-3 text-2xl font-bold">
                            일정 생성 파이프라인
                        </h3>

                        <p
                            className="
                                mt-2 max-w-[720px]
                                break-keep
                                text-sm leading-7
                                text-muted-foreground
                            "
                        >
                            위의 구현은 하나의 일정 생성 흐름 안에서
                            다음과 같이 연결됩니다.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            onSelect("generation")
                        }
                        className="
                            hidden shrink-0
                            items-center gap-1
                            text-sm font-semibold
                            text-foreground
                            transition-colors
                            hover:text-foreground/60
                            sm:flex
                        "
                    >
                        구현 상세
                        <ArrowRight className="size-4"/>
                    </button>
                </div>

                <FlowPanel
                    label="Generation Flow"
                    tone="neutral"
                >
                    <FlowDiagram
                        items={[
                            "생성 요청",
                            "generationId",
                            "RabbitMQ",
                            "Worker",
                            "장소 후보",
                            "AI 생성",
                            "Validation",
                            "일정 저장",
                        ]}
                    />
                </FlowPanel>
            </section>

            <section>
                <SectionEyebrow>
                    지원 기능과 기술 설계
                </SectionEyebrow>

                <h3 className="mt-3 text-2xl font-bold">
                    서비스 운영을 위한 추가 구현
                </h3>

                <p
                    className="
                        mt-2 max-w-[760px]
                        break-keep
                        text-sm leading-7
                        text-muted-foreground
                    "
                >
                    일정 생성 기능 외에도 인증, 실시간 상태 전달,
                    장애 상태 관찰을 위한 구조를 함께 구현했습니다.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <SmallDecisionCard
                        number="06"
                        icon={<KeyRound className="size-5"/>}
                        title="인증"
                        description="사용자 Identity와 로컬/OAuth2 인증 수단을 분리했습니다."
                        technologies={[
                            "Security",
                            "JWT",
                            "Redis",
                        ]}
                        onClick={() =>
                            onSelect("auth")
                        }
                    />

                    <SmallDecisionCard
                        number="07"
                        icon={<Radio className="size-5"/>}
                        title="실시간 상태"
                        description="WebSocket으로 상태를 전달하고 DB를 Source of Truth로 유지했습니다."
                        technologies={[
                            "WebSocket",
                            "STOMP",
                            "REST",
                        ]}
                        onClick={() =>
                            onSelect("realtime")
                        }
                    />

                    <SmallDecisionCard
                        number="08"
                        icon={<Activity className="size-5"/>}
                        title="모니터링"
                        description="비동기 처리와 CDC 상태를 Metric으로 관찰하도록 구성했습니다."
                        technologies={[
                            "Prometheus",
                            "Grafana",
                        ]}
                        onClick={() =>
                            onSelect("monitoring")
                        }
                    />
                </div>
            </section>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* 01 Generation                                                              */

/* -------------------------------------------------------------------------- */

function GenerationSection() {
    return (
        <DesignSectionLayout
            number="01"
            category="일정 생성"
            title="실제 장소 후보를 먼저 수집하고 AI가 후보 안에서 일정을 생성하도록 제한했습니다."
            description={
                <>
                    서버가 Google Places를 통해 실제 장소 후보를 먼저
                    구성하고, AI는 해당 후보 안에서 일정을 생성하도록
                    제한했습니다. 생성 결과는 서버 검증 규칙을 다시
                    통과한 뒤 저장합니다.
                </>
            }
            technologies={[
                "Google Places",
                "Candidate Snapshot",
                "AI Request",
                "Validation",
            ]}
        >
            <ContentBlock
                step="01"
                label="문제 정의"
                tone="problem"
                title="AI의 자유 생성만으로는 실제 장소 여부와 일정 유효성을 보장하기 어려웠습니다."
            >
                <Paragraph>
                    AI에게 목적지와 여행 조건만 전달해 자유롭게 일정을
                    생성하도록 하면{" "}
                    <Strong>
                        존재하지 않는 장소나 검증할 수 없는 장소
                    </Strong>
                    가 포함될 수 있습니다.
                </Paragraph>
            </ContentBlock>

            <ContentBlock
                step="02"
                label="설계"
                tone="analysis"
                title="Google Places에서 실제 장소 후보를 먼저 구성했습니다."
            >
                <FlowPanel
                    label="Candidate Flow"
                    tone="analysis"
                >
                    <FlowDiagram
                        items={[
                            "여행 조건",
                            "Google Places",
                            "후보 수집",
                            "후보 점수화",
                            "Snapshot",
                        ]}
                    />
                </FlowPanel>
            </ContentBlock>

            <ContentBlock
                step="03"
                label="적용"
                tone="decision"
                title="AI의 역할을 실제 후보 안에서 일정을 조합하는 것으로 제한했습니다."
            >
                <Callout tone="decision">
                    AI를 장소 데이터를 만들어내는 Source로 사용하지 않고,
                    서버가 검증한 실제 장소 후보를 조합하는 역할로
                    제한했습니다.
                </Callout>
            </ContentBlock>

            <ContentBlock
                step="04"
                label="결과"
                tone="decision"
                title="서버가 생성 가능한 장소 범위와 검증 기준을 통제합니다."
                last
            >
                <Paragraph>
                    AI가 반환한 결과 역시 Candidate Snapshot과
                    서버 규칙을 기준으로 다시 검증할 수 있어{" "}
                    <Strong>
                        생성과 검증의 기준을 애플리케이션이 소유
                    </Strong>
                    할 수 있습니다.
                </Paragraph>
            </ContentBlock>
        </DesignSectionLayout>
    );
}

/* -------------------------------------------------------------------------- */
/* 02 Async                                                                   */

/* -------------------------------------------------------------------------- */

function AsyncSection({
                          onSelect,
                      }: {
    onSelect: (section: SectionId) => void;
}) {
    return (
        <DesignSectionLayout
            number="02"
            category="비동기 처리"
            title="HTTP 요청과 일정 생성 작업을 분리했습니다."
            description={
                <>
                    외부 API 지연과 사용자 요청의 생명주기를 분리하기 위해
                    HTTP 요청은 작업 접수까지만 담당하도록 했습니다.
                    실제 후보 수집 작업은 RabbitMQ Worker가 비동기로
                    처리합니다.
                </>
            }
            technologies={[
                "RabbitMQ",
                "Worker",
                "ACK",
                "Retry",
                "DLQ",
            ]}
        >
            <ContentBlock
                step="01"
                label="문제 정의"
                tone="problem"
                title="외부 API 지연이 HTTP 응답에 직접 영향을 줬습니다."
            >
                <Paragraph>
                    초기에는 하나의 HTTP 요청 안에서 장소 후보를 수집하고
                    외부 API를 호출한 뒤 결과를 저장하고 응답하는 흐름을
                    고려했습니다.
                </Paragraph>

                <FlowPanel
                    label="Before"
                    tone="problem"
                >
                    <FlowDiagram
                        items={[
                            "HTTP 요청",
                            "후보 수집",
                            "외부 API",
                            "데이터 저장",
                            "HTTP 응답",
                        ]}
                    />
                </FlowPanel>

                <Paragraph>
                    Google Places처럼{" "}
                    <Strong>
                        응답 시간을 애플리케이션에서 통제할 수 없는 외부 API
                    </Strong>
                    가 포함되면 외부 시스템의 지연과 장애가 그대로{" "}
                    <Strong>
                        HTTP 응답 시간
                    </Strong>
                    에 영향을 줍니다.
                </Paragraph>
            </ContentBlock>

            <ContentBlock
                step="02"
                label="책임 분리"
                tone="analysis"
                title="HTTP 요청은 작업 접수까지만 담당하도록 변경했습니다."
            >
                <Paragraph>
                    오래 걸리는 작업 전체를 HTTP 요청이 책임지지 않도록{" "}
                    <Strong>
                        요청 처리와 실제 작업 실행의 책임을 분리
                    </Strong>
                    했습니다.
                </Paragraph>

                <FlowPanel
                    label="Separated Responsibilities"
                    tone="analysis"
                >
                    <div
                        className="
                            grid gap-3
                            md:grid-cols-[1fr_auto_1fr]
                            md:items-stretch
                        "
                    >
                        <ResponsibilityCard
                            label="HTTP Request"
                            badge="요청 책임"
                            title="생성 요청 → generationId 반환"
                            description="HTTP 요청은 작업 접수와 식별자 반환까지만 담당합니다."
                        />

                        <div className="hidden items-center md:flex">
                            <ArrowRight className="size-5 text-muted-foreground/30"/>
                        </div>

                        <ResponsibilityCard
                            label="Background"
                            badge="작업 책임"
                            title="RabbitMQ → Worker → 후보 수집"
                            description="외부 API 호출을 포함한 긴 작업은 HTTP 요청과 독립적으로 처리합니다."
                        />
                    </div>
                </FlowPanel>
            </ContentBlock>

            <ContentBlock
                step="03"
                label="대안 비교"
                tone="analysis"
                title="비동기 작업을 어떤 방식으로 실행할지 비교했습니다."
            >
                <Paragraph>
                    HTTP 요청에서 작업을 분리한다고 해서 Message Queue가
                    반드시 필요한 것은 아닙니다. 구현 복잡도와 작업 보존,
                    재처리 방식을 기준으로 세 가지 대안을 비교했습니다.
                </Paragraph>

                <div className="grid gap-3 lg:grid-cols-3">
                    <AlternativeCard
                        label="대안 1"
                        title="@Async"
                        items={[
                            "Spring 내부에서 간단히 구현 가능",
                            "별도 인프라가 필요 없음",
                            "프로세스에 작업 실행이 종속됨",
                            "재시작 시 작업 복구를 직접 고려해야 함",
                        ]}
                    />

                    <AlternativeCard
                        label="대안 2"
                        title="DB Polling Worker"
                        items={[
                            "DB를 작업 저장소로 사용 가능",
                            "재시작 이후에도 작업 유지",
                            "Polling 주기 관리 필요",
                            "여러 Worker 사용 시 Lock 전략 필요",
                        ]}
                    />

                    <AlternativeCard
                        selected
                        label="대안 3"
                        title="Message Queue Worker"
                        items={[
                            "작업 요청과 실행 주체 분리",
                            "ACK 기반 완료 확인",
                            "Redelivery / Retry 처리",
                            "DLQ 기반 실패 작업 분리",
                        ]}
                    />
                </div>
            </ContentBlock>

            <ContentBlock
                step="04"
                label="최종 선택"
                tone="decision"
                title="Message Queue 기반 작업 큐로 RabbitMQ를 사용했습니다."
            >
                <Paragraph>
                    PlanMate의 작업은 이벤트를 장기간 보관하고 재생하는
                    Event Streaming보다{" "}
                    <Strong>
                        하나의 작업을 Worker가 가져가 처리하고 완료 여부를
                        확인하는 Job Queue
                    </Strong>
                    의 성격에 더 가깝다고 판단했습니다.
                </Paragraph>

                <FlowPanel
                    label="After"
                    tone="decision"
                >
                    <FlowDiagram
                        items={[
                            "생성 요청",
                            "generationId",
                            "RabbitMQ",
                            "Worker",
                            "후보 수집",
                            "상태 변경",
                        ]}
                    />
                </FlowPanel>
            </ContentBlock>

            <ContentBlock
                step="05"
                label="Trade-off"
                tone="tradeoff"
                title="작업 복구 구조를 얻는 대신 운영 복잡도를 함께 가져갔습니다."
            >
                <TradeOffComparison
                    benefits={[
                        "HTTP 요청과 작업 실행의 생명주기를 분리했습니다.",
                        "작업을 메시지로 명시적으로 보관할 수 있습니다.",
                        "ACK와 Redelivery로 처리 완료를 확인할 수 있습니다.",
                        "Retry와 DLQ로 실패 작업을 분리할 수 있습니다.",
                    ]}
                    costs={[
                        "RabbitMQ라는 별도 인프라가 추가됩니다.",
                        "Queue와 Exchange를 관리해야 합니다.",
                        "Broker 장애와 재전달 흐름을 고려해야 합니다.",
                        "Consumer 중복 처리에 대응해야 합니다.",
                    ]}
                />

                <DecisionNote
                    label="현실적인 판단"
                    title="현재 PlanMate 규모에 RabbitMQ가 반드시 필요한 것은 아닙니다."
                >
                    <p>
                        현재 PlanMate의 트래픽과 작업 규모라면{" "}
                        <Strong>
                            @Async 또는 DB Polling Worker
                        </Strong>
                        로도 충분히 구현할 수 있습니다.
                    </p>

                    <p>
                        이번 프로젝트에서는 단순 기능 구현을 넘어{" "}
                        <Strong>
                            ACK, Redelivery, Retry, DLQ와 Consumer 멱등성
                        </Strong>
                        을 직접 다루고 검증하는 것까지 학습 범위에
                        포함했습니다.
                    </p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <JudgementCard
                            title="더 단순한 선택"
                            value="@Async / DB Polling Worker"
                            description="별도 Broker 없이 더 낮은 운영 복잡도로 현재 규모의 작업을 처리할 수 있습니다."
                        />

                        <JudgementCard
                            selected
                            title="이번 프로젝트의 선택"
                            value="RabbitMQ Worker"
                            description="메시지 전달과 재처리에서 발생하는 문제를 직접 구현하고 검증하기 위해 선택했습니다."
                        />
                    </div>
                </DecisionNote>
            </ContentBlock>

            <ContentBlock
                step="06"
                label="다음 문제"
                tone="problem"
                title="작업을 Message Queue로 분리하자 새로운 정합성 문제가 생겼습니다."
                last
            >
                <NextDecisionCard
                    title="DB 저장은 성공했는데 메시지 발행에 실패하면?"
                    description="Database Transaction과 RabbitMQ Publish는 서로 다른 시스템에서 처리되기 때문에 두 작업 사이의 정합성을 별도로 보완해야 했습니다."
                    action="Outbox & CDC"
                    onClick={() =>
                        onSelect("outbox")
                    }
                />
            </ContentBlock>
        </DesignSectionLayout>
    );
}

/* -------------------------------------------------------------------------- */
/* 03 Outbox                                                                  */

/* -------------------------------------------------------------------------- */

function OutboxSection() {
    return (
        <DesignSectionLayout
            number="03"
            category="메시지 정합성"
            title="DB 저장과 메시지 발행의 정합성을 Outbox와 CDC로 보완했습니다."
            description={
                <>
                    Business Data와 Outbox Event를 동일한 Transaction으로
                    저장하고, Outbox Event는 Debezium이 PostgreSQL WAL의
                    변경을 읽어 RabbitMQ로 전달하도록 구성했습니다.
                </>
            }
            technologies={[
                "Transactional Outbox",
                "Debezium",
                "PostgreSQL WAL",
                "RabbitMQ",
            ]}
        >
            <ContentBlock
                step="01"
                label="문제 정의"
                tone="problem"
                title="DB Commit과 메시지 발행은 하나의 Transaction으로 묶을 수 없었습니다."
            >
                <Paragraph>
                    DB Commit에는 성공했지만 RabbitMQ Publish에 실패하면
                    작업 데이터는 존재하지만 Worker는 작업을 전달받지 못하는
                    상태가 발생할 수 있습니다.
                </Paragraph>

                <FlowPanel
                    label="Dual Write Problem"
                    tone="problem"
                >
                    <FlowDiagram
                        items={[
                            "Business 저장",
                            "DB Commit",
                            "RabbitMQ Publish",
                        ]}
                    />
                </FlowPanel>
            </ContentBlock>

            <ContentBlock
                step="02"
                label="해결 방향"
                tone="analysis"
                title="Business Data와 Outbox Event를 하나의 Transaction으로 저장했습니다."
            >
                <Paragraph>
                    비즈니스 데이터와 메시지 발행에 필요한 Event를
                    동일한 DB Transaction에 포함해{" "}
                    <Strong>
                        둘 중 하나만 저장되는 상태를 방지
                    </Strong>
                    했습니다.
                </Paragraph>

                <FlowPanel
                    label="Transactional Outbox"
                    tone="analysis"
                >
                    <FlowDiagram
                        items={[
                            "Application",
                            "Business Data",
                            "+ Outbox Event",
                            "Commit",
                        ]}
                    />
                </FlowPanel>
            </ContentBlock>

            <ContentBlock
                step="03"
                label="대안 비교"
                tone="analysis"
                title="Outbox Event를 어떤 방식으로 전달할지 비교했습니다."
            >
                <div className="grid gap-3 lg:grid-cols-3">
                    <AlternativeCard
                        label="대안 1"
                        title="Application Polling"
                        items={[
                            "구조가 상대적으로 단순",
                            "추가 CDC 인프라 불필요",
                            "주기적 SELECT 필요",
                            "동시 처리 Lock 정책 필요",
                        ]}
                    />

                    <AlternativeCard
                        label="대안 2"
                        title="DB Trigger"
                        items={[
                            "변경 시점에 즉각 처리 가능",
                            "DB 내부 로직 증가",
                            "애플리케이션과 DB 책임 혼합",
                        ]}
                    />

                    <AlternativeCard
                        selected
                        label="대안 3"
                        title="Log-based CDC"
                        items={[
                            "Transaction Log 기반",
                            "Application Polling 불필요",
                            "WAL / Slot / Offset 관리 필요",
                        ]}
                    />
                </div>
            </ContentBlock>

            <ContentBlock
                step="04"
                label="최종 선택"
                tone="decision"
                title="Debezium 기반 Log-based CDC를 적용했습니다."
            >
                <Paragraph>
                    PostgreSQL이 이미 기록하는 WAL을 활용해 변경을 감지하고,
                    Debezium이 이를 읽어 Outbox Event를 전달하도록
                    구성했습니다.
                </Paragraph>

                <FlowPanel
                    label="Selected Flow"
                    tone="decision"
                >
                    <FlowDiagram
                        items={[
                            "Business + Outbox",
                            "PostgreSQL WAL",
                            "Debezium",
                            "RabbitMQ",
                            "Worker",
                        ]}
                    />
                </FlowPanel>
            </ContentBlock>

            <ContentBlock
                step="05"
                label="Trade-off"
                tone="tradeoff"
                title="Polling을 제거한 대신 CDC 운영 비용을 가져갔습니다."
            >
                <TradeOffComparison
                    benefits={[
                        "Polling 없이 DB 변경을 감지합니다.",
                        "WAL 기반 CDC 구조를 경험했습니다.",
                        "Offset 기반 처리 위치를 관리합니다.",
                        "장애 이후 재개 흐름을 학습할 수 있습니다.",
                    ]}
                    costs={[
                        "Debezium 운영 컴포넌트가 추가됩니다.",
                        "Replication Slot을 관리해야 합니다.",
                        "장기 장애 시 WAL 보존량이 증가할 수 있습니다.",
                        "Offset과 Connector 상태를 관리해야 합니다.",
                    ]}
                />

                <DecisionNote
                    label="현실적인 판단"
                    title="현재 PlanMate 규모에 Debezium이 반드시 필요한 것은 아닙니다."
                >
                    <p>
                        현재 서비스 규모에서는{" "}
                        <Strong>
                            Application이 Outbox Table을 Polling하는 방식
                        </Strong>
                        이 구현과 운영 측면에서 더 단순한 선택일 수 있습니다.
                    </p>

                    <p>
                        이번 프로젝트에서는 PostgreSQL WAL,
                        Replication Slot, Offset과 Connector 장애 복구까지
                        직접 이해하기 위해 Log-based CDC를 적용했습니다.
                    </p>
                </DecisionNote>
            </ContentBlock>

            <ContentBlock
                step="06"
                label="장애 검증"
                tone="analysis"
                title="정상 흐름뿐 아니라 장애 상황에서의 복구 동작까지 확인합니다."
                last
            >
                <div className="space-y-2">
                    <ExperimentLink
                        title="Debezium 중단"
                        description="중단 이후 WAL부터 다시 이어 읽는지 확인합니다."
                    />

                    <ExperimentLink
                        title="장기 중단"
                        description="Replication Slot과 WAL 보존 비용을 확인합니다."
                    />

                    <ExperimentLink
                        title="Offset 유실"
                        description="처리 위치 정보가 사라졌을 때 재처리 범위를 확인합니다."
                    />

                    <ExperimentLink
                        title="WAL / Slot 유실"
                        description="Offset과 실제 Source Log의 관계를 확인합니다."
                    />

                    <ExperimentLink
                        title="RabbitMQ 장애"
                        description="Source 처리와 Sink 전달 성공의 경계를 확인합니다."
                    />

                    <ExperimentLink
                        title="Worker Commit 후 ACK 실패"
                        description="Redelivery를 통해 Consumer 멱등성 필요성을 검증합니다."
                    />
                </div>

                <Link
                    href="https://velog.io/@bapegg/posts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                        group mt-5
                        flex items-center justify-between
                        gap-4 rounded-xl
                        border border-border
                        bg-background
                        px-5 py-4
                        transition-colors
                        hover:bg-muted/50
                    "
                >
                    <div>
                        <p className="text-sm font-semibold">
                            PlanMate 개발기와 장애 실험 기록
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                            구현 과정과 실험 결과는 Velog에 기록합니다.
                        </p>
                    </div>

                    <ArrowUpRight className="size-4 shrink-0"/>
                </Link>
            </ContentBlock>
        </DesignSectionLayout>
    );
}

/* -------------------------------------------------------------------------- */
/* 04 Validation                                                              */

/* -------------------------------------------------------------------------- */

function ValidationSection() {
    return (
        <DesignSectionLayout
            number="04"
            category="AI 검증"
            title="AI 생성 결과를 서버에서 검증한 뒤 저장하도록 구성했습니다."
            description={
                <>
                    AI 응답을 신뢰 경계 밖의 입력으로 보고 Candidate,
                    일정 구조, 시간 조건과 Domain Rule을 검증하는
                    Validation Pipeline을 구성했습니다.
                </>
            }
            technologies={[
                "ValidationReport",
                "Whitelist",
                "Idempotency",
                "Time Validation",
            ]}
        >
            <ContentBlock
                step="01"
                label="문제 정의"
                tone="problem"
                title="정상적인 JSON이라고 유효한 일정인 것은 아니었습니다."
            >
                <Paragraph>
                    AI는 Candidate에 존재하지 않는 placeId를 선택하거나
                    필수 장소를 누락하고, 일정 시간을 겹치게 생성할 수도
                    있습니다.
                </Paragraph>
            </ContentBlock>

            <ContentBlock
                step="02"
                label="검증 설계"
                tone="analysis"
                title="저장 전에 서버 Validation Pipeline을 통과시킵니다."
            >
                <FlowPanel
                    label="Validation Flow"
                    tone="analysis"
                >
                    <FlowDiagram
                        items={[
                            "AI Draft",
                            "구조 검증",
                            "Candidate",
                            "시간 검증",
                            "Report",
                            "저장",
                        ]}
                    />
                </FlowPanel>
            </ContentBlock>

            <ContentBlock
                step="03"
                label="검증 분류"
                tone="analysis"
                title="검증 결과를 Error, Warning, Unverified로 구분했습니다."
            >
                <div className="grid gap-3 sm:grid-cols-3">
                    <StatusCard
                        tone="problem"
                        title="Error"
                        description="저장을 차단합니다."
                    />

                    <StatusCard
                        tone="tradeoff"
                        title="Warning"
                        description="저장은 허용하되 경고를 남깁니다."
                    />

                    <StatusCard
                        tone="neutral"
                        title="Unverified"
                        description="현재 데이터로 검증할 수 없는 조건입니다."
                    />
                </div>
            </ContentBlock>

            <ContentBlock
                step="04"
                label="적용 결과"
                tone="decision"
                title="AI 응답을 시스템 내부 데이터로 바로 신뢰하지 않습니다."
                last
            >
                <Callout tone="decision">
                    AI 응답은 시스템에 저장되기 전에 서버가 알고 있는
                    Candidate와 Domain Rule을 기준으로 다시 검증합니다.
                </Callout>
            </ContentBlock>
        </DesignSectionLayout>
    );
}

/* -------------------------------------------------------------------------- */
/* 05 Snapshot                                                                */

/* -------------------------------------------------------------------------- */

function SnapshotSection() {
    return (
        <DesignSectionLayout
            number="05"
            category="생성 데이터 보존"
            title="일정 생성 시점의 입력과 후보 데이터를 Snapshot으로 보존했습니다."
            description={
                <>
                    이후 Trip이 수정되거나 외부 Place 데이터가 변경되더라도
                    과거 Generation이 어떤 입력과 후보를 기반으로 생성됐는지
                    추적할 수 있도록 생성 당시 데이터를 별도로 저장합니다.
                </>
            }
            technologies={[
                "InputSnapshot",
                "CandidateSnapshot",
                "Reproducibility",
            ]}
        >
            <ContentBlock
                step="01"
                label="문제 정의"
                tone="problem"
                title="현재 데이터만으로는 과거 Generation의 생성 근거를 설명하기 어려웠습니다."
            >
                <Paragraph>
                    사용자가 여행 조건을 수정하거나 Google Places의 장소
                    데이터가 변경되면 현재 값만으로는 과거 일정이 어떤
                    조건에서 생성됐는지 알기 어렵습니다.
                </Paragraph>
            </ContentBlock>

            <ContentBlock
                step="02"
                label="설계"
                tone="analysis"
                title="입력 조건과 장소 후보를 각각 Snapshot으로 보존했습니다."
            >
                <div className="grid gap-3 sm:grid-cols-2">
                    <SnapshotCard
                        title="InputSnapshot"
                        label="Generation 생성 시"
                        items={[
                            "목적지 / 여행 기간",
                            "예산 / 관심사",
                            "교통 / 숙소",
                            "필수 방문 조건",
                        ]}
                    />

                    <SnapshotCard
                        title="CandidateSnapshot"
                        label="후보 수집 완료 시"
                        items={[
                            "실제로 사용한 장소 후보",
                            "점수 / 순위",
                            "Place 정보",
                            "Must Visit 여부",
                        ]}
                    />
                </div>
            </ContentBlock>

            <ContentBlock
                step="03"
                label="결과"
                tone="decision"
                title="과거 Generation의 생성 당시 상태를 추적할 수 있게 됐습니다."
                last
            >
                <Callout tone="decision">
                    Generation이 이후 변경되는 Trip 상태나 외부 Provider
                    데이터와 분리되어 어떤 입력과 후보를 기반으로
                    생성됐는지 추적할 수 있습니다.
                </Callout>
            </ContentBlock>
        </DesignSectionLayout>
    );
}

/* -------------------------------------------------------------------------- */
/* 06 Authentication                                                          */

/* -------------------------------------------------------------------------- */

function AuthenticationSection() {
    return (
        <DesignSectionLayout
            number="06"
            category="인증"
            title="사용자 Identity와 인증 수단을 분리했습니다."
            description={
                <>
                    users는 사용자 자체의 Identity를 담당하고,
                    로컬 인증과 OAuth2 인증 정보는 별도 모델로 분리해
                    인증 방식이 사용자 핵심 모델에 섞이지 않도록 구성했습니다.
                </>
            }
            technologies={[
                "Spring Security",
                "JWT",
                "OAuth2",
                "Redis",
            ]}
        >
            <ContentBlock
                step="01"
                label="문제 정의"
                tone="problem"
                title="하나의 users 모델에 모든 인증 정보를 넣으면 책임이 섞입니다."
            >
                <Paragraph>
                    password, provider, providerId를 모두 users에 저장하면
                    인증 방식이 늘어날수록 서로 다른 인증 정보가 하나의
                    사용자 모델에 혼합됩니다.
                </Paragraph>
            </ContentBlock>

            <ContentBlock
                step="02"
                label="대안 비교"
                tone="analysis"
                title="사용자와 인증 수단을 어떻게 나눌지 비교했습니다."
            >
                <div className="grid gap-3 lg:grid-cols-3">
                    <AlternativeCard
                        label="대안 1"
                        title="하나의 users"
                        items={[
                            "초기 구현 단순",
                            "Nullable 인증 필드 증가",
                            "인증 수단 책임 혼합",
                        ]}
                    />

                    <AlternativeCard
                        label="대안 2"
                        title="인증별 사용자"
                        items={[
                            "인증 구조는 명확",
                            "사용자 정보 중복",
                            "동일 사용자 통합 어려움",
                        ]}
                    />

                    <AlternativeCard
                        selected
                        label="대안 3"
                        title="Identity / Credential 분리"
                        items={[
                            "users = 사용자",
                            "local_credentials = 로컬 인증",
                            "oauth_accounts = OAuth2",
                        ]}
                    />
                </div>
            </ContentBlock>

            <ContentBlock
                step="03"
                label="최종 선택"
                tone="decision"
                title="사용자 Identity와 인증 수단을 별도 모델로 구성했습니다."
            >
                <ArchitectureBox tone="decision">
                    <div className="flex flex-col items-center gap-5">
                        <ArchitectureNode
                            title="users"
                            subtitle="사용자 Identity"
                        />

                        <div className="h-7 w-px bg-border"/>

                        <div className="grid w-full max-w-xl grid-cols-2 gap-5">
                            <ArchitectureNode
                                title="local_credentials"
                                subtitle="Local Login"
                            />

                            <ArchitectureNode
                                title="oauth_accounts"
                                subtitle="OAuth2 Login"
                            />
                        </div>
                    </div>
                </ArchitectureBox>
            </ContentBlock>

            <ContentBlock
                step="04"
                label="추가 설계"
                tone="analysis"
                title="Refresh Session은 Redis에서 관리하도록 구성했습니다."
                last
            >
                <Paragraph>
                    Access Token은 JWT로 사용하고 Refresh Session은 Redis에
                    두어 로그아웃이나 비밀번호 변경 시 서버에서 Refresh
                    Session을 폐기할 수 있도록 구성했습니다.
                </Paragraph>
            </ContentBlock>
        </DesignSectionLayout>
    );
}

/* -------------------------------------------------------------------------- */
/* 07 Realtime                                                                */

/* -------------------------------------------------------------------------- */

function RealtimeSection() {
    return (
        <DesignSectionLayout
            number="07"
            category="실시간 상태"
            title="작업 상태는 WebSocket으로 전달하고 DB를 Source of Truth로 유지했습니다."
            description={
                <>
                    비동기 작업의 상태 변경은 WebSocket으로 실시간 전달하되,
                    연결 끊김이나 메시지 유실 이후에도 복구할 수 있도록
                    실제 상태는 DB에 저장하고 REST로 다시 조회할 수 있게
                    구성했습니다.
                </>
            }
            technologies={[
                "WebSocket",
                "STOMP",
                "AFTER_COMMIT",
                "REST Recovery",
            ]}
        >
            <ContentBlock
                step="01"
                label="문제 정의"
                tone="problem"
                title="HTTP 요청 종료 이후에도 사용자에게 작업 상태를 전달해야 했습니다."
            >
                <Paragraph>
                    일정 생성이 비동기로 분리되면 HTTP 요청이 끝난 이후에도
                    후보 수집과 일정 생성 작업이 계속 진행됩니다.
                </Paragraph>
            </ContentBlock>

            <ContentBlock
                step="02"
                label="전달 설계"
                tone="analysis"
                title="Commit 이후 상태 변경을 WebSocket으로 전달합니다."
            >
                <FlowPanel
                    label="Realtime Flow"
                    tone="analysis"
                >
                    <FlowDiagram
                        items={[
                            "상태 변경",
                            "DB Commit",
                            "Domain Event",
                            "Realtime",
                            "WebSocket",
                            "Client",
                        ]}
                    />
                </FlowPanel>
            </ContentBlock>

            <ContentBlock
                step="03"
                label="최종 구조"
                tone="decision"
                title="WebSocket이 아니라 DB를 실제 상태의 기준으로 유지했습니다."
                last
            >
                <Callout tone="decision">
                    WebSocket 연결은 언제든 끊어질 수 있고 특정 메시지를
                    놓칠 수도 있습니다. 따라서 WebSocket은 전달 수단으로
                    사용하고 실제 상태는 DB를 Source of Truth로 유지하며
                    REST 재조회로 복구할 수 있게 했습니다.
                </Callout>
            </ContentBlock>
        </DesignSectionLayout>
    );
}

/* -------------------------------------------------------------------------- */
/* 08 Monitoring                                                              */

/* -------------------------------------------------------------------------- */

function MonitoringSection() {
    return (
        <DesignSectionLayout
            number="08"
            category="모니터링"
            title="비동기 처리와 CDC 상태를 Metric으로 관찰하도록 구성했습니다."
            description={
                <>
                    Worker, Generation, RabbitMQ, CDC 상태를 Metric으로
                    노출하고 Prometheus와 Grafana를 통해 장애 실험에서
                    시스템 내부 상태를 확인할 수 있도록 구성했습니다.
                </>
            }
            technologies={[
                "Prometheus",
                "Grafana",
                "Micrometer",
                "RabbitMQ Metrics",
            ]}
        >
            <ContentBlock
                step="01"
                label="관찰 설계"
                tone="analysis"
                title="애플리케이션뿐 아니라 Worker, Broker, CDC까지 관찰 대상으로 두었습니다."
            >
                <div className="grid gap-3 sm:grid-cols-2">
                    <MetricCard
                        title="Worker"
                        items={[
                            "처리 횟수",
                            "처리 시간",
                            "Retry",
                            "Failure",
                        ]}
                    />

                    <MetricCard
                        title="Generation"
                        items={[
                            "상태별 개수",
                            "FAILED",
                            "Stale",
                        ]}
                    />

                    <MetricCard
                        title="RabbitMQ"
                        items={[
                            "Ready",
                            "Unacked",
                            "Redelivery",
                            "DLQ",
                        ]}
                    />

                    <MetricCard
                        title="CDC"
                        items={[
                            "Connector",
                            "Offset",
                            "Lag",
                            "WAL",
                        ]}
                    />
                </div>
            </ContentBlock>

            <ContentBlock
                step="02"
                label="운영 관점"
                tone="tradeoff"
                title="대시보드 자체보다 장애 상황을 설명할 수 있는 지표에 초점을 맞췄습니다."
                last
            >
                <Callout tone="tradeoff">
                    Debezium 중단, RabbitMQ 장애, Worker ACK 실패를 주입했을 때
                    단순 성공/실패 로그만 보는 것이 아니라 CDC, Broker,
                    Consumer 각각의 상태를 확인할 수 있도록 관찰 지점을
                    정의했습니다.
                </Callout>
            </ContentBlock>
        </DesignSectionLayout>
    );
}

/* -------------------------------------------------------------------------- */
/* Common Components                                                          */

/* -------------------------------------------------------------------------- */

interface DesignSectionLayoutProps {
    number: string;
    category: string;
    title: string;
    description: ReactNode;
    technologies: readonly string[];
    children: ReactNode;
}

function DesignSectionLayout({
                                 number,
                                 category,
                                 title,
                                 description,
                                 technologies,
                                 children,
                             }: DesignSectionLayoutProps) {
    return (
        <article>
            <header className="pb-10">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">
                        {number}
                    </span>

                    <span className="text-sm text-muted-foreground">
                        ·
                    </span>

                    <span className="text-sm font-semibold text-muted-foreground">
                        {category}
                    </span>
                </div>

                <h2
                    className="
                        mt-4 max-w-[920px]
                        break-keep
                        text-3xl font-bold
                        leading-[1.3] tracking-tighter
                        sm:text-4xl
                    "
                >
                    {title}
                </h2>

                <div
                    className="
                        mt-6 max-w-[840px]
                        break-keep
                        text-base leading-8
                        text-foreground/70
                        sm:text-lg
                    "
                >
                    {description}
                </div>

                <div className="mt-5 flex flex-wrap gap-1.5">
                    {technologies.map((technology) => (
                        <Badge
                            key={technology}
                            variant="outline"
                            className="
                                rounded-md
                                border-border
                                bg-background
                                px-2 py-0.5
                                text-[10px]
                                font-medium
                                text-foreground/80
                            "
                        >
                            {technology}
                        </Badge>
                    ))}
                </div>
            </header>

            <div className="border-t border-border pt-10">
                <div className="space-y-16">
                    {children}
                </div>
            </div>
        </article>
    );
}

function ContentBlock({
                          step,
                          label,
                          tone,
                          title,
                          children,
                          last = false,
                      }: {
    step: string;
    label: string;
    tone: AccentTone;
    title: string;
    children: ReactNode;
    last?: boolean;
}) {
    const style = toneStyles[tone];

    return (
        <section className="relative pl-12 sm:pl-14">
            {!last && (
                <span
                    className={[
                        "absolute left-[15px] top-8 -bottom-16 w-px",
                        style.rail,
                    ].join(" ")}
                />
            )}

            <span
                className={[
                    "absolute left-0 top-0 flex size-8 items-center justify-center rounded-full border text-[10px] font-bold tabular-nums",
                    style.bg,
                    style.border,
                    style.text,
                ].join(" ")}
            >
                {step}
            </span>

            <div>
                <p
                    className={[
                        "text-xs font-bold",
                        style.text,
                    ].join(" ")}
                >
                    {label}
                </p>

                <h3
                    className="
                        mt-1 max-w-[900px]
                        break-keep
                        text-xl font-semibold
                        leading-8 tracking-tight
                    "
                >
                    {title}
                </h3>

                <div className="mt-5 space-y-4">
                    {children}
                </div>
            </div>
        </section>
    );
}

function SectionEyebrow({
                            children,
                        }: {
    children: ReactNode;
}) {
    return (
        <p
            className="
                text-xs font-bold
                tracking-[0.08em]
                text-muted-foreground
            "
        >
            {children}
        </p>
    );
}

function Paragraph({
                       children,
                   }: {
    children: ReactNode;
}) {
    return (
        <p
            className="
                max-w-[780px]
                break-keep
                text-sm leading-7
                text-muted-foreground
                sm:text-base sm:leading-8
            "
        >
            {children}
        </p>
    );
}

function Strong({
                    children,
                }: {
    children: ReactNode;
}) {
    return (
        <strong className="font-semibold text-foreground">
            {children}
        </strong>
    );
}

/* -------------------------------------------------------------------------- */
/* Overview Cards                                                             */

/* -------------------------------------------------------------------------- */

function CoreDecisionCard({
                              decision,
                              onClick,
                          }: {
    decision: CoreDecision;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="
                group relative
                w-full overflow-hidden
                rounded-xl
                border border-border
                bg-background
                p-5 text-left
                transition-all duration-200
                hover:-translate-y-[1px]
                hover:border-foreground/25
                hover:shadow-sm
            "
        >
            <span
                className="
                    absolute inset-y-0 left-0
                    w-[3px]
                    bg-foreground/70
                "
            />

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 gap-4">
                    <div
                        className="
                            flex size-11 shrink-0
                            items-center justify-center
                            rounded-xl
                            bg-muted
                            text-foreground
                        "
                    >
                        {decision.icon}
                    </div>

                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold tabular-nums text-foreground">
                                {decision.number}
                            </span>

                            <span className="text-xs font-medium text-muted-foreground">
                                · {decision.category}
                            </span>
                        </div>

                        <h4
                            className="
                                mt-1 max-w-[760px]
                                break-keep
                                text-base font-semibold
                                leading-7
                                sm:text-lg
                            "
                        >
                            {decision.title}
                        </h4>

                        <p
                            className="
                                mt-2 max-w-[760px]
                                break-keep
                                text-xs leading-5
                                text-muted-foreground
                                sm:text-sm sm:leading-6
                            "
                        >
                            {decision.description}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {decision.technologies.map(
                                (technology) => (
                                    <Badge
                                        key={technology}
                                        variant="outline"
                                        className="
                                            h-5
                                            border-border
                                            bg-background
                                            px-2
                                            text-[9px]
                                        "
                                    >
                                        {technology}
                                    </Badge>
                                )
                            )}
                        </div>
                    </div>
                </div>

                <div
                    className="
                        flex shrink-0
                        items-center gap-1
                        text-xs font-bold
                        text-foreground
                    "
                >
                    구현 상세

                    <ArrowRight
                        className="
                            size-4
                            transition-transform
                            group-hover:translate-x-1
                        "
                    />
                </div>
            </div>
        </button>
    );
}

function SmallDecisionCard({
                               number,
                               icon,
                               title,
                               description,
                               technologies,
                               onClick,
                           }: {
    number: string;
    icon: ReactNode;
    title: string;
    description: string;
    technologies: readonly string[];
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="
                group flex h-full flex-col
                rounded-xl
                border border-border
                bg-background
                p-5 text-left
                transition-all duration-200
                hover:-translate-y-[1px]
                hover:border-foreground/25
                hover:shadow-sm
            "
        >
            <div className="flex items-start justify-between">
                <div
                    className="
                        flex size-10
                        items-center justify-center
                        rounded-xl
                        bg-muted
                        text-foreground
                    "
                >
                    {icon}
                </div>

                <span className="text-xs font-bold text-muted-foreground">
                    {number}
                </span>
            </div>

            <h4 className="mt-4 text-base font-semibold">
                {title}
            </h4>

            <p
                className="
                    mt-2 flex-1
                    break-keep
                    text-xs leading-5
                    text-muted-foreground
                "
            >
                {description}
            </p>

            <div className="mt-4 flex flex-wrap gap-1">
                {technologies.map((technology) => (
                    <Badge
                        key={technology}
                        variant="outline"
                        className="
                            h-5 px-1.5
                            text-[9px]
                            font-normal
                        "
                    >
                        {technology}
                    </Badge>
                ))}
            </div>

            <span
                className="
                    mt-5 flex items-center gap-1
                    text-xs font-bold
                    text-foreground
                "
            >
                구현 상세

                <ArrowRight
                    className="
                        size-3.5
                        transition-transform
                        group-hover:translate-x-1
                    "
                />
            </span>
        </button>
    );
}

/* -------------------------------------------------------------------------- */
/* Semantic Components                                                        */

/* -------------------------------------------------------------------------- */

function FlowPanel({
                       label,
                       tone,
                       children,
                   }: {
    label: string;
    tone: AccentTone;
    children: ReactNode;
}) {
    const style = toneStyles[tone];

    return (
        <div
            className={[
                "mt-5 rounded-xl border p-5",
                style.bg,
                style.border,
            ].join(" ")}
        >
            <div className="mb-4 flex items-center gap-3">
                <span
                    className={[
                        "text-[10px] font-bold uppercase tracking-[0.16em]",
                        style.text,
                    ].join(" ")}
                >
                    {label}
                </span>

                <span
                    className={[
                        "h-px flex-1",
                        style.rail,
                    ].join(" ")}
                />
            </div>

            {children}
        </div>
    );
}

function Callout({
                     children,
                     tone,
                 }: {
    children: ReactNode;
    tone: AccentTone;
}) {
    const style = toneStyles[tone];

    return (
        <div
            className={[
                "rounded-xl border p-5",
                style.bg,
                style.border,
            ].join(" ")}
        >
            <p
                className="
                    max-w-[820px]
                    break-keep
                    text-sm leading-7
                    text-muted-foreground
                    sm:text-base sm:leading-8
                "
            >
                {children}
            </p>
        </div>
    );
}

function DecisionNote({
                          label,
                          title,
                          children,
                      }: {
    label: string;
    title: string;
    children: ReactNode;
}) {
    const style = toneStyles.tradeoff;

    return (
        <div
            className={[
                "mt-6 rounded-2xl border p-6",
                style.bg,
                style.border,
            ].join(" ")}
        >
            <span
                className={[
                    "inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold",
                    style.badge,
                ].join(" ")}
            >
                {label}
            </span>

            <h4
                className="
                    mt-4 max-w-[760px]
                    break-keep
                    text-lg font-bold leading-7
                "
            >
                {title}
            </h4>

            <div
                className="
                    mt-3 max-w-[800px]
                    space-y-3
                    break-keep
                    text-sm leading-7
                    text-muted-foreground
                    sm:text-base
                "
            >
                {children}
            </div>
        </div>
    );
}

function JudgementCard({
                           title,
                           value,
                           description,
                           selected = false,
                       }: {
    title: string;
    value: string;
    description: string;
    selected?: boolean;
}) {
    return (
        <div
            className={[
                "rounded-xl border p-4",
                selected
                    ? "border-[#C2D8CA] bg-[#F0F6F2] dark:border-[#3C5C49] dark:bg-[#19251E]"
                    : "border-border bg-background",
            ].join(" ")}
        >
            <p
                className={[
                    "text-xs font-semibold",
                    selected
                        ? "text-[#41765A] dark:text-[#83B497]"
                        : "text-muted-foreground",
                ].join(" ")}
            >
                {title}
            </p>

            <p className="mt-2 font-semibold">
                {value}
            </p>

            <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">
                {description}
            </p>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Alternative / Trade-off                                                    */

/* -------------------------------------------------------------------------- */

function AlternativeCard({
                             label,
                             title,
                             items,
                             selected = false,
                         }: {
    label: string;
    title: string;
    items: readonly string[];
    selected?: boolean;
}) {
    return (
        <div
            className={[
                "relative rounded-xl border p-5",
                selected
                    ? "border-[#C2D8CA] bg-[#F0F6F2] dark:border-[#3C5C49] dark:bg-[#19251E]"
                    : "border-border bg-background",
            ].join(" ")}
        >
            {selected && (
                <span
                    className="
                        absolute right-4 top-4
                        rounded-full
                        bg-[#41765A]
                        px-2 py-1
                        text-[9px] font-bold
                        text-white
                    "
                >
                    선택
                </span>
            )}

            <p
                className={[
                    "text-[10px] font-bold",
                    selected
                        ? "text-[#41765A] dark:text-[#83B497]"
                        : "text-muted-foreground",
                ].join(" ")}
            >
                {label}
            </p>

            <h4 className="mt-2 break-keep text-base font-semibold">
                {title}
            </h4>

            <ul className="mt-4 space-y-2.5">
                {items.map((item) => (
                    <li
                        key={item}
                        className="
                            flex gap-2
                            break-keep
                            text-xs leading-5
                            text-muted-foreground
                        "
                    >
                        <span
                            className={[
                                "mt-[8px] size-1 shrink-0 rounded-full",
                                selected
                                    ? "bg-[#41765A]"
                                    : "bg-muted-foreground/40",
                            ].join(" ")}
                        />

                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function TradeOffComparison({
                                benefits,
                                costs,
                            }: {
    benefits: readonly string[];
    costs: readonly string[];
}) {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            <div
                className="
                    rounded-xl
                    border border-[#C2D8CA]
                    bg-[#F0F6F2]
                    p-5
                    dark:border-[#3C5C49]
                    dark:bg-[#19251E]
                "
            >
                <p className="font-semibold text-[#41765A] dark:text-[#83B497]">
                    얻은 것
                </p>

                <ul className="mt-4 space-y-3">
                    {benefits.map((item) => (
                        <li
                            key={item}
                            className="
                                flex gap-3
                                break-keep
                                text-sm leading-6
                            "
                        >
                            <span className="font-bold text-[#41765A]">
                                +
                            </span>

                            <span className="text-muted-foreground">
                                {item}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            <div
                className="
                    rounded-xl
                    border border-[#DED0A6]
                    bg-[#FAF6EA]
                    p-5
                    dark:border-[#5F5636]
                    dark:bg-[#292419]
                "
            >
                <p className="font-semibold text-[#A48432] dark:text-[#D9BC72]">
                    감수한 것
                </p>

                <ul className="mt-4 space-y-3">
                    {costs.map((item) => (
                        <li
                            key={item}
                            className="
                                flex gap-3
                                break-keep
                                text-sm leading-6
                            "
                        >
                            <span className="font-bold text-[#A48432]">
                                −
                            </span>

                            <span className="text-muted-foreground">
                                {item}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Diagram Components                                                         */

/* -------------------------------------------------------------------------- */

function ResponsibilityCard({
                                label,
                                badge,
                                title,
                                description,
                            }: {
    label: string;
    badge: string;
    title: string;
    description: string;
}) {
    return (
        <div
            className="
                rounded-xl
                border border-border
                bg-background
                p-5
            "
        >
            <div className="flex items-center justify-between gap-3">
                <p
                    className="
                        text-[10px] font-bold
                        uppercase tracking-[0.16em]
                        text-muted-foreground
                    "
                >
                    {label}
                </p>

                <span
                    className="
                        rounded-full
                        bg-muted
                        px-2 py-1
                        text-[9px] font-semibold
                        text-muted-foreground
                    "
                >
                    {badge}
                </span>
            </div>

            <p className="mt-4 break-keep text-base font-semibold">
                {title}
            </p>

            <p
                className="
                    mt-2 max-w-[420px]
                    break-keep
                    text-sm leading-6
                    text-muted-foreground
                "
            >
                {description}
            </p>
        </div>
    );
}

function FlowDiagram({
                         items,
                     }: {
    items: readonly string[];
}) {
    return (
        <div className="w-full">
            <div
                className="hidden w-full gap-5 md:grid"
                style={{
                    gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
                }}
            >
                {items.map((item, index) => (
                    <div
                        key={`${item}-${index}`}
                        className="relative min-w-0"
                    >
                        <div
                            className="
                                flex h-full min-h-[54px]
                                items-center justify-center
                                rounded-lg
                                border border-border
                                bg-background
                                px-2 py-3
                                text-center
                                text-xs font-medium
                                leading-5
                            "
                        >
                            <span className="break-keep">
                                {item}
                            </span>
                        </div>

                        {index < items.length - 1 && (
                            <ArrowRight
                                className="
                                    absolute
                                    -right-[17px]
                                    top-1/2
                                    size-3.5
                                    -translate-y-1/2
                                    text-muted-foreground/35
                                "
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="flex flex-col md:hidden">
                {items.map((item, index) => (
                    <div
                        key={`${item}-${index}`}
                        className="flex flex-col items-center"
                    >
                        <div
                            className="
                                w-full rounded-lg
                                border border-border
                                bg-background
                                px-4 py-3
                                text-center
                                text-sm font-medium
                            "
                        >
                            {item}
                        </div>

                        {index < items.length - 1 && (
                            <ArrowRight
                                className="
                                    my-1.5
                                    size-4 rotate-90
                                    text-muted-foreground/35
                                "
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Other Components                                                           */

/* -------------------------------------------------------------------------- */

function NextDecisionCard({
                              title,
                              description,
                              action,
                              onClick,
                          }: {
    title: string;
    description: string;
    action: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="
                group w-full
                rounded-xl
                border border-border
                bg-background
                p-6 text-left
                transition-all
                hover:border-foreground/25
                hover:bg-muted/30
            "
        >
            <div
                className="
                    flex flex-col
                    justify-between gap-5
                    sm:flex-row sm:items-center
                "
            >
                <div>
                    <p className="break-keep text-base font-semibold">
                        {title}
                    </p>

                    <p
                        className="
                            mt-2 max-w-[700px]
                            break-keep
                            text-sm leading-6
                            text-muted-foreground
                        "
                    >
                        {description}
                    </p>
                </div>

                <div
                    className="
                        flex shrink-0
                        items-center gap-2
                        text-sm font-bold
                    "
                >
                    {action}

                    <ArrowRight
                        className="
                            size-4
                            transition-transform
                            group-hover:translate-x-1
                        "
                    />
                </div>
            </div>
        </button>
    );
}

function ExperimentLink({
                            title,
                            description,
                        }: {
    title: string;
    description: string;
}) {
    return (
        <div
            className="
                group flex
                items-center justify-between
                gap-5 rounded-xl
                border border-border
                px-4 py-3
                transition-colors
                hover:bg-muted/40
            "
        >
            <div>
                <p className="break-keep text-sm font-medium">
                    {title}
                </p>

                <p
                    className="
                        mt-1 break-keep
                        text-xs leading-5
                        text-muted-foreground
                    "
                >
                    {description}
                </p>
            </div>

            <span
                className="
                    shrink-0 rounded-full
                    border border-[#DED0A6]
                    bg-[#FAF6EA]
                    px-2 py-1
                    text-[10px] font-semibold
                    text-[#A48432]
                    dark:border-[#5F5636]
                    dark:bg-[#292419]
                    dark:text-[#D9BC72]
                "
            >
                실험 예정
            </span>
        </div>
    );
}

function StatusCard({
                        title,
                        description,
                        tone,
                    }: {
    title: string;
    description: string;
    tone: AccentTone;
}) {
    const style = toneStyles[tone];

    return (
        <div
            className={[
                "rounded-xl border p-4",
                style.bg,
                style.border,
            ].join(" ")}
        >
            <p
                className={[
                    "text-sm font-semibold",
                    style.text,
                ].join(" ")}
            >
                {title}
            </p>

            <p
                className="
                    mt-1 break-keep
                    text-xs leading-5
                    text-muted-foreground
                "
            >
                {description}
            </p>
        </div>
    );
}

function SnapshotCard({
                          label,
                          title,
                          items,
                      }: {
    label: string;
    title: string;
    items: readonly string[];
}) {
    return (
        <div
            className="
                rounded-xl
                border border-[#C6D0E4]
                bg-[#F1F4FA]
                p-5
                dark:border-[#3E4C69]
                dark:bg-[#1B2230]
            "
        >
            <p className="text-[10px] font-bold text-[#496AA8] dark:text-[#91A9D7]">
                {label}
            </p>

            <h4 className="mt-2 font-semibold">
                {title}
            </h4>

            <ul className="mt-4 space-y-2">
                {items.map((item) => (
                    <li
                        key={item}
                        className="
                            flex gap-2
                            text-xs leading-5
                            text-muted-foreground
                        "
                    >
                        <span className="mt-[8px] size-1 shrink-0 rounded-full bg-[#496AA8]"/>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ArchitectureBox({
                             children,
                             tone,
                         }: {
    children: ReactNode;
    tone: AccentTone;
}) {
    const style = toneStyles[tone];

    return (
        <div
            className={[
                "rounded-xl border p-6",
                style.bg,
                style.border,
            ].join(" ")}
        >
            {children}
        </div>
    );
}

function ArchitectureNode({
                              title,
                              subtitle,
                          }: {
    title: string;
    subtitle: string;
}) {
    return (
        <div
            className="
                rounded-lg
                border border-border
                bg-background
                px-4 py-3
                text-center
                shadow-sm
            "
        >
            <p className="text-sm font-semibold">
                {title}
            </p>

            <p className="mt-1 text-[10px] text-muted-foreground">
                {subtitle}
            </p>
        </div>
    );
}

function MetricCard({
                        title,
                        items,
                    }: {
    title: string;
    items: readonly string[];
}) {
    return (
        <div
            className="
                rounded-xl
                border border-border
                bg-background
                p-5
            "
        >
            <p className="font-semibold">
                {title}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
                {items.map((item) => (
                    <Badge
                        key={item}
                        variant="outline"
                    >
                        {item}
                    </Badge>
                ))}
            </div>
        </div>
    );
}