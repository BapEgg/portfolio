"use client";

import Image from "next/image";
import Link from "next/link";
import type {ComponentType, ReactNode,} from "react";

import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion";

import {
    Activity,
    ArrowRight,
    ArrowUpRight,
    ChevronDown,
    CircleDot,
    Database,
    ExternalLink,
    FlaskConical,
    Github,
    KeyRound,
    Radio,
    TriangleAlert,
} from "lucide-react";

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
/* Config                                                                     */
/* -------------------------------------------------------------------------- */

const PROJECT_DEPLOY_URL: string | null = null;

/*
 * 배포 후:
 *
 * const PROJECT_DEPLOY_URL =
 *     "https://planmate.example.com";
 */

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type StatusType =
    | "implemented"
    | "partial"
    | "planned";

type StarType =
    | "situation"
    | "task"
    | "action"
    | "result";

interface CoreFeature {
    number: string;
    title: string;
    summary: string;
    technologies: readonly string[];
    status: StatusType;

    situation: ReactNode;
    task: ReactNode;
    action: ReactNode;
    result: ReactNode;
}

interface TroubleshootingItem {
    number: string;
    title: string;
    summary: string;
    technologies: readonly string[];
    status: StatusType;
    content: ReactNode;
}

interface FailureExperiment {
    number: string;
    title: string;
    summary: string;
    technologies: readonly string[];

    simulation: ReactNode;
    problem: ReactNode;
    action: ReactNode;
    criteria: ReactNode;
}

/* -------------------------------------------------------------------------- */
/* Technology                                                                 */
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
        name: "React",
        icon: ReactLight,
    },
    {
        name: "TypeScript",
        icon: Typescript,
    },
] as const;

/* -------------------------------------------------------------------------- */
/* Core Features                                                              */
/* -------------------------------------------------------------------------- */

const coreFeatures: readonly CoreFeature[] = [
    {
        number: "01",

        title:
            "긴 일정 생성 작업을 HTTP 요청에서 분리",

        summary:
            "generationId를 먼저 반환하고 외부 API 호출과 후보 수집은 Worker가 처리하도록 변경했습니다.",

        technologies: [
            "RabbitMQ",
            "Worker",
            "Generation Status",
        ],

        status: "implemented",

        situation: (
            <>
                <Paragraph>
                    일정 생성에는 Google Places를 통한 장소 후보 수집처럼
                    응답 시간을 애플리케이션이 직접 통제하기 어려운
                    외부 API 호출이 포함됩니다.
                </Paragraph>

                <Paragraph>
                    이 작업을 하나의 HTTP 요청 안에서 모두 처리하면
                    외부 시스템의 지연과 장애가
                    사용자 요청의 응답 시간에 그대로 영향을 줍니다.
                </Paragraph>

                <SimpleFlow
                    items={[
                        "HTTP 요청",
                        "후보 수집",
                        "Google Places",
                        "후보 저장",
                        "HTTP 응답",
                    ]}
                    danger
                />
            </>
        ),

        task: (
            <BulletList
                items={[
                    "HTTP 요청과 오래 걸리는 작업의 생명주기 분리",
                    "요청 종료 이후에도 후보 수집 작업 지속",
                    "현재 작업 진행 상태를 Generation 단위로 추적",
                    "Retry · Redelivery를 적용할 수 있는 실행 구조 확보",
                ]}
            />
        ),

        action: (
            <>
                <Paragraph>
                    HTTP 요청은 Generation을 생성하고
                    <Strong>
                        {" "}generationId를 반환하는 것까지
                    </Strong>
                    담당하도록 책임을 줄였습니다.
                </Paragraph>

                <Paragraph>
                    실제 후보 수집은 HTTP 요청에서 분리하고
                    RabbitMQ 메시지를 소비하는 Worker가
                    실행하도록 변경했습니다.
                </Paragraph>

                <SimpleFlow
                    items={[
                        "HTTP Request",
                        "Generation",
                        "generationId 반환",
                        "RabbitMQ",
                        "Worker",
                        "후보 수집",
                    ]}
                />
            </>
        ),

        result: (
            <>
                <div className="flex flex-wrap gap-2">
                    <ResultMetric>
                        HTTP 책임
                        <strong className="ml-1">
                            작업 완료 → 작업 접수
                        </strong>
                    </ResultMetric>

                    <ResultMetric>
                        외부 API
                        <strong className="ml-1">
                            HTTP 생명주기와 분리
                        </strong>
                    </ResultMetric>

                    <ResultMetric>
                        상태 추적
                        <strong className="ml-1">
                            Generation 기반
                        </strong>
                    </ResultMetric>
                </div>

                <LearningNote>
                    비동기 전환의 결과를 단순히
                    전체 처리 속도 개선으로 표현하지 않고,
                    사용자 HTTP 요청과 실제 작업 실행의
                    책임을 분리한 것으로 정리했습니다.
                    이후 동일 조건에서 접수 API의
                    p50 · p95도 측정할 예정입니다.
                </LearningNote>
            </>
        ),
    },

    {
        number: "02",

        title:
            "DB 저장과 메시지 전달 사이의 작업 유실 방지",

        summary:
            "Transactional Outbox와 Debezium CDC를 적용해 DB와 RabbitMQ 사이의 Dual Write 경계를 분리했습니다.",

        technologies: [
            "Outbox",
            "Debezium",
            "WAL",
            "RabbitMQ",
        ],

        status: "implemented",

        situation: (
            <>
                <Paragraph>
                    Generation을 PostgreSQL에 저장한 뒤
                    RabbitMQ로 메시지를 직접 발행하면
                    두 작업은 서로 다른 시스템에서 실행됩니다.
                </Paragraph>

                <DualWriteDiagram/>

                <Paragraph>
                    DB Commit은 성공했지만
                    RabbitMQ Publish가 실패하면
                    DB에는 작업이 존재하는데
                    Worker는 작업의 존재를 모르는 상태가 만들어집니다.
                </Paragraph>
            </>
        ),

        task: (
            <BulletList
                items={[
                    "Generation 저장과 작업 전달 의도를 함께 보존",
                    "DB Transaction과 Message Publish 실패 경계 분리",
                    "Application과 RabbitMQ 직접 결합 제거",
                    "CDC 중단 이후에도 이어서 처리 가능한 구조 확보",
                ]}
            />
        ),

        action: (
            <>
                <Paragraph>
                    Generation,
                    InputSnapshot,
                    Outbox Event를
                    <Strong>
                        {" "}하나의 PostgreSQL Transaction
                    </Strong>
                    에서 함께 저장했습니다.
                </Paragraph>

                <SimpleFlow
                    items={[
                        "Generation",
                        "Outbox",
                        "COMMIT",
                        "WAL",
                        "Debezium",
                        "RabbitMQ",
                    ]}
                />

                <Paragraph>
                    Debezium이 PostgreSQL WAL의 Outbox 변경을 읽어
                    RabbitMQ로 전달하도록 구성했습니다.
                </Paragraph>
            </>
        ),

        result: (
            <>
                <div className="flex flex-wrap gap-2">
                    <ResultMetric>
                        DB
                        <strong className="ml-1">
                            Business + Outbox 원자적 저장
                        </strong>
                    </ResultMetric>

                    <ResultMetric>
                        MQ
                        <strong className="ml-1">
                            Application 직접 발행 제거
                        </strong>
                    </ResultMetric>

                    <ResultMetric>
                        장애 경계
                        <strong className="ml-1">
                            CDC 복구 문제로 분리
                        </strong>
                    </ResultMetric>
                </div>

                <LearningNote>
                    Outbox를 적용한다고 장애 자체가 없어지는 것은 아니었습니다.
                    대신 DB와 MQ 사이의 Dual Write 문제를
                    재시작 가능한 CDC 전달 문제로 변경했습니다.
                </LearningNote>
            </>
        ),
    },

    {
        number: "03",

        title:
            "최소 한 번 전달에서도 다시 실행 가능한 Worker 설계",

        summary:
            "ACK 실패와 Redelivery를 전제로 중복 전달 자체보다 재실행에 안전한 Consumer를 설계했습니다.",

        technologies: [
            "ACK",
            "Redelivery",
            "Idempotency",
            "DLQ",
        ],

        status: "partial",

        situation: (
            <>
                <Paragraph>
                    RabbitMQ Worker가 후보 데이터 저장까지 완료하더라도
                    ACK를 전송하기 전에 종료되면
                    RabbitMQ는 처리 완료 사실을 알 수 없습니다.
                </Paragraph>

                <SimpleFlow
                    items={[
                        "Message",
                        "Worker",
                        "DB Commit",
                        "Worker 종료",
                        "ACK 실패",
                        "Redelivery",
                    ]}
                    danger
                />

                <Paragraph>
                    따라서 한 번 처리한 메시지가
                    다시 Consumer에게 전달될 수 있습니다.
                </Paragraph>
            </>
        ),

        task: (
            <BulletList
                items={[
                    "같은 메시지가 다시 전달돼도 데이터 중복 방지",
                    "작업 중 Worker가 종료돼도 다시 실행 가능",
                    "허용되지 않은 Generation 상태 전이 차단",
                    "반복 실패 Message를 정상 Queue에서 격리",
                ]}
            />
        ),

        action: (
            <>
                <BulletList
                    items={[
                        "generationId 기준 기존 Generation 상태 확인",
                        "허용된 상태 전이만 수행하는 State Guard",
                        "DB Constraint를 통한 중복 데이터 최종 방어",
                        "Retry 및 DLQ 구조 적용",
                        "At-least-once 전달을 전제로 Consumer 설계",
                    ]}
                />

                <SimpleFlow
                    items={[
                        "Redelivery",
                        "상태 확인",
                        "이미 처리?",
                        "멱등 처리",
                        "정상 종료",
                    ]}
                />
            </>
        ),

        result: (
            <>
                <div className="flex flex-wrap gap-2">
                    <ResultMetric>
                        전달 모델
                        <strong className="ml-1">
                            At-least-once 전제
                        </strong>
                    </ResultMetric>

                    <ResultMetric>
                        Consumer
                        <strong className="ml-1">
                            재실행 가능 구조
                        </strong>
                    </ResultMetric>

                    <ResultMetric>
                        반복 실패
                        <strong className="ml-1">
                            DLQ 격리
                        </strong>
                    </ResultMetric>
                </div>

                <PendingNotice>
                    현재 상태 Guard와 DLQ 인프라는 구성했지만
                    ACK 이전 Worker 종료를 실제로 주입하는
                    Redelivery 테스트는 진행 전입니다.
                    실험 후 중복 Candidate 수와 정상 완료율을
                    실제 수치로 추가합니다.
                </PendingNotice>
            </>
        ),
    },

    {
        number: "04",

        title:
            "형식은 맞지만 실행할 수 없는 AI 일정 차단",

        summary:
            "AI 응답을 JSON 형식만 검증하지 않고 실제 장소 후보와 시간 조건까지 서버에서 다시 검증합니다.",

        technologies: [
            "Validation",
            "Candidate",
            "Overlap",
            "Daily Window",
        ],

        status: "implemented",

        situation: (
            <>
                <Paragraph>
                    AI가 JSON Schema와 DTO 형식을 정상적으로 만족해도
                    실제 여행 일정으로는 사용할 수 없는 결과가
                    만들어질 수 있습니다.
                </Paragraph>

                <ScheduleExample/>

                <Paragraph>
                    각 일정의 시간 값과 JSON 구조는 모두 정상입니다.
                    하지만 같은 시간대가 겹치기 때문에
                    실제 여행 일정으로 사용할 수 없습니다.
                </Paragraph>
            </>
        ),

        task: (
            <BulletList
                items={[
                    "서버가 제공하지 않은 장소 사용 차단",
                    "같은 날짜의 일정 시간 중복 검출",
                    "하루 경계를 넘어가는 일정 차단",
                    "사용자가 지정한 활동 가능 시간 검증",
                    "필수 방문 장소 누락 검증",
                ]}
            />
        ),

        action: (
            <>
                <Paragraph>
                    AI 응답 검증을
                    DTO 구조 검증과
                    실제 도메인 의미 검증으로 분리했습니다.
                </Paragraph>

                <SimpleFlow
                    items={[
                        "AI Draft",
                        "Structure",
                        "Candidate",
                        "Time",
                        "ValidationReport",
                    ]}
                />

                <CodePanel>
                    {`시간 구간

[startMinute, endMinute)

Overlap

A.start < B.end
AND
B.start < A.end`}
                </CodePanel>
            </>
        ),

        result: (
            <>
                <div className="flex flex-wrap gap-2">
                    <ResultMetric>
                        Semantic Error
                        <strong className="ml-1">
                            422
                        </strong>
                    </ResultMetric>

                    <ResultMetric>
                        DB Write
                        <strong className="ml-1">
                            없음
                        </strong>
                    </ResultMetric>

                    <ResultMetric>
                        Generation
                        <strong className="ml-1">
                            READY 유지
                        </strong>
                    </ResultMetric>
                </div>

                <LearningNote>
                    AI 응답을 파싱 가능한 JSON인지가 아니라
                    실제 도메인 데이터로 저장 가능한지
                    서버가 최종 판단하도록 책임을 분리했습니다.
                </LearningNote>
            </>
        ),
    },
];

/* -------------------------------------------------------------------------- */
/* Troubleshooting                                                            */
/* -------------------------------------------------------------------------- */

const troubleshootingItems: readonly TroubleshootingItem[] = [
    {
        number: "01",

        title:
            "AI가 시간상 실행 불가능한 일정을 반환",

        summary:
            "JSON 형식 검증만으로 발견되지 않는 일정 시간 충돌을 서버에서 차단했습니다.",

        technologies: [
            "Validation",
            "Overlap",
            "HTTP 422",
        ],

        status: "implemented",

        content: (
            <>
                <TroubleSection
                    type="situation"
                    english="BEFORE"
                    title="문제"
                >
                    <ScheduleExample/>

                    <Paragraph>
                        JSON 구조와 각각의 시간 값은 정상이라
                        DTO 검증에서는 오류로 판단되지 않았습니다.
                    </Paragraph>
                </TroubleSection>

                <TroubleSection
                    type="action"
                    english="ACTION"
                    title="해결"
                >
                    <BulletList
                        items={[
                            "HH:mm 값을 minute-of-day로 변환",
                            "같은 날짜의 모든 일정 Pair 비교",
                            "[start, end) Interval 적용",
                            "Overlap 발견 시 ValidationIssue 생성",
                            "Semantic Error 존재 시 HTTP 422 반환",
                        ]}
                    />
                </TroubleSection>

                <TroubleSection
                    type="result"
                    english="RESULT"
                    title="결과"
                >
                    <div className="flex flex-wrap gap-2">
                        <ResultMetric>
                            잘못된 일정
                            <strong className="ml-1">
                                저장 차단
                            </strong>
                        </ResultMetric>

                        <ResultMetric>
                            Generation
                            <strong className="ml-1">
                                READY 유지
                            </strong>
                        </ResultMetric>

                        <ResultMetric>
                            결과 수정
                            <strong className="ml-1">
                                재제출 가능
                            </strong>
                        </ResultMetric>
                    </div>

                    <LearningNote>
                        AI 검증 실패를 Generation 전체 실패로 처리하지 않고
                        AI 결과만 수정해 다시 제출할 수 있도록
                        실패 경계를 분리했습니다.
                    </LearningNote>
                </TroubleSection>
            </>
        ),
    },

    {
        number: "02",

        title:
            "네트워크 Retry로 동일 AI 결과가 여러 번 제출",

        summary:
            "동일 결과 재제출은 안전하게 허용하고 서로 다른 결과는 충돌로 처리했습니다.",

        technologies: [
            "Idempotency",
            "Pessimistic Lock",
            "Unique",
        ],

        status: "implemented",

        content: (
            <>
                <TroubleSection
                    type="situation"
                    english="PROBLEM"
                    title="문제"
                >
                    <Paragraph>
                        서버가 일정 저장을 완료했지만
                        클라이언트가 네트워크 문제로 응답을 받지 못하면
                        같은 요청을 다시 제출할 수 있습니다.
                    </Paragraph>

                    <SimpleFlow
                        items={[
                            "Submit",
                            "DB 저장",
                            "응답 유실",
                            "Client Retry",
                            "중복 저장?",
                        ]}
                        danger
                    />
                </TroubleSection>

                <TroubleSection
                    type="action"
                    english="ACTION"
                    title="해결"
                >
                    <BulletList
                        items={[
                            "Generation Pessimistic Lock",
                            "Generation당 Itinerary UNIQUE Constraint",
                            "기존 결과와 canonical 비교",
                            "동일 Replay는 추가 Write 없이 반환",
                            "서로 다른 결과는 409 Conflict",
                        ]}
                    />
                </TroubleSection>

                <TroubleSection
                    type="result"
                    english="RESULT"
                    title="결과"
                >
                    <div
                        className="
                            grid max-w-[620px]
                            gap-3
                            sm:grid-cols-2
                        "
                    >
                        <OutcomeBox
                            title="동일 결과 재제출"
                            value="200 · 추가 DB Write 없음"
                            success
                        />

                        <OutcomeBox
                            title="다른 결과 재제출"
                            value="409 Conflict"
                        />
                    </div>
                </TroubleSection>
            </>
        ),
    },

    {
        number: "03",

        title:
            "반복 실패 메시지가 정상 Queue를 계속 점유",

        summary:
            "재시도로 복구 가능한 실패와 격리해야 할 실패를 구분했습니다.",

        technologies: [
            "Retry",
            "DLX",
            "DLQ",
        ],

        status: "partial",

        content: (
            <>
                <TroubleSection
                    type="situation"
                    english="PROBLEM"
                    title="문제"
                >
                    <Paragraph>
                        처리할 수 없는 메시지를 제한 없이 다시 처리하면
                        Worker 자원과 정상 메시지 처리 기회를
                        지속적으로 소비하게 됩니다.
                    </Paragraph>

                    <SimpleFlow
                        items={[
                            "Message",
                            "실패",
                            "Retry",
                            "실패",
                            "Retry",
                            "...",
                        ]}
                        danger
                    />
                </TroubleSection>

                <TroubleSection
                    type="action"
                    english="ACTION"
                    title="대응"
                >
                    <SimpleFlow
                        items={[
                            "Worker 실패",
                            "Retry",
                            "Retry 한도",
                            "DLX",
                            "DLQ",
                        ]}
                    />

                    <BulletList
                        items={[
                            "Retry 가능한 실패와 최종 실패 분리",
                            "Dead Letter Exchange / Queue 구성",
                            "실패 메시지를 정상 Queue에서 격리",
                        ]}
                    />
                </TroubleSection>

                <TroubleSection
                    type="result"
                    english="RESULT"
                    title="현재 상태"
                >
                    <PendingNotice>
                        DLX / DLQ 인프라 구성은 완료했습니다.
                        Retry 횟수와 DLQ 운영·재처리 기준은
                        장애 주입 테스트 결과를 기반으로 최종화할 예정입니다.
                    </PendingNotice>
                </TroubleSection>
            </>
        ),
    },

    {
        number: "04",

        title:
            "ACK 이전 Worker 장애에서 동일 Message 재전달",

        summary:
            "At-least-once 환경에서 같은 작업이 다시 실행돼도 데이터 정합성이 유지되는지 검증합니다.",

        technologies: [
            "ACK",
            "Redelivery",
            "Idempotency",
        ],

        status: "partial",

        content: (
            <>
                <TroubleSection
                    type="situation"
                    english="PROBLEM"
                    title="문제"
                >
                    <Paragraph>
                        Worker가 DB 처리를 완료한 직후
                        ACK를 보내기 전에 종료되면
                        RabbitMQ는 Message를 다시 전달할 수 있습니다.
                    </Paragraph>

                    <SimpleFlow
                        items={[
                            "Message",
                            "Worker",
                            "DB Commit",
                            "Worker 종료",
                            "ACK 실패",
                            "Redelivery",
                        ]}
                        danger
                    />
                </TroubleSection>

                <TroubleSection
                    type="action"
                    english="ACTION"
                    title="대응"
                >
                    <BulletList
                        items={[
                            "Generation 상태 기반 처리 판단",
                            "State Guard 적용",
                            "DB Constraint로 중복 저장 방어",
                            "At-least-once 환경을 전제로 Consumer 설계",
                        ]}
                    />
                </TroubleSection>

                <TroubleSection
                    type="result"
                    english="RESULT"
                    title="검증 예정"
                >
                    <PendingNotice>
                        실제 ACK 이전 Worker 강제 종료 실험 후
                        Redelivery 횟수,
                        중복 Candidate 수,
                        최종 READY 전환 여부를 기록합니다.
                    </PendingNotice>
                </TroubleSection>
            </>
        ),
    },
];

/* -------------------------------------------------------------------------- */
/* Failure Experiments                                                        */
/* -------------------------------------------------------------------------- */

const failureExperiments: readonly FailureExperiment[] = [
    {
        number: "01",

        title:
            "Debezium 중단 후 재시작",

        summary:
            "CDC 중단 동안 생성된 Outbox Event가 재기동 후 누락 없이 전달되는지 확인합니다.",

        technologies: [
            "Debezium",
            "WAL",
            "Offset",
        ],

        simulation: (
            <BulletList
                items={[
                    "정상 상태에서 Generation + Outbox 생성",
                    "Outbox Commit 이후 Debezium Container 종료",
                    "중단 상태에서 Generation 추가 생성",
                    "Debezium 재기동",
                ]}
            />
        ),

        problem: (
            <>
                <Paragraph>
                    Debezium이 중단된 동안
                    RabbitMQ에는 Event가 전달되지 않습니다.
                </Paragraph>

                <Paragraph>
                    재기동 시 중단 기간의 Event가
                    유실되지 않고 이어서 처리되는지 확인해야 합니다.
                </Paragraph>
            </>
        ),

        action: (
            <BulletList
                items={[
                    "Outbox Event DB 영속화",
                    "PostgreSQL WAL 기반 CDC",
                    "Debezium Offset 기반 처리 위치 관리",
                    "Application Transaction과 CDC 장애 분리",
                ]}
            />
        ),

        criteria: (
            <MetricList
                items={[
                    "중단 중 Outbox 수",
                    "재기동 후 전달 수",
                    "Event 유실 건수",
                    "READY 전환 완료 수",
                    "복구 시간",
                ]}
            />
        ),
    },

    {
        number: "02",

        title:
            "ACK 이전 Worker 강제 종료",

        summary:
            "Redelivery가 발생해도 같은 Generation의 후보가 중복 저장되지 않는지 확인합니다.",

        technologies: [
            "ACK",
            "Redelivery",
            "Idempotency",
        ],

        simulation: (
            <BulletList
                items={[
                    "Worker Message Consume",
                    "후보 데이터 DB 반영",
                    "ACK 전송 직전 Worker 종료",
                    "Worker 재기동",
                ]}
            />
        ),

        problem: (
            <Paragraph>
                DB 반영은 완료됐지만
                RabbitMQ가 ACK를 받지 못해
                동일 Message를 다시 전달할 수 있습니다.
            </Paragraph>
        ),

        action: (
            <BulletList
                items={[
                    "Generation State Guard",
                    "generationId 기준 처리 상태 확인",
                    "DB Constraint",
                    "멱등 Consumer",
                ]}
            />
        ),

        criteria: (
            <MetricList
                items={[
                    "Redelivery 횟수",
                    "중복 Candidate 수",
                    "READY 완료 수",
                    "Retry 횟수",
                    "복구 실패 수",
                ]}
            />
        ),
    },

    {
        number: "03",

        title:
            "Debezium Offset 유실",

        summary:
            "이미 처리한 Outbox Event가 다시 전달되는 상황에서도 데이터 정합성이 유지되는지 확인합니다.",

        technologies: [
            "Offset",
            "Replay",
            "Idempotency",
        ],

        simulation: (
            <BulletList
                items={[
                    "Outbox Event 정상 처리",
                    "Debezium Offset 상태 초기화",
                    "Connector 재기동",
                    "과거 Event 재전달 확인",
                ]}
            />
        ),

        problem: (
            <Paragraph>
                Offset 정보가 유실되면
                이미 처리한 Event를 다시 읽을 수 있으므로
                Downstream Consumer가 재실행에 안전해야 합니다.
            </Paragraph>
        ),

        action: (
            <BulletList
                items={[
                    "Exactly Once를 전제로 하지 않음",
                    "Generation 상태 확인",
                    "DB Constraint 최종 방어",
                    "동일 작업 재실행 허용",
                ]}
            />
        ),

        criteria: (
            <MetricList
                items={[
                    "재전달 Event 수",
                    "중복 Candidate 수",
                    "중복 Itinerary 수",
                    "상태 이상 건수",
                ]}
            />
        ),
    },

    {
        number: "04",

        title:
            "반복 실패 Message의 Retry → DLQ",

        summary:
            "복구 불가능한 Message가 무한 Retry되지 않고 DLQ로 격리되는지 확인합니다.",

        technologies: [
            "Retry",
            "DLX",
            "DLQ",
        ],

        simulation: (
            <BulletList
                items={[
                    "Worker 로직에 강제 Exception 주입",
                    "동일 Message 반복 실패",
                    "설정 Retry 횟수 도달",
                    "DLQ 전환 확인",
                ]}
            />
        ),

        problem: (
            <Paragraph>
                영구 실패 Message가 정상 Queue에서 반복 처리되면
                정상 Message 처리와 Worker 자원을 함께 방해합니다.
            </Paragraph>
        ),

        action: (
            <BulletList
                items={[
                    "제한된 횟수의 Retry",
                    "DLX Routing",
                    "DLQ 격리",
                    "운영자가 실패 Message 별도 확인",
                ]}
            />
        ),

        criteria: (
            <MetricList
                items={[
                    "Retry 횟수",
                    "DLQ Message 수",
                    "무한 Retry 여부",
                    "정상 Queue 영향",
                ]}
            />
        ),
    },

    {
        number: "05",

        title:
            "Worker 장기 중단과 Stale Generation",

        summary:
            "COLLECTING_CANDIDATES 상태에 오래 머문 작업을 운영 관점에서 탐지할 수 있는지 확인합니다.",

        technologies: [
            "Stale",
            "Metric",
            "Recovery",
        ],

        simulation: (
            <BulletList
                items={[
                    "RabbitMQ Message 유입",
                    "Worker 장시간 종료",
                    "Generation 중간 상태 유지",
                    "Worker 재기동",
                ]}
            />
        ),

        problem: (
            <Paragraph>
                비동기 작업이 중간 상태에서 멈추면
                사용자는 정상 처리 중인지
                장애로 정지했는지 판단하기 어렵습니다.
            </Paragraph>
        ),

        action: (
            <BulletList
                items={[
                    "Generation 상태별 시작 시각 기록",
                    "Stale Generation Metric",
                    "운영 임계시간 설정",
                    "재처리 또는 FAILED 정책 검토",
                ]}
            />
        ),

        criteria: (
            <MetricList
                items={[
                    "Stale 탐지 시간",
                    "Queue Depth",
                    "재기동 후 완료 수",
                    "복구 시간",
                ]}
            />
        ),
    },
];

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function PlanMatePage() {
    return (
        <main
            className="
                relative left-1/2
                w-[min(1120px,calc(100vw-32px))]
                -translate-x-1/2
                pb-28 pt-10
                sm:pt-14
            "
        >
            <ProjectHero/>

            <ProjectNavigation/>

            <div className="space-y-28">
                <CoreSection/>

                <TroubleshootingSection/>

                <FailureInjectionSection/>

                <AdditionalDesignSection/>

                <RetrospectiveSection/>
            </div>
        </main>
    );
}

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */

/* -------------------------------------------------------------------------- */

function ProjectHero() {
    return (
        <section>
            <div className="text-center">
                {/* Project Badge */}
                <span
                    className="
                        inline-flex h-10
                        items-center
                        rounded-full
                        border border-[#D7E1FF]
                        bg-white
                        px-5
                        text-sm font-medium
                        text-[#315FEA]
                        shadow-sm

                        dark:border-blue-900
                        dark:bg-background
                        dark:text-blue-300
                    "
                >
                    Project
                </span>

                {/* Project Title */}
                <h1
                    className="
                        mt-7
                        text-5xl font-bold
                        tracking-[-0.055em]
                        sm:text-6xl
                        lg:text-7xl
                    "
                >
                    PlanMate
                </h1>

                {/* Technical Focus */}
                <div className="mx-auto mt-7 max-w-[900px]">
                    <p
                        className="
                            text-[10px] font-bold
                            uppercase
                            tracking-[0.18em]
                            text-muted-foreground
                        "
                    >
                        Technical Focus
                    </p>

                    <div
                        className="
                            mt-4
                            flex flex-col
                            items-center
                            justify-center
                            gap-2

                            sm:flex-row
                            sm:flex-wrap
                            sm:gap-3
                        "
                    >
                        {/* Async */}
                        <span
                            className="
                                text-base font-bold
                                text-[#315FEA]

                                sm:text-lg

                                dark:text-blue-300
                            "
                        >
                            비동기 파이프라인 설계
                        </span>

                        <FocusDivider/>

                        {/* Reliability */}
                        <span
                            className="
                                text-base font-bold
                                text-[#315FEA]

                                sm:text-lg

                                dark:text-blue-300
                            "
                        >
                            메시지 정합성 · 멱등성
                        </span>

                        <FocusDivider/>

                        {/* Failure */}
                        <span
                            className="
                                text-base font-bold
                                text-[#315FEA]

                                sm:text-lg

                                dark:text-blue-300
                            "
                        >
                            장애 복구 검증
                        </span>
                    </div>

                    {/* Technical Summary */}
                    <p
                        className="
                            mx-auto mt-4
                            max-w-[800px]
                            break-keep
                            text-sm leading-7
                            text-muted-foreground
                        "
                    >
                        HTTP–Worker 분리부터 Outbox·CDC,
                        At-least-once와 멱등성,
                        장애 주입을 통한 복구 검증까지
                        메시징 기반 비동기 처리의 실패 지점을 다뤘습니다.
                    </p>
                </div>

                {/* Service Description */}
                <p
                    className="
                        mx-auto mt-7
                        max-w-[800px]
                        break-keep
                        border-t border-border/70
                        pt-6
                        text-sm leading-8
                        text-muted-foreground
                        sm:text-base
                    "
                >
                    실제 장소 후보를 기반으로 검증 가능한 AI 여행 일정을
                    생성하는 서비스입니다. 사용자 조건에 따라 장소 후보를
                    수집하고 AI 생성 결과를 서버에서 검증해 일정으로 저장합니다.
                </p>
            </div>

            {/* Project Preview + Summary */}
            <div
                className="
                    mt-12 grid gap-6
                    lg:grid-cols-[1.08fr_0.92fr]
                    lg:items-stretch
                "
            >
                <ProjectPreview/>

                <ProjectSummary/>
            </div>
        </section>
    );
}

function FocusDivider() {
    return (
        <>
            {/* Desktop */}
            <span
                className="
                    hidden
                    text-lg
                    font-light
                    text-muted-foreground/30
                    sm:inline
                "
            >
                /
            </span>

            {/* Mobile */}
            <span
                className="
                    block
                    h-1 w-1
                    rounded-full
                    bg-muted-foreground/30
                    sm:hidden
                "
            />
        </>
    );
}

function ProjectPreview() {
    const preview = (
        <div
            className="
                group relative
                h-full
                overflow-hidden
                rounded-[28px]
                border border-border
                bg-[#F7F8FA]
                p-4
                shadow-[0_18px_60px_rgba(15,23,42,0.08)]
                dark:bg-muted/20
            "
        >
            <div
                className="
                    relative
                    aspect-[16/11]
                    h-full
                    min-h-[400px]
                    overflow-hidden
                    rounded-[20px]
                    border border-border
                    bg-background
                "
            >
                <Image
                    src="/planmate.png"
                    alt="PlanMate 서비스 화면"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="
                        object-cover object-top
                        transition-transform
                        duration-500
                        group-hover:scale-[1.012]
                    "
                />

                <div
                    className="
                        absolute inset-x-0 bottom-0
                        bg-gradient-to-t
                        from-black/65
                        via-black/20
                        to-transparent
                        px-5 pb-5 pt-24
                    "
                >
                    <div
                        className="
                            flex items-end
                            justify-between gap-4
                        "
                    >
                        <div>
                            <p className="text-sm font-semibold text-white">
                                PlanMate
                            </p>

                            <p className="mt-1 text-xs text-white/70">
                                AI 기반 여행 일정 생성 서비스
                            </p>
                        </div>

                        <span
                            className="
                                inline-flex items-center
                                gap-1.5
                                rounded-full
                                bg-white/90
                                px-3 py-1.5
                                text-[11px] font-semibold
                                text-black
                                backdrop-blur
                            "
                        >
                            {PROJECT_DEPLOY_URL
                                ? "서비스 보기"
                                : "배포 후 연결 예정"}

                            <ArrowUpRight className="size-3"/>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

    if (!PROJECT_DEPLOY_URL) {
        return preview;
    }

    return (
        <Link
            href={PROJECT_DEPLOY_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="PlanMate 서비스 열기"
        >
            {preview}
        </Link>
    );
}

function ProjectSummary() {
    return (
        <div
            className="
                flex h-full flex-col
                rounded-[28px]
                border border-border
                bg-background
                p-6
                shadow-[0_18px_60px_rgba(15,23,42,0.08)]
                sm:p-7
            "
        >
            <div
                className="
                    flex flex-wrap
                    gap-x-4 gap-y-2
                    border-b border-border
                    pb-5
                    text-sm
                "
            >
                <div>
                    <span className="font-semibold text-[#41805B]">
                        기간
                    </span>

                    <span className="ml-2 font-semibold">
                        2026 ~ 진행 중
                    </span>
                </div>

                <span className="hidden text-muted-foreground/40 sm:block">
                    |
                </span>

                <div>
                    <span className="font-semibold text-[#41805B]">
                        인원
                    </span>

                    <span className="ml-2 font-semibold">
                        1명 (개인)
                    </span>
                </div>
            </div>

            <div className="mt-6">
                <p className="text-sm font-bold">
                    핵심 구현
                </p>

                <div className="mt-4 space-y-2.5">
                    <HeroCoreItem
                        number="01"
                        title="HTTP와 일정 생성 작업 분리"
                        result="→ generationId 우선 반환 · Worker 실행"
                    />

                    <HeroCoreItem
                        number="02"
                        title="DB ↔ Message 정합성"
                        result="→ Outbox + Debezium CDC"
                    />

                    <HeroCoreItem
                        number="03"
                        title="재전달 가능한 Worker"
                        result="→ ACK · 멱등성 · Retry · DLQ"
                    />

                    <HeroCoreItem
                        number="04"
                        title="AI 일정 의미 검증"
                        result="→ Candidate · 시간 중복 · 활동시간 검증"
                    />
                </div>
            </div>

            <div className="mt-6">
                <p className="text-sm font-bold">
                    사용 기술
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                    {technologies.map(
                        (technology) => (
                            <TechBadge
                                key={technology.name}
                                name={technology.name}
                                icon={technology.icon}
                            />
                        )
                    )}
                </div>
            </div>

            <div
                className="
                    mt-auto flex flex-wrap gap-2
                    pt-7
                "
            >
                <ExternalButton
                    href="https://github.com/f-lab-edu/plan-mate"
                    icon={<Github className="size-4"/>}
                >
                    프로젝트 링크
                </ExternalButton>

                <ExternalButton
                    href="https://velog.io/@bapegg/posts"
                    icon={<ExternalLink className="size-4"/>}
                >
                    개발 기록
                </ExternalButton>
            </div>
        </div>
    );
}

function HeroCoreItem({
                          number,
                          title,
                          result,
                      }: {
    number: string;
    title: string;
    result: string;
}) {
    return (
        <div
            className="
                grid gap-3
                rounded-xl
                border border-border
                bg-muted/20
                px-4 py-3.5
                sm:grid-cols-[32px_1fr]
            "
        >
            <span
                className="
                    pt-0.5
                    text-sm font-bold
                    text-[#315FEA]
                "
            >
                {number}
            </span>

            <div>
                <p className="text-sm font-medium">
                    {title}
                </p>

                <p
                    className="
                        mt-1
                        text-xs font-semibold
                        text-[#D5574F]
                        dark:text-[#E4939A]
                    "
                >
                    {result}
                </p>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Navigation                                                                 */

/* -------------------------------------------------------------------------- */

function ProjectNavigation() {
    return (
        <div
            className="
                sticky top-4 z-30
                mx-auto my-20
                flex w-fit
                max-w-full
                overflow-x-auto
                rounded-2xl
                border border-border
                bg-background/90
                p-1.5
                shadow-lg
                backdrop-blur
            "
        >
            <NavigationLink href="#core">
                핵심 사항
            </NavigationLink>

            <NavigationLink href="#troubleshooting">
                트러블슈팅
            </NavigationLink>

            <NavigationLink href="#failure-test">
                장애 주입 테스트
            </NavigationLink>
        </div>
    );
}

function NavigationLink({
                            href,
                            children,
                        }: {
    href: string;
    children: ReactNode;
}) {
    return (
        <a
            href={href}
            className="
                shrink-0
                rounded-xl
                px-4 py-2.5
                text-xs font-semibold
                text-muted-foreground
                transition-colors
                hover:bg-muted
                hover:text-foreground
            "
        >
            {children}
        </a>
    );
}

/* -------------------------------------------------------------------------- */
/* Core                                                                       */

/* -------------------------------------------------------------------------- */

function CoreSection() {
    return (
        <section
            id="core"
            className="scroll-mt-28"
        >
            <SectionHeader
                eyebrow="FEATURED PROJECTS"
                title="프로젝트 핵심 사항"
                description="프로젝트 안에서 어떤 문제가 있었고 이를 어떤 방식으로 해결했는지 중요한 사례만 정리했습니다."
            />

            <AccordionGuide/>

            <Accordion
                type="single"
                collapsible
                defaultValue="core-01"
                className="mt-5 space-y-5"
            >
                {coreFeatures.map(
                    (feature) => (
                        <CoreAccordionItem
                            key={feature.number}
                            feature={feature}
                        />
                    )
                )}
            </Accordion>
        </section>
    );
}

function CoreAccordionItem({
                               feature,
                           }: {
    feature: CoreFeature;
}) {
    return (
        <AccordionItem
            value={`core-${feature.number}`}
            className="
                overflow-hidden
                rounded-[26px]
                border border-border
                bg-background
                shadow-[0_12px_40px_rgba(15,23,42,0.05)]
                transition-all
                duration-200
                hover:border-[#B9C9F5]
                hover:shadow-[0_16px_48px_rgba(15,23,42,0.08)]
                data-[state=open]:border-[#AFC2F5]
            "
        >
            <AccordionTrigger
                className="
                    group
                    cursor-pointer
                    px-5 py-6
                    hover:no-underline
                    hover:bg-muted/15
                    sm:px-7
                    [&>svg]:hidden
                "
            >
                <AccordionHeader
                    number={feature.number}
                    numberColor="text-[#315FEA]"
                    title={feature.title}
                    summary={feature.summary}
                    technologies={feature.technologies}
                    status={feature.status}
                />
            </AccordionTrigger>

            <AccordionContent
                className="
                    px-5 pb-7 pt-0
                    sm:px-7
                "
            >
                <div
                    className="
                        space-y-4
                        border-t border-border
                        pt-6
                    "
                >
                    <StarSection
                        type="situation"
                        english="SITUATION"
                        title="상황"
                    >
                        {feature.situation}
                    </StarSection>

                    <StarSection
                        type="task"
                        english="TASK"
                        title="과제"
                    >
                        {feature.task}
                    </StarSection>

                    <StarSection
                        type="action"
                        english="ACTION"
                        title="실행"
                    >
                        {feature.action}
                    </StarSection>

                    <StarSection
                        type="result"
                        english="RESULT"
                        title="결과"
                    >
                        {feature.result}
                    </StarSection>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}

/* -------------------------------------------------------------------------- */
/* Troubleshooting                                                            */

/* -------------------------------------------------------------------------- */

function TroubleshootingSection() {
    return (
        <section
            id="troubleshooting"
            className="scroll-mt-28"
        >
            <SectionHeader
                eyebrow="TROUBLE SHOOTING"
                title="트러블슈팅"
                description="개발 과정에서 실제로 해결했거나 비동기 구조로 전환하면서 새롭게 다뤄야 했던 실패 조건을 정리했습니다."
            />

            <AccordionGuide/>

            <Accordion
                type="single"
                collapsible
                className="mt-5 space-y-5"
            >
                {troubleshootingItems.map(
                    (item) => (
                        <TroubleshootingAccordionItem
                            key={item.number}
                            item={item}
                        />
                    )
                )}
            </Accordion>
        </section>
    );
}

function TroubleshootingAccordionItem({
                                          item,
                                      }: {
    item: TroubleshootingItem;
}) {
    return (
        <AccordionItem
            value={`trouble-${item.number}`}
            className="
                overflow-hidden
                rounded-[26px]
                border border-border
                bg-background
                shadow-[0_12px_40px_rgba(15,23,42,0.05)]
                transition-all
                duration-200
                hover:border-[#F0B7B9]
                hover:shadow-[0_16px_48px_rgba(15,23,42,0.08)]
                data-[state=open]:border-[#E8A8AC]
            "
        >
            <AccordionTrigger
                className="
                    group
                    cursor-pointer
                    px-5 py-6
                    hover:no-underline
                    hover:bg-muted/15
                    sm:px-7
                    [&>svg]:hidden
                "
            >
                <AccordionHeader
                    number={item.number}
                    numberColor="text-[#D5574F]"
                    title={item.title}
                    summary={item.summary}
                    technologies={item.technologies}
                    status={item.status}
                />
            </AccordionTrigger>

            <AccordionContent
                className="
                    px-5 pb-7 pt-0
                    sm:px-7
                "
            >
                <div
                    className="
                        space-y-4
                        border-t border-border
                        pt-6
                    "
                >
                    {item.content}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}

/* -------------------------------------------------------------------------- */
/* Failure Injection                                                          */

/* -------------------------------------------------------------------------- */

function FailureInjectionSection() {
    return (
        <section
            id="failure-test"
            className="scroll-mt-28"
        >
            <SectionHeader
                eyebrow="RELIABILITY TEST"
                title="장애 주입 테스트"
                description="각 구성요소를 의도적으로 중단해 예상한 복구 경로가 실제로 동작하는지 검증합니다."
                badge="검증 예정"
            />

            <div
                className="
                    mt-7
                    rounded-[20px]
                    border border-[#E4D39E]
                    bg-[#FFFCF4]
                    p-5
                    dark:border-[#5F5636]
                    dark:bg-[#292419]
                "
            >
                <div className="flex gap-3">
                    <FlaskConical
                        className="
                            mt-1 size-5 shrink-0
                            text-[#9B7C29]
                        "
                    />

                    <p
                        className="
                            break-keep
                            text-sm leading-7
                            text-muted-foreground
                        "
                    >
                        각 실험은
                        <Strong>
                            {" "}장애 시뮬레이션 → 예상 문제 →
                            대안·해결방안 → 판정 기준 →
                            실제 결과 → 결론
                        </Strong>
                        순서로 기록합니다.
                    </p>
                </div>
            </div>

            <AccordionGuide/>

            <Accordion
                type="single"
                collapsible
                className="mt-5 space-y-5"
            >
                {failureExperiments.map(
                    (experiment) => (
                        <FailureAccordionItem
                            key={experiment.number}
                            experiment={experiment}
                        />
                    )
                )}
            </Accordion>
        </section>
    );
}

function FailureAccordionItem({
                                  experiment,
                              }: {
    experiment: FailureExperiment;
}) {
    return (
        <AccordionItem
            value={`failure-${experiment.number}`}
            className="
                overflow-hidden
                rounded-[26px]
                border border-border
                bg-background
                shadow-[0_12px_40px_rgba(15,23,42,0.05)]
                transition-all
                duration-200
                hover:border-[#E2D19A]
                hover:shadow-[0_16px_48px_rgba(15,23,42,0.08)]
                data-[state=open]:border-[#D4BD73]
            "
        >
            <AccordionTrigger
                className="
                    group
                    cursor-pointer
                    px-5 py-6
                    hover:no-underline
                    hover:bg-muted/15
                    sm:px-7
                    [&>svg]:hidden
                "
            >
                <AccordionHeader
                    number={experiment.number}
                    numberColor="text-[#A17C20]"
                    title={experiment.title}
                    summary={experiment.summary}
                    technologies={experiment.technologies}
                    status="planned"
                />
            </AccordionTrigger>

            <AccordionContent
                className="
                    px-5 pb-7 pt-0
                    sm:px-7
                "
            >
                <div
                    className="
                        space-y-4
                        border-t border-border
                        pt-6
                    "
                >
                    <FailureSection
                        type="simulation"
                        english="FAILURE SIMULATION"
                        title="장애 시뮬레이션"
                    >
                        {experiment.simulation}
                    </FailureSection>

                    <FailureSection
                        type="problem"
                        english="PROBLEM"
                        title="예상 문제"
                    >
                        {experiment.problem}
                    </FailureSection>

                    <FailureSection
                        type="action"
                        english="ACTION"
                        title="대안 · 해결 방안"
                    >
                        {experiment.action}
                    </FailureSection>

                    <FailureSection
                        type="result"
                        english="RESULT"
                        title="판정 기준"
                    >
                        {experiment.criteria}

                        <div
                            className="
                                mt-5 grid gap-3
                                sm:grid-cols-2
                            "
                        >
                            <PendingResult
                                title="실제 결과"
                                description="장애 주입 후 Metric, 로그, DB 상태를 작성합니다."
                            />

                            <PendingResult
                                title="결론"
                                description="예상과 실제 차이 및 설계 수정 내용을 작성합니다."
                            />
                        </div>
                    </FailureSection>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}

/* -------------------------------------------------------------------------- */
/* Additional                                                                 */

/* -------------------------------------------------------------------------- */

function AdditionalDesignSection() {
    return (
        <section>
            <SectionHeader
                eyebrow="ADDITIONAL DESIGN"
                title="추가 설계"
                description="일정 생성 파이프라인 이외의 구현은 핵심 내용만 간결하게 정리했습니다."
            />

            <div
                className="
                    mt-8 grid gap-4
                    md:grid-cols-2
                "
            >
                <AdditionalCard
                    icon={<Database className="size-5"/>}
                    title="Input / Candidate Snapshot"
                    description="Generation 생성 당시의 입력과 Worker가 실제 사용한 후보를 보존해 이후 데이터 변경과 과거 실행을 분리했습니다."
                    tags={[
                        "InputSnapshot",
                        "CandidateSnapshot",
                    ]}
                />

                <AdditionalCard
                    icon={<Radio className="size-5"/>}
                    title="실시간 상태 전달"
                    description="상태 변경은 DB Commit 이후 WebSocket으로 전달하고 Push 실패 시 REST로 DB 상태를 다시 조회합니다."
                    tags={[
                        "WebSocket",
                        "STOMP",
                        "REST Recovery",
                    ]}
                />

                <AdditionalCard
                    icon={<Activity className="size-5"/>}
                    title="Observability"
                    description="Worker 처리량, Retry, 처리시간, Generation 상태를 Metric으로 노출해 비동기 내부 상태를 관찰합니다."
                    tags={[
                        "Prometheus",
                        "Grafana",
                    ]}
                />

                <AdditionalCard
                    icon={<KeyRound className="size-5"/>}
                    title="Authentication"
                    description="Local/OAuth2 인증을 하나의 사용자 모델로 연결하고 JWT와 Redis 기반 Refresh Session을 사용했습니다."
                    tags={[
                        "Spring Security",
                        "JWT",
                        "Redis",
                    ]}
                />
            </div>
        </section>
    );
}

/* -------------------------------------------------------------------------- */
/* Retrospective                                                              */

/* -------------------------------------------------------------------------- */

function RetrospectiveSection() {
    return (
        <section>
            <SectionHeader
                eyebrow="RETROSPECTIVE"
                title="왜 RabbitMQ와 Debezium까지 사용했는가"
            />

            <div
                className="
                    mt-8
                    rounded-[24px]
                    border border-border
                    bg-muted/20
                    p-6
                    sm:p-8
                "
            >
                <p
                    className="
                        max-w-[860px]
                        break-keep
                        text-sm leading-8
                        text-muted-foreground
                        sm:text-base
                    "
                >
                    현재 PlanMate의 규모만 보면
                    RabbitMQ와 Debezium이 반드시 필요한 것은 아닙니다.
                    단순히 오래 걸리는 작업을 HTTP 요청에서 분리하는 것이
                    목적이라면 @Async나 DB Polling Worker도
                    충분히 고려할 수 있습니다.
                </p>

                <p
                    className="
                        mt-5
                        max-w-[860px]
                        break-keep
                        text-sm leading-8
                        text-muted-foreground
                        sm:text-base
                    "
                >
                    이 프로젝트에서는
                    <Strong>
                        {" "}ACK, Redelivery, Retry, DLQ,
                        Transactional Outbox, CDC,
                        Consumer 멱등성과 장애 복구
                    </Strong>
                    를 직접 설계하고
                    장애를 주입해 확인하는 것까지
                    학습 범위에 포함했습니다.
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                    {[
                        "ACK",
                        "Redelivery",
                        "Retry",
                        "DLQ",
                        "Outbox",
                        "CDC",
                        "Idempotency",
                        "Failure Recovery",
                    ].map((item) => (
                        <TechnologyPill key={item}>
                            {item}
                        </TechnologyPill>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* -------------------------------------------------------------------------- */
/* Accordion Common                                                           */

/* -------------------------------------------------------------------------- */

function AccordionGuide() {
    return (
        <div
            className="
                mt-7
                flex items-center gap-2
                text-xs
                text-muted-foreground
            "
        >
            <span
                className="
                    flex size-6
                    items-center justify-center
                    rounded-full
                    border border-border
                    bg-background
                "
            >
                <ChevronDown className="size-3.5"/>
            </span>

            <span>
                각 항목을 클릭하면 상세 내용을 확인할 수 있습니다.
            </span>
        </div>
    );
}

function AccordionHeader({
                             number,
                             numberColor,
                             title,
                             summary,
                             technologies,
                             status,
                         }: {
    number: string;
    numberColor: string;
    title: string;
    summary: string;
    technologies: readonly string[];
    status: StatusType;
}) {
    return (
        <div
            className="
                flex min-w-0
                flex-1 items-start
                gap-4 pr-1
            "
        >
            <div
                className="
                    min-w-0
                    flex-1 text-left
                "
            >
                <span
                    className={`
                        text-sm font-bold
                        tabular-nums
                        ${numberColor}
                    `}
                >
                    {number}
                </span>

                <div
                    className="
                        mt-2
                        flex flex-col gap-4
                        xl:flex-row
                        xl:items-start
                        xl:justify-between
                    "
                >
                    <div className="min-w-0 max-w-[640px]">
                        <div
                            className="
                                flex flex-wrap
                                items-center gap-2
                            "
                        >
                            <h3
                                className="
                                    break-keep
                                    text-xl font-bold
                                    leading-[1.45]
                                "
                            >
                                {title}
                            </h3>

                            <StatusBadge status={status}/>
                        </div>

                        <p
                            className="
                                mt-2
                                break-keep
                                text-sm leading-7
                                text-muted-foreground
                            "
                        >
                            {summary}
                        </p>
                    </div>

                    <div
                        className="
                            flex shrink-0
                            flex-col
                            items-start gap-3
                            xl:items-end
                        "
                    >
                        <div className="flex flex-wrap gap-2 xl:justify-end">
                            {technologies.map(
                                (technology) => (
                                    <TechnologyPill
                                        key={technology}
                                    >
                                        {technology}
                                    </TechnologyPill>
                                )
                            )}
                        </div>

                        <DisclosureHint/>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DisclosureHint() {
    return (
        <span
            className="
                inline-flex h-9
                shrink-0
                items-center gap-2
                rounded-full
                border border-border
                bg-background
                px-3.5
                text-[11px] font-semibold
                text-muted-foreground
                shadow-sm
                transition-all
                group-hover:border-[#AFC2F5]
                group-hover:text-foreground
                group-hover:shadow-md
            "
        >
            <span className="group-data-[state=open]:hidden">
                상세 보기
            </span>

            <span
                className="
                    hidden
                    group-data-[state=open]:inline
                "
            >
                접기
            </span>

            <ChevronDown
                className="
                    size-3.5
                    transition-transform
                    duration-200
                    group-data-[state=open]:rotate-180
                "
            />
        </span>
    );
}

/* -------------------------------------------------------------------------- */
/* Common                                                                     */

/* -------------------------------------------------------------------------- */

function SectionHeader({
                           eyebrow,
                           title,
                           description,
                           badge,
                       }: {
    eyebrow: string;
    title: string;
    description?: string;
    badge?: string;
}) {
    return (
        <div>
            <div className="flex items-center gap-3">
                <span
                    className="
                        inline-flex
                        rounded-full
                        border border-[#D7E1FF]
                        bg-white
                        px-4 py-2
                        text-[11px] font-semibold
                        text-[#315FEA]
                        dark:border-blue-900
                        dark:bg-background
                    "
                >
                    {eyebrow}
                </span>

                {badge && (
                    <span
                        className="
                            rounded-full
                            border border-[#E1D19F]
                            bg-[#FAF6EA]
                            px-2.5 py-1
                            text-[9px] font-bold
                            text-[#9B7C29]
                            dark:border-[#5F5636]
                            dark:bg-[#292419]
                        "
                    >
                        {badge}
                    </span>
                )}
            </div>

            <h2
                className="
                    mt-5
                    text-2xl font-bold
                    tracking-[-0.03em]
                    sm:text-3xl
                "
            >
                {title}
            </h2>

            {description && (
                <p
                    className="
                        mt-4
                        max-w-[820px]
                        break-keep
                        text-sm leading-7
                        text-muted-foreground
                    "
                >
                    {description}
                </p>
            )}
        </div>
    );
}

function StarSection({
                         type,
                         english,
                         title,
                         children,
                     }: {
    type: StarType;
    english: string;
    title: string;
    children: ReactNode;
}) {
    const styles = {
        situation: {
            border:
                "border-[#FFB8BC] dark:border-[#633D42]",

            background:
                "bg-[#FFF9F9] dark:bg-[#2C1E20]/40",

            text:
                "text-[#E33D48] dark:text-[#E4939A]",
        },

        task: {
            border:
                "border-[#EDCB73] dark:border-[#5F5636]",

            background:
                "bg-[#FFFCF5] dark:bg-[#292419]/40",

            text:
                "text-[#C67A11] dark:text-[#D9BC72]",
        },

        action: {
            border:
                "border-[#A8CAFF] dark:border-[#3E4C69]",

            background:
                "bg-[#F8FBFF] dark:bg-[#1B2230]/40",

            text:
                "text-[#3572F4] dark:text-[#91A9D7]",
        },

        result: {
            border:
                "border-[#9FE1C2] dark:border-[#3C5C49]",

            background:
                "bg-[#F7FDF9] dark:bg-[#19251E]/40",

            text:
                "text-[#159A69] dark:text-[#83B497]",
        },
    };

    const style = styles[type];

    return (
        <section
            className={`
                rounded-[24px]
                border
                px-5 py-5
                sm:px-6 sm:py-6
                ${style.border}
                ${style.background}
            `}
        >
            <div className="flex items-center gap-4">
                <span
                    className={`
                        text-[11px] font-bold
                        tracking-[0.08em]
                        ${style.text}
                    `}
                >
                    {english}
                </span>

                <h4 className="text-base font-bold">
                    {title}
                </h4>
            </div>

            <div className="mt-4 space-y-4">
                {children}
            </div>
        </section>
    );
}

function TroubleSection({
                            type,
                            english,
                            title,
                            children,
                        }: {
    type:
        | "situation"
        | "action"
        | "result";

    english: string;
    title: string;
    children: ReactNode;
}) {
    const mappedType: StarType =
        type === "situation"
            ? "situation"
            : type === "action"
                ? "action"
                : "result";

    return (
        <StarSection
            type={mappedType}
            english={english}
            title={title}
        >
            {children}
        </StarSection>
    );
}

function FailureSection({
                            type,
                            english,
                            title,
                            children,
                        }: {
    type:
        | "simulation"
        | "problem"
        | "action"
        | "result";

    english: string;
    title: string;
    children: ReactNode;
}) {
    const mappedType: StarType =
        type === "simulation" ||
        type === "problem"
            ? "situation"
            : type === "action"
                ? "action"
                : "result";

    return (
        <StarSection
            type={mappedType}
            english={english}
            title={title}
        >
            {children}
        </StarSection>
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
                break-keep
                text-sm leading-7
                text-muted-foreground
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

function BulletList({
                        items,
                    }: {
    items: readonly string[];
}) {
    return (
        <ul className="space-y-2.5">
            {items.map((item) => (
                <li
                    key={item}
                    className="
                        flex gap-2.5
                        text-sm leading-7
                        text-muted-foreground
                    "
                >
                    <CircleDot
                        className="
                            mt-[0.45rem]
                            size-3 shrink-0
                            text-muted-foreground/50
                        "
                    />

                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
}

function SimpleFlow({
                        items,
                        danger = false,
                    }: {
    items: readonly string[];
    danger?: boolean;
}) {
    return (
        <div
            className="
                mt-5
                flex flex-col gap-2
                xl:flex-row
                xl:items-center
            "
        >
            {items.map((item, index) => (
                <div
                    key={`${item}-${index}`}
                    className="
                        flex flex-1
                        flex-col gap-2
                        xl:flex-row
                        xl:items-center
                    "
                >
                    <div
                        className={`
                            flex min-h-11
                            flex-1
                            items-center justify-center
                            rounded-lg
                            border
                            px-2.5 py-2
                            text-center
                            text-[11px] font-semibold
                            ${
                            danger
                                ? "border-[#E7C5C8] bg-white/60 dark:border-[#633D42] dark:bg-black/10"
                                : "border-border bg-background"
                        }
                        `}
                    >
                        {item}
                    </div>

                    {index !==
                        items.length - 1 && (
                            <ArrowRight
                                className="
                                mx-auto
                                size-3.5
                                rotate-90
                                text-muted-foreground/30
                                xl:rotate-0
                            "
                            />
                        )}
                </div>
            ))}
        </div>
    );
}

function DualWriteDiagram() {
    return (
        <div
            className="
                mt-5
                grid max-w-[620px]
                gap-3
                sm:grid-cols-[1fr_auto_1fr]
                sm:items-center
            "
        >
            <OutcomeBox
                title="PostgreSQL"
                value="Generation COMMIT 성공"
                success
            />

            <ArrowRight
                className="
                    mx-auto
                    size-4
                    rotate-90
                    text-muted-foreground/30
                    sm:rotate-0
                "
            />

            <OutcomeBox
                title="RabbitMQ"
                value="Message Publish 실패 가능"
            />
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Compact Schedule Example                                                   */

/* -------------------------------------------------------------------------- */

function ScheduleExample() {
    return (
        <div
            className="
                mt-5
                w-full max-w-[440px]
                overflow-hidden
                rounded-xl
                border border-border
                bg-background
            "
        >
            <ScheduleRow
                place="서울숲"
                time="10:00 - 11:00"
            />

            <ScheduleRow
                place="성수 카페"
                time="10:30 - 12:00"
            />

            <div
                className="
                    border-t border-border
                    bg-[#FBF1F2]
                    px-4 py-3
                    text-xs font-semibold
                    text-[#B84F57]
                    dark:bg-[#2C1E20]
                    dark:text-[#E4939A]
                "
            >
                시간 중복 → 실제 일정으로 사용 불가
            </div>
        </div>
    );
}

function ScheduleRow({
                         place,
                         time,
                     }: {
    place: string;
    time: string;
}) {
    return (
        <div
            className="
                grid
                grid-cols-[minmax(100px,150px)_110px]
                items-center
                justify-start
                gap-5
                border-b border-border
                px-4 py-3
                last:border-b-0
            "
        >
            <span className="text-xs font-semibold">
                {place}
            </span>

            <span
                className="
                    text-xs
                    tabular-nums
                    text-muted-foreground
                "
            >
                {time}
            </span>
        </div>
    );
}

function CodePanel({
                       children,
                   }: {
    children: ReactNode;
}) {
    return (
        <pre
            className="
                mt-5
                max-w-[560px]
                overflow-x-auto
                rounded-xl
                bg-[#151515]
                p-4
                text-xs leading-6
                text-[#EEEEEE]
            "
        >
            <code>{children}</code>
        </pre>
    );
}

function ResultMetric({
                          children,
                      }: {
    children: ReactNode;
}) {
    return (
        <div
            className="
                inline-flex
                min-h-11
                items-center
                rounded-xl
                bg-[#EDF8F2]
                px-4 py-2.5
                text-sm font-medium
                text-[#276849]
                dark:bg-[#24352C]
                dark:text-[#9DCEAF]
            "
        >
            {children}
        </div>
    );
}

function LearningNote({
                          children,
                      }: {
    children: ReactNode;
}) {
    return (
        <div
            className="
                mt-5
                flex max-w-[850px]
                gap-3
                text-sm leading-7
                text-muted-foreground
            "
        >
            <span className="shrink-0">
                💡
            </span>

            <p>
                <span className="font-semibold text-foreground">
                    배운 점:
                </span>{" "}
                {children}
            </p>
        </div>
    );
}

function PendingNotice({
                           children,
                       }: {
    children: ReactNode;
}) {
    return (
        <div
            className="
                max-w-[850px]
                rounded-xl
                border border-dashed
                border-[#D7C58D]
                bg-[#FFFDF7]
                p-4
                text-sm leading-7
                text-muted-foreground
                dark:border-[#5F5636]
                dark:bg-black/10
            "
        >
            <div className="flex gap-3">
                <TriangleAlert
                    className="
                        mt-1
                        size-4 shrink-0
                        text-[#9B7C29]
                    "
                />

                <div>{children}</div>
            </div>
        </div>
    );
}

function MetricList({
                        items,
                    }: {
    items: readonly string[];
}) {
    return (
        <div
            className="
                grid max-w-[760px]
                gap-2
                sm:grid-cols-2
            "
        >
            {items.map((item) => (
                <div
                    key={item}
                    className="
                        flex items-center
                        justify-between gap-4
                        rounded-xl
                        bg-[#EDF8F2]
                        px-4 py-3
                        text-xs
                        dark:bg-[#24352C]
                    "
                >
                    <span className="font-medium">
                        {item}
                    </span>

                    <span
                        className="
                            shrink-0
                            text-[10px] font-semibold
                            text-[#41765A]
                            dark:text-[#83B497]
                        "
                    >
                        측정 예정
                    </span>
                </div>
            ))}
        </div>
    );
}

function OutcomeBox({
                        title,
                        value,
                        success = false,
                    }: {
    title: string;
    value: string;
    success?: boolean;
}) {
    return (
        <div
            className={`
                rounded-xl
                border
                px-4 py-3.5
                ${
                success
                    ? "border-[#BDD9C7] bg-[#EEF7F1] dark:border-[#3C5C49] dark:bg-[#19251E]"
                    : "border-[#E7C5C8] bg-[#FBF1F2] dark:border-[#633D42] dark:bg-[#2C1E20]"
            }
            `}
        >
            <p className="text-xs font-semibold">
                {title}
            </p>

            <p
                className="
                    mt-1.5
                    text-xs
                    text-muted-foreground
                "
            >
                {value}
            </p>
        </div>
    );
}

function PendingResult({
                           title,
                           description,
                       }: {
    title: string;
    description: string;
}) {
    return (
        <div
            className="
                rounded-xl
                border border-dashed
                border-[#B9DCC9]
                bg-white/60
                p-4
                dark:border-[#3C5C49]
                dark:bg-black/10
            "
        >
            <div className="flex items-center gap-2">
                <p className="text-xs font-semibold">
                    {title}
                </p>

                <span
                    className="
                        rounded-full
                        bg-muted
                        px-2 py-0.5
                        text-[9px] font-bold
                        text-muted-foreground
                    "
                >
                    PENDING
                </span>
            </div>

            <p
                className="
                    mt-2
                    text-xs leading-6
                    text-muted-foreground
                "
            >
                {description}
            </p>
        </div>
    );
}

function StatusBadge({
                         status,
                     }: {
    status: StatusType;
}) {
    const styles = {
        implemented:
            "border-[#BDD9C7] bg-[#EEF7F1] text-[#41765A] dark:border-[#3C5C49] dark:bg-[#19251E] dark:text-[#83B497]",

        partial:
            "border-[#C8D6F0] bg-[#F1F4FA] text-[#496AA8] dark:border-[#3E4C69] dark:bg-[#1B2230] dark:text-[#91A9D7]",

        planned:
            "border-[#E1D19F] bg-[#FAF6EA] text-[#9B7C29] dark:border-[#5F5636] dark:bg-[#292419] dark:text-[#D9BC72]",
    };

    const labels = {
        implemented: "구현 완료",
        partial: "검증 진행",
        planned: "검증 예정",
    };

    return (
        <span
            className={`
                inline-flex h-6
                items-center
                rounded-full
                border
                px-2.5
                text-[9px] font-bold
                ${styles[status]}
            `}
        >
            {labels[status]}
        </span>
    );
}

function TechnologyPill({
                            children,
                        }: {
    children: ReactNode;
}) {
    return (
        <span
            className="
                inline-flex h-8
                items-center
                rounded-full
                border border-[#C9D8FF]
                bg-[#F7F9FF]
                px-3
                text-[11px] font-medium
                text-[#315FEA]
                dark:border-blue-900
                dark:bg-blue-950/20
                dark:text-blue-300
            "
        >
            {children}
        </span>
    );
}

function TechBadge({
                       name,
                       icon: Icon,
                   }: {
    name: string;
    icon: ComponentType<{
        className?: string;
    }>;
}) {
    return (
        <div
            className="
                inline-flex h-8
                items-center gap-2
                rounded-full
                border border-border
                bg-background
                px-3
            "
        >
            <Icon className="size-4"/>

            <span className="text-[11px] font-semibold">
                {name}
            </span>
        </div>
    );
}

function ExternalButton({
                            href,
                            icon,
                            children,
                        }: {
    href: string;
    icon: ReactNode;
    children: ReactNode;
}) {
    return (
        <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="
                inline-flex h-10
                items-center gap-2
                rounded-full
                border border-border
                bg-background
                px-4
                text-xs font-semibold
                transition-colors
                hover:bg-muted
            "
        >
            {icon}

            {children}

            <ArrowUpRight className="size-3.5"/>
        </Link>
    );
}

function AdditionalCard({
                            icon,
                            title,
                            description,
                            tags,
                        }: {
    icon: ReactNode;
    title: string;
    description: string;
    tags: readonly string[];
}) {
    return (
        <div
            className="
                rounded-[22px]
                border border-border
                bg-background
                p-6
            "
        >
            <div className="text-muted-foreground">
                {icon}
            </div>

            <h3 className="mt-4 text-base font-bold">
                {title}
            </h3>

            <p
                className="
                    mt-3
                    break-keep
                    text-sm leading-7
                    text-muted-foreground
                "
            >
                {description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <TechnologyPill key={tag}>
                        {tag}
                    </TechnologyPill>
                ))}
            </div>
        </div>
    );
}