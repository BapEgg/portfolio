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
            "generationId를 먼저 반환하고 후보 수집과 외부 API 작업은 RabbitMQ Worker가 이어서 처리하도록 책임을 분리했습니다.",

        technologies: [
            "RabbitMQ",
            "Worker",
            "Generation",
        ],

        status: "implemented",

        situation: (
            <>
                <Paragraph>
                    일정 생성에는 Google Places를 이용한 후보 수집처럼
                    응답 시간과 장애 여부를 애플리케이션이 직접 통제하기 어려운
                    외부 API 호출이 포함됩니다.
                </Paragraph>

                <Paragraph>
                    이를 하나의 HTTP 요청에서 끝까지 처리하면
                    사용자 요청의 생명주기가
                    후보 수집과 외부 API의 처리 시간에 종속됩니다.
                </Paragraph>

                <SimpleFlow
                    items={[
                        "HTTP 요청",
                        "후보 수집",
                        "Google Places",
                        "후보 저장",
                        "일정 준비",
                        "HTTP 응답",
                    ]}
                    danger
                />
            </>
        ),

        task: (
            <BulletList
                items={[
                    "사용자 HTTP 요청과 오래 걸리는 Background Job의 생명주기 분리",
                    "HTTP 응답 종료 후에도 후보 수집 작업이 계속될 수 있는 실행 구조 확보",
                    "Generation 단위 상태 추적",
                    "Retry · Redelivery · 장애 복구가 가능한 Worker 실행 경계 확보",
                ]}
            />
        ),

        action: (
            <>
                <Paragraph>
                    요청 스레드는 Generation과
                    실행 시점의 InputSnapshot을 생성하고
                    <Strong>
                        {" "}generationId를 반환하는 것까지
                    </Strong>
                    담당하도록 책임을 줄였습니다.
                </Paragraph>

                <Paragraph>
                    실제 후보 수집은 RabbitMQ Message를 소비하는
                    Worker가 처리합니다.
                    이후 진행 상태는 Generation 상태로 관리합니다.
                </Paragraph>

                <SimpleFlow
                    items={[
                        "HTTP Request",
                        "Generation 생성",
                        "Outbox 저장",
                        "generationId 반환",
                        "RabbitMQ",
                        "Worker",
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
                            요청 생명주기와 분리
                        </strong>
                    </ResultMetric>

                    <ResultMetric>
                        작업 추적
                        <strong className="ml-1">
                            Generation 기반
                        </strong>
                    </ResultMetric>
                </div>

                <LearningNote>
                    비동기 전환의 목적을 단순히
                    처리 시간을 줄이는 것으로 잡지 않았습니다.
                    사용자 요청과 실제 작업 실행의 책임을 분리하고,
                    이후 실패·재실행을 다룰 수 있는 경계를 만드는 것을
                    우선했습니다.
                </LearningNote>
            </>
        ),
    },

    {
        number: "02",

        title:
            "DB 저장과 메시지 전달 사이의 작업 유실 방지",

        summary:
            "Transactional Outbox와 Debezium CDC를 적용해 DB Commit과 RabbitMQ Publish의 Dual Write 문제를 분리했습니다.",

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
                    Generation을 PostgreSQL에 저장한 직후
                    애플리케이션이 RabbitMQ로 직접 Message를 발행하면
                    두 작업은 서로 다른 시스템에 기록됩니다.
                </Paragraph>

                <DualWriteDiagram/>

                <Paragraph>
                    DB Commit은 성공했지만
                    Message Publish가 실패하면
                    DB에는 처리할 작업이 존재하지만
                    Worker는 그 작업의 존재를 알 수 없습니다.
                </Paragraph>
            </>
        ),

        task: (
            <BulletList
                items={[
                    "Generation 저장과 작업 전달 의도를 하나의 DB Transaction으로 보존",
                    "PostgreSQL과 RabbitMQ를 하나의 원자적 Transaction처럼 취급하지 않기",
                    "Message Publish 실패가 Business Transaction을 깨뜨리지 않도록 장애 경계 분리",
                    "CDC 중단 이후에도 전달 작업을 다시 시작할 수 있는 구조 확보",
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
                        {" "}동일 PostgreSQL Transaction
                    </Strong>
                    에서 저장했습니다.
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
                    Debezium은 PostgreSQL WAL에서
                    Outbox 변경을 읽어 RabbitMQ로 전달합니다.
                    따라서 Application은 RabbitMQ Publish 성공 여부를
                    Business Transaction 안에서 책임지지 않습니다.
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
                        실패 경계
                        <strong className="ml-1">
                            CDC 복구 문제로 전환
                        </strong>
                    </ResultMetric>
                </div>

                <LearningNote>
                    Outbox를 적용한다고 장애가 사라지는 것은 아니었습니다.
                    대신 DB와 MQ를 동시에 성공시켜야 하는 문제를
                    DB에 전달 의도를 먼저 보존하고
                    CDC를 다시 실행할 수 있는 문제로 바꿨습니다.
                </LearningNote>
            </>
        ),
    },

    {
        number: "03",

        title:
            "At-least-once 환경에서 재실행 가능한 Worker 설계",

        summary:
            "Message 중복 전달과 Worker 중단을 전제로 Claim · Lease · Fencing을 적용해 오래된 실행 결과가 최신 상태를 덮어쓰지 못하도록 했습니다.",

        technologies: [
            "At-least-once",
            "Claim",
            "Lease",
            "Fencing",
            "DLQ",
        ],

        status: "implemented",

        situation: (
            <>
                <Paragraph>
                    RabbitMQ에서는 Worker가 DB 처리를 완료한 뒤
                    ACK를 전송하기 전에 종료되면
                    동일 Message가 다시 전달될 수 있습니다.
                </Paragraph>

                <SimpleFlow
                    items={[
                        "Message",
                        "Worker A",
                        "DB 작업",
                        "ACK 전 장애",
                        "Redelivery",
                        "Worker B",
                    ]}
                    danger
                />

                <Paragraph>
                    더 어려운 문제는 Worker A가 완전히 종료된 것이 아니라
                    장시간 멈췄다가 늦게 다시 실행되는 경우입니다.
                    Worker B가 이미 복구 작업을 완료한 뒤
                    Worker A가 늦게 저장하면
                    최신 결과를 오래된 실행이 덮어쓸 수 있습니다.
                </Paragraph>
            </>
        ),

        task: (
            <BulletList
                items={[
                    "중복 Message를 제거하는 대신 중복 전달 자체를 정상 시나리오로 취급",
                    "현재 Generation을 처리할 권한이 있는 Worker 식별",
                    "처리 권한이 만료된 Stale Worker의 Write 차단",
                    "COLLECTING_CANDIDATES에 고착된 Generation 자동 탐지 및 재전달",
                    "반복 실패 Message를 Retry 후 DLQ로 격리",
                ]}
            />
        ),

        action: (
            <>
                <Paragraph>
                    Generation에
                    <Strong>
                        {" "}collectionClaimVersion
                    </Strong>
                    과
                    <Strong>
                        {" "}processing lease
                    </Strong>
                    를 도입했습니다.
                </Paragraph>

                <SimpleFlow
                    items={[
                        "Message 수신",
                        "Claim 획득",
                        "claimVersion 증가",
                        "후보 수집",
                        "Claim 재검증",
                        "READY 저장",
                    ]}
                />

                <BulletList
                    items={[
                        "기본 Processing Lease 15분",
                        "Worker가 Claim할 때마다 collectionClaimVersion 증가",
                        "후보 저장과 FAILED 전환 직전 현재 Claim 소유권 재검증",
                        "이전 claimVersion을 가진 Worker의 늦은 성공/실패 결과는 무시",
                        "Lease 만료 Generation을 Scheduler가 조회해 RabbitMQ로 자동 재전달",
                        "기본 1분 간격 Stale Scan · 최대 50건 Batch Recovery",
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
                        Stale Write
                        <strong className="ml-1">
                            Claim Version으로 차단
                        </strong>
                    </ResultMetric>

                    <ResultMetric>
                        Stuck Job
                        <strong className="ml-1">
                            Lease 만료 후 자동 재전달
                        </strong>
                    </ResultMetric>
                </div>

                <LearningNote>
                    멱등성을 단순히
                    “이미 처리했으면 return”으로 끝내지 않고,
                    동시에 여러 실행이 존재할 수 있다는 상황까지 확장했습니다.
                    재실행 가능한 Worker와
                    오래된 실행을 차단하는 Fencing을 함께 사용했습니다.
                </LearningNote>
            </>
        ),
    },

    {
        number: "04",

        title:
            "형식상 정상인 AI 결과를 실제 실행 가능한 일정인지 검증",

        summary:
            "Candidate whitelist · 시간 · 사용자 제약뿐 아니라 실제 인접 장소 이동시간까지 서버에서 검증하도록 Validation 경계를 확장했습니다.",

        technologies: [
            "Validation",
            "Candidate",
            "Routes",
            "Domain Rule",
        ],

        status: "implemented",

        situation: (
            <>
                <Paragraph>
                    AI가 JSON Schema와 DTO 형식을 만족하더라도
                    실제 여행 일정으로 사용할 수 없는 결과가
                    만들어질 수 있습니다.
                </Paragraph>

                <ScheduleExample/>

                <Paragraph>
                    시간 중복뿐 아니라
                    존재하지 않는 Candidate 사용,
                    같은 장소 반복,
                    회피 조건 위반,
                    실제 이동시간보다 짧은 일정 간격도
                    구조 검증만으로는 판단할 수 없습니다.
                </Paragraph>
            </>
        ),

        task: (
            <BulletList
                items={[
                    "서버가 제공한 Candidate whitelist 밖의 placeId 차단",
                    "시간 중복 · 일일 활동 가능 시간 · 순서 검증",
                    "필수 방문 · 회피 조건 검증",
                    "같은 장소 반복 탐지",
                    "인접 일정 사이 실제 이동시간 검증",
                    "일정 자체의 오류와 Routes Provider 장애를 서로 다른 실패로 분리",
                ]}
            />
        ),

        action: (
            <>
                <SimpleFlow
                    items={[
                        "AI Draft",
                        "Structure",
                        "Candidate",
                        "Time",
                        "Constraint",
                        "Routes",
                    ]}
                />

                <Paragraph>
                    인접 장소의 좌표를 CandidateSnapshot에서 가져와
                    Google Routes Adapter를 통해 이동시간을 조회합니다.
                    이전 일정 종료 시각과 다음 일정 시작 시각 사이의
                    여유 시간보다 실제 이동시간이 길면
                    Validation Error로 처리합니다.
                </Paragraph>

                <CodePanel>
                    {`availableTravelTime
= next.startTime - previous.endTime

if (
    requiredRouteTime > availableTravelTime
) {
    INSUFFICIENT_TRAVEL_TIME
}`}
                </CodePanel>
            </>
        ),

        result: (
            <>
                <div className="flex flex-wrap gap-2">
                    <ResultMetric>
                        Domain Validation
                        <strong className="ml-1">
                            실패 시 422
                        </strong>
                    </ResultMetric>

                    <ResultMetric>
                        Routes 장애
                        <strong className="ml-1">
                            Provider Failure로 분리
                        </strong>
                    </ResultMetric>

                    <ResultMetric>
                        잘못된 일정
                        <strong className="ml-1">
                            DB Write 전 차단
                        </strong>
                    </ResultMetric>
                </div>

                <LearningNote>
                    AI를 일정 데이터의 최종 신뢰 주체로 두지 않았습니다.
                    AI는 결과를 생성하고,
                    서버가 현재 Snapshot과 도메인 규칙을 기준으로
                    저장 가능한 결과인지 최종 판단하도록 책임을 분리했습니다.
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
            "외부 Routes 호출이 DB Transaction을 오래 점유할 수 있는 문제",

        summary:
            "외부 I/O가 느려져도 DB Lock과 Write Transaction이 함께 길어지지 않도록 검증 단계와 저장 Transaction을 분리했습니다.",

        technologies: [
            "Transaction",
            "Pessimistic Lock",
            "Google Routes",
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
                        일정 검증과 저장 전체를 하나의
                        <Strong>
                            {" "}@Transactional
                        </Strong>
                        메서드에서 처리하면
                        Google Routes 같은 외부 API 호출 시간까지
                        DB Transaction 범위에 포함될 수 있습니다.
                    </Paragraph>

                    <SimpleFlow
                        items={[
                            "Transaction 시작",
                            "Generation Lock",
                            "Routes 호출",
                            "외부 응답 대기",
                            "일정 저장",
                            "COMMIT",
                        ]}
                        danger
                    />

                    <Paragraph>
                        외부 API가 느려질수록
                        DB Connection과 Row Lock도 함께 오래 유지될 수 있고,
                        같은 Generation을 처리하는 다른 요청의 대기시간까지
                        증가할 수 있습니다.
                    </Paragraph>
                </TroubleSection>

                <TroubleSection
                    type="action"
                    english="ACTION"
                    title="해결"
                >
                    <Paragraph>
                        외부 API가 필요한 Validation과
                        DB Write를 담당하는 Persistence Service를
                        서로 다른 경계로 분리했습니다.
                    </Paragraph>

                    <SimpleFlow
                        items={[
                            "Generation 조회",
                            "Validation",
                            "Routes 호출",
                            "외부 I/O 종료",
                            "Write Transaction",
                            "상태 재검증",
                        ]}
                    />

                    <BulletList
                        items={[
                            "Routes 호출은 Write Transaction 밖에서 수행",
                            "Validation 완료 후 짧은 Persistence Transaction 시작",
                            "저장 직전 Generation을 Pessimistic Lock으로 다시 조회",
                            "READY_FOR_PLANNING 상태를 다시 확인한 뒤 일정 저장",
                            "동시에 먼저 완료된 요청이 있다면 Replay 정책으로 처리",
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
                            External I/O
                            <strong className="ml-1">
                                DB Write Transaction 밖으로 분리
                            </strong>
                        </ResultMetric>

                        <ResultMetric>
                            동시성
                            <strong className="ml-1">
                                저장 직전 상태 재검증
                            </strong>
                        </ResultMetric>

                        <ResultMetric>
                            Lock
                            <strong className="ml-1">
                                Persistence 구간으로 축소
                            </strong>
                        </ResultMetric>
                    </div>

                    <LearningNote>
                        Transaction 범위를 넓게 잡는 것이
                        항상 더 안전한 것은 아니었습니다.
                        외부 I/O와 DB Transaction을 분리하되,
                        경계가 끊어진 사이 상태가 바뀔 수 있으므로
                        Write 직전에 다시 검증하는 방식으로 보완했습니다.
                    </LearningNote>
                </TroubleSection>
            </>
        ),
    },

    {
        number: "02",

        title:
            "복구 Worker보다 늦게 끝난 Stale Worker가 최신 결과를 덮어쓰는 문제",

        summary:
            "Processing Lease와 Claim Version을 이용한 Fencing으로 현재 처리 권한이 없는 Worker의 늦은 Write를 차단했습니다.",

        technologies: [
            "Lease",
            "Claim Version",
            "Fencing",
            "Recovery",
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
                        Worker A가 후보 수집 도중 장시간 멈추면
                        Generation은
                        COLLECTING_CANDIDATES 상태에 남습니다.
                    </Paragraph>

                    <SimpleFlow
                        items={[
                            "Worker A Claim",
                            "A 지연",
                            "Lease 만료",
                            "Worker B 복구",
                            "B 저장 완료",
                            "A 뒤늦게 복귀",
                        ]}
                        danger
                    />

                    <Paragraph>
                        단순 Retry만 적용하면
                        Worker B가 정상적으로 복구한 뒤
                        오래된 Worker A의 결과가 늦게 도착해
                        최신 상태를 덮어쓸 가능성이 생깁니다.
                    </Paragraph>
                </TroubleSection>

                <TroubleSection
                    type="action"
                    english="ACTION"
                    title="해결"
                >
                    <BulletList
                        items={[
                            "Generation마다 collectionClaimVersion 유지",
                            "Claim 획득 시 Version 증가",
                            "Claim과 함께 processing lease 만료시각 저장",
                            "후보 저장과 FAILED 전환 시 현재 Claim Version 재검증",
                            "현재 Version과 다른 Stale Worker 결과는 Write하지 않고 종료",
                            "Lease가 만료된 COLLECTING Generation은 Scheduler가 자동 재전달",
                        ]}
                    />

                    <SimpleFlow
                        items={[
                            "Claim v1",
                            "Lease 만료",
                            "Recovery",
                            "Claim v2",
                            "v2 저장",
                            "v1 저장 거절",
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
                            Stale Worker
                            <strong className="ml-1">
                                늦은 Write 차단
                            </strong>
                        </ResultMetric>

                        <ResultMetric>
                            Stuck Generation
                            <strong className="ml-1">
                                자동 재전달
                            </strong>
                        </ResultMetric>

                        <ResultMetric>
                            Recovery
                            <strong className="ml-1">
                                최신 Claim만 상태 변경
                            </strong>
                        </ResultMetric>
                    </div>

                    <LearningNote>
                        “중복 실행을 막는다”보다
                        중복 실행이 존재해도
                        최신 실행만 상태를 변경할 수 있도록 만드는 것이
                        더 안전한 복구 모델이라는 점을 확인했습니다.
                    </LearningNote>
                </TroubleSection>
            </>
        ),
    },

    {
        number: "03",

        title:
            "모든 실패를 Retry하면 복구 불가능한 작업까지 반복 실행되는 문제",

        summary:
            "외부 시스템의 일시 장애와 입력·도메인 오류를 분류해 Retry 가능한 실패만 재시도하고 최종 실패는 DLQ로 격리했습니다.",

        technologies: [
            "Failure Classification",
            "Retry",
            "DLX",
            "DLQ",
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
                        Worker에서 Exception이 발생했다는 이유만으로
                        동일한 Retry 정책을 적용하면
                        다시 실행해도 성공할 수 없는 실패까지
                        반복 처리하게 됩니다.
                    </Paragraph>

                    <SimpleFlow
                        items={[
                            "Invalid Input",
                            "Retry",
                            "같은 실패",
                            "Retry",
                            "같은 실패",
                            "Worker 자원 낭비",
                        ]}
                        danger
                    />
                </TroubleSection>

                <TroubleSection
                    type="action"
                    english="ACTION"
                    title="해결"
                >
                    <Paragraph>
                        WorkerFailureClassifier를 두고
                        실패를 Retryable과 Non-Retryable로 구분했습니다.
                    </Paragraph>

                    <div
                        className="
                            mt-5 grid
                            max-w-[760px]
                            gap-3
                            sm:grid-cols-2
                        "
                    >
                        <OutcomeBox
                            title="Retryable"
                            value="Provider 일시 장애 · Transient DB Error"
                            success
                        />

                        <OutcomeBox
                            title="Non-Retryable"
                            value="잘못된 입력 · 도메인 오류 · 설정 오류"
                        />
                    </div>

                    <BulletList
                        items={[
                            "Place Provider Timeout · 408 · 429 · 5xx 등은 Retryable로 분류",
                            "TransientDataAccessException은 Retryable",
                            "PlanMate 도메인 오류 · 잘못된 Worker 입력은 Non-Retryable",
                            "Non-Retryable 실패는 Retry Loop를 즉시 종료",
                            "최종 Worker 실패는 Listener 밖으로 전파",
                            "RabbitMQ Container가 reject하고 DLX를 통해 DLQ로 전달",
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
                            일시 장애
                            <strong className="ml-1">
                                제한적 Retry
                            </strong>
                        </ResultMetric>

                        <ResultMetric>
                            영구 실패
                            <strong className="ml-1">
                                불필요한 Retry 차단
                            </strong>
                        </ResultMetric>

                        <ResultMetric>
                            최종 실패
                            <strong className="ml-1">
                                DLQ 격리
                            </strong>
                        </ResultMetric>
                    </div>

                    <LearningNote>
                        Retry 횟수를 정하는 것보다
                        무엇을 Retry해야 하는지 먼저 정의하는 것이 중요했습니다.
                        실패의 성격을 분류하면서
                        Retry와 DLQ를 실제 복구 정책으로 연결했습니다.
                    </LearningNote>
                </TroubleSection>
            </>
        ),
    },

    {
        number: "04",

        title:
            "정합성을 위해 만든 Outbox가 계속 누적되는 운영 문제",

        summary:
            "CDC 원본 Event를 무기한 보관하지 않도록 보존 기간과 Batch Cleanup을 적용하고 삭제 작업 자체가 DB 부하가 되지 않도록 범위를 제한했습니다.",

        technologies: [
            "Outbox",
            "Retention",
            "Batch Delete",
            "Scheduler",
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
                        Transactional Outbox를 적용하면
                        일정 생성 요청마다 outbox_events Row가 추가됩니다.
                    </Paragraph>

                    <SimpleFlow
                        items={[
                            "Generation",
                            "Outbox 생성",
                            "Debezium 전달",
                            "처리 완료",
                            "Row 유지",
                            "계속 누적",
                        ]}
                        danger
                    />

                    <Paragraph>
                        메시지 전달 신뢰성을 위해 도입한 테이블이
                        운영 기간이 길어질수록 계속 증가하면
                        조회와 삭제 자체가 새로운 운영 비용이 됩니다.
                    </Paragraph>
                </TroubleSection>

                <TroubleSection
                    type="action"
                    english="ACTION"
                    title="해결"
                >
                    <BulletList
                        items={[
                            "Outbox 기본 보존 기간 7일",
                            "기본 Cleanup 주기 1시간",
                            "한 번에 최대 1,000건만 삭제",
                            "created_at · id 순으로 오래된 Event부터 bounded batch delete",
                            "Scheduler 실패 시 다음 주기에 다시 실행",
                            "Retention Enabled · 기간 · 주기 · Batch Size를 설정으로 분리",
                        ]}
                    />

                    <CodePanel>
                        {`DELETE
                          FROM outbox_events
                          WHERE id IN (SELECT id
                                       FROM outbox_events
                                       WHERE created_at < :cutoff
                                       ORDER BY created_at, id
                              LIMIT :batchSize
                              )`}
                    </CodePanel>
                </TroubleSection>

                <TroubleSection
                    type="result"
                    english="RESULT"
                    title="결과"
                >
                    <div className="flex flex-wrap gap-2">
                        <ResultMetric>
                            Retention
                            <strong className="ml-1">
                                기본 7일
                            </strong>
                        </ResultMetric>

                        <ResultMetric>
                            Cleanup
                            <strong className="ml-1">
                                1,000건 단위
                            </strong>
                        </ResultMetric>

                        <ResultMetric>
                            Scheduler
                            <strong className="ml-1">
                                실패 후 다음 주기 재시도
                            </strong>
                        </ResultMetric>
                    </div>

                    <LearningNote>
                        패턴을 적용하는 것에서 끝내지 않고
                        그 패턴이 장기간 운영될 때
                        어떤 데이터를 언제까지 보존할지도
                        설계의 일부라는 점을 다뤘습니다.
                    </LearningNote>
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
            "CDC가 중단된 동안 DB에 누적된 Outbox Event가 Connector 재기동 후 이어서 전달되는지 실제 환경에서 확인합니다.",

        technologies: [
            "Debezium",
            "WAL",
            "Offset",
        ],

        simulation: (
            <BulletList
                items={[
                    "정상 상태에서 Generation + Outbox 생성",
                    "Debezium Container 강제 종료",
                    "Connector 중단 상태에서 Generation 추가 생성",
                    "Outbox Row와 RabbitMQ Queue 상태 비교",
                    "Debezium 재기동",
                ]}
            />
        ),

        problem: (
            <>
                <Paragraph>
                    CDC 중단 중에는
                    Outbox Event가 DB에는 존재하지만
                    RabbitMQ로 전달되지 않습니다.
                </Paragraph>

                <Paragraph>
                    재기동 이후 중단 구간의 Event가
                    유실되지 않고 이어서 전달되는지
                    실제 WAL · Offset 기준으로 확인해야 합니다.
                </Paragraph>
            </>
        ),

        action: (
            <BulletList
                items={[
                    "Business 데이터와 Outbox Event를 동일 Transaction으로 영속화",
                    "PostgreSQL WAL 기반 CDC",
                    "Debezium Offset을 통한 처리 위치 복구",
                    "Application Transaction과 CDC 실행 상태 분리",
                ]}
            />
        ),

        criteria: (
            <MetricList
                items={[
                    "중단 중 생성된 Outbox Event 수",
                    "재기동 후 RabbitMQ 전달 수",
                    "Event 유실 건수",
                    "READY 전환 완료 건수",
                    "Connector 복구 시간",
                ]}
            />
        ),
    },

    {
        number: "02",

        title:
            "DB 반영 후 ACK 이전 Worker 강제 종료",

        summary:
            "ACK 이전 장애로 Message가 재전달되어도 동일 Generation의 최종 상태와 데이터가 일관되게 유지되는지 확인합니다.",

        technologies: [
            "ACK",
            "Redelivery",
            "Claim",
            "Idempotency",
        ],

        simulation: (
            <BulletList
                items={[
                    "Worker Message Consume",
                    "Generation Claim 획득",
                    "후보 데이터 처리",
                    "ACK 이전 Worker Process 강제 종료",
                    "Worker 재기동 후 Redelivery 확인",
                ]}
            />
        ),

        problem: (
            <Paragraph>
                DB 처리와 ACK 사이에서 장애가 발생하면
                RabbitMQ는 작업 성공 여부를 알 수 없어
                같은 Message를 다시 전달할 수 있습니다.
            </Paragraph>
        ),

        action: (
            <BulletList
                items={[
                    "At-least-once 전달 모델 전제",
                    "Generation Claim Version",
                    "State Guard",
                    "후보 Snapshot Replace",
                    "DB Constraint",
                    "현재 Claim 소유권 기반 최종 Write",
                ]}
            />
        ),

        criteria: (
            <MetricList
                items={[
                    "Redelivery 횟수",
                    "중복 Candidate 건수",
                    "Generation READY 전환 횟수",
                    "Worker processed result",
                    "최종 복구 시간",
                ]}
            />
        ),
    },

    {
        number: "03",

        title:
            "Debezium Offset 유실과 과거 Event Replay",

        summary:
            "이미 처리한 Outbox Event가 다시 전달되어도 Downstream 결과가 한 번 처리한 것과 동일하게 유지되는지 확인합니다.",

        technologies: [
            "Offset",
            "Replay",
            "At-least-once",
            "Fencing",
        ],

        simulation: (
            <BulletList
                items={[
                    "Outbox Event 정상 처리 완료",
                    "Debezium Offset 상태 초기화",
                    "Connector 재기동",
                    "과거 Event Replay 확인",
                    "Worker와 Generation 상태 관찰",
                ]}
            />
        ),

        problem: (
            <Paragraph>
                Offset 정보가 사라지면
                이미 처리한 Event가 다시 전달될 수 있습니다.
                따라서 Downstream이 정확히 한 번 전달을
                전제로 구현되어 있으면 데이터 중복이나 상태 충돌이 발생할 수 있습니다.
            </Paragraph>
        ),

        action: (
            <BulletList
                items={[
                    "Exactly-once 전달을 전제로 하지 않음",
                    "Generation 상태와 Claim 기반 실행 판단",
                    "최종 Write 전 Claim Version 재검증",
                    "DB Constraint를 최종 불변식으로 사용",
                ]}
            />
        ),

        criteria: (
            <MetricList
                items={[
                    "Replay Event 수",
                    "중복 Candidate 건수",
                    "중복 Itinerary 건수",
                    "비정상 상태 전이 건수",
                    "Skipped Worker 수",
                ]}
            />
        ),
    },

    {
        number: "04",

        title:
            "Retryable / Non-Retryable 실패와 DLQ 전환",

        summary:
            "일시 장애는 제한적으로 재시도하고 복구 불가능한 오류는 불필요한 Retry 없이 DLQ로 격리되는지 확인합니다.",

        technologies: [
            "Retry",
            "Failure Classifier",
            "DLX",
            "DLQ",
        ],

        simulation: (
            <BulletList
                items={[
                    "Google Places 5xx 또는 Timeout 강제 발생",
                    "Retry Count 관찰",
                    "잘못된 Worker 입력으로 Non-Retryable 오류 발생",
                    "Retry 여부 비교",
                    "최종 Reject 후 DLQ Routing 확인",
                ]}
            />
        ),

        problem: (
            <Paragraph>
                실패의 종류를 구분하지 않으면
                일시 장애와 영구 장애 모두 같은 횟수만큼 반복되어
                Worker 자원과 정상 Message 처리 기회를 낭비할 수 있습니다.
            </Paragraph>
        ),

        action: (
            <BulletList
                items={[
                    "WorkerFailureClassifier 적용",
                    "Provider 일시 장애와 Transient DB 오류만 Retry",
                    "도메인·입력 오류는 Non-Retryable 처리",
                    "최종 실패 Exception을 Listener 밖으로 전달",
                    "RabbitMQ Reject → DLX → DLQ",
                ]}
            />
        ),

        criteria: (
            <MetricList
                items={[
                    "Retryable 실패의 Retry 횟수",
                    "Non-Retryable 실패의 Retry 횟수",
                    "DLQ Message 수",
                    "정상 Queue 처리 영향",
                    "Worker Failed Metric",
                ]}
            />
        ),
    },

    {
        number: "05",

        title:
            "Worker 장기 정지와 Stale Generation 자동 복구",

        summary:
            "Lease가 만료된 COLLECTING_CANDIDATES 작업이 자동으로 다시 Queue에 들어가고 오래된 Worker 결과는 무시되는지 확인합니다.",

        technologies: [
            "Lease",
            "Stale",
            "Recovery Scheduler",
            "Fencing",
        ],

        simulation: (
            <BulletList
                items={[
                    "Worker가 Generation Claim 획득",
                    "COLLECTING_CANDIDATES 상태에서 Worker 장기 중단",
                    "Processing Lease 만료",
                    "Recovery Scheduler 동작 확인",
                    "새 Worker 처리 후 기존 Worker 늦게 재개",
                ]}
            />
        ),

        problem: (
            <Paragraph>
                Worker가 사라지면 Generation이
                COLLECTING_CANDIDATES 상태에 영구 고착될 수 있고,
                이전 Worker가 뒤늦게 살아날 경우
                복구 Worker와 결과 경쟁이 발생할 수 있습니다.
            </Paragraph>
        ),

        action: (
            <BulletList
                items={[
                    "Processing Lease 기본 15분",
                    "Stale Recovery Scan 기본 1분",
                    "한 Scan에서 최대 50건 조회",
                    "Expired Generation을 RabbitMQ로 재발행",
                    "새 Claim Version 발급",
                    "이전 Claim의 늦은 Write는 Fencing으로 차단",
                ]}
            />
        ),

        criteria: (
            <MetricList
                items={[
                    "Stale 탐지 시간",
                    "Recovery Message 발행 수",
                    "새 Worker 완료 수",
                    "Stale Worker Write 차단 수",
                    "최종 READY 복구 시간",
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

                        <span
                            className="
                                text-base font-bold
                                text-[#315FEA]
                                sm:text-lg
                                dark:text-blue-300
                            "
                        >
                            장애 복구 설계 · 검증
                        </span>
                    </div>

                    <p
                        className="
                            mx-auto mt-4
                            max-w-[830px]
                            break-keep
                            text-sm leading-7
                            text-muted-foreground
                        "
                    >
                        HTTP–Worker 책임 분리부터
                        Outbox·CDC,
                        At-least-once,
                        Claim·Fencing,
                        실패 분류와 DLQ까지
                        비동기 작업의 실패와 재실행 경계를 구현했습니다.
                        복구 로직은 자동 테스트로 검증하고,
                        실제 프로세스·컨테이너 장애 주입은 별도 Reliability Test로 확인합니다.
                    </p>
                </div>

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
                    실제 장소 후보를 기반으로
                    검증 가능한 AI 여행 일정을 생성하는 서비스입니다.
                    사용자 조건에 따라 장소 후보를 수집하고,
                    AI가 만든 결과를 서버의 도메인 규칙과
                    실제 이동 가능성을 기준으로 다시 검증한 뒤 저장합니다.
                </p>
            </div>

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
                        result="→ Transactional Outbox · Debezium CDC"
                    />

                    <HeroCoreItem
                        number="03"
                        title="재실행 가능한 Worker"
                        result="→ At-least-once · Claim/Fencing · Retry/DLQ"
                    />

                    <HeroCoreItem
                        number="04"
                        title="AI 일정 의미 검증"
                        result="→ Candidate · Time · Constraint · Routes"
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
                description="비동기 처리 자체보다 작업이 실패하거나 다시 실행되는 상황까지 고려해 설계한 핵심 사례를 정리했습니다."
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
                description="기능 구현 자체보다 비동기·외부 I/O·동시 실행·운영 과정에서 발생할 수 있는 실패 경계를 중심으로 정리했습니다."
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
                description="복구 로직과 자동 테스트는 구현했습니다. 다음 단계에서는 실제 프로세스와 컨테이너를 중단해 설계한 복구 경로가 운영 환경에서도 동일하게 동작하는지 검증합니다."
                badge="실제 장애 주입 예정"
            />

            <div
                className="
                    mt-7
                    rounded-[20px]
                    border border-[#B9DCC9]
                    bg-[#F7FDF9]
                    p-5
                    dark:border-[#3C5C49]
                    dark:bg-[#19251E]
                "
            >
                <div className="flex gap-3">
                    <Activity
                        className="
                            mt-1 size-5 shrink-0
                            text-[#159A69]
                        "
                    />

                    <p
                        className="
                            break-keep
                            text-sm leading-7
                            text-muted-foreground
                        "
                    >
                        <Strong>
                            복구 구조 · 자동 테스트 구현 완료.
                        </Strong>{" "}
                        아래 PENDING은 기능 미구현을 의미하지 않습니다.
                        실제 Docker Container 중단,
                        Worker Process Kill,
                        Offset 초기화 등
                        운영 장애 주입 결과가 아직 기록되지 않았다는 의미입니다.
                    </p>
                </div>
            </div>

            <div
                className="
                    mt-4
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
                        실험은
                        <Strong>
                            {" "}장애 시뮬레이션 → 예상 문제 →
                            구현된 복구 방안 → 판정 기준 →
                            실제 결과 → 설계 수정
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
                        title="구현된 복구 방안"
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
                                description="장애 주입 후 Metric · 로그 · RabbitMQ · DB 상태를 기록합니다."
                            />

                            <PendingResult
                                title="결론"
                                description="예상과 실제의 차이, 복구 시간과 추가 설계 변경 사항을 기록합니다."
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
                description="일정 생성의 신뢰성 흐름 이외의 설계는 핵심 역할만 간결하게 정리했습니다."
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
                    description="Generation 생성 당시의 여행 조건과 Worker가 실제로 확정한 Candidate 집합을 저장해 외부 데이터가 변경되더라도 과거 실행의 판단 근거를 보존했습니다."
                    tags={[
                        "InputSnapshot",
                        "CandidateSnapshot",
                        "Reproducibility",
                    ]}
                />

                <AdditionalCard
                    icon={<Radio className="size-5"/>}
                    title="실시간 상태 전달"
                    description="Generation 상태 변경은 DB Commit 이후 WebSocket으로 전달하고 Push를 놓친 경우 REST 재조회로 DB 상태를 복구하도록 구성했습니다."
                    tags={[
                        "WebSocket",
                        "STOMP",
                        "AFTER_COMMIT",
                        "REST Recovery",
                    ]}
                />

                <AdditionalCard
                    icon={<Activity className="size-5"/>}
                    title="Observability"
                    description="Worker 처리 결과·Retry·Stale Generation뿐 아니라 Candidate 수, AI Validation 성공/차단, Issue Severity와 Code를 Metric으로 노출하고 Grafana에서 일정 생성 파이프라인을 관찰하도록 구성했습니다."
                    tags={[
                        "Prometheus",
                        "Grafana",
                        "Candidate Metric",
                        "Validation Metric",
                    ]}
                />

                <AdditionalCard
                    icon={<KeyRound className="size-5"/>}
                    title="Authentication"
                    description="Local/OAuth2 인증을 하나의 사용자 모델로 연결하고 JWT Access Token과 Redis 기반 Refresh Session을 사용했습니다."
                    tags={[
                        "Spring Security",
                        "JWT",
                        "OAuth2",
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
                        max-w-[900px]
                        break-keep
                        text-sm leading-8
                        text-muted-foreground
                        sm:text-base
                    "
                >
                    현재 PlanMate의 트래픽과 규모만 보면
                    RabbitMQ와 Debezium이 반드시 필요한 구조는 아닙니다.
                    단순히 오래 걸리는 작업을 HTTP 요청 밖으로 옮기는 것이
                    목적이었다면 @Async나 DB Polling Worker도
                    더 단순한 대안이 될 수 있습니다.
                </p>

                <p
                    className="
                        mt-5
                        max-w-[900px]
                        break-keep
                        text-sm leading-8
                        text-muted-foreground
                        sm:text-base
                    "
                >
                    이 프로젝트에서는 단순 비동기 구현보다
                    <Strong>
                        {" "}DB와 Message Broker 사이의 정합성,
                        At-least-once 전달,
                        ACK와 Redelivery,
                        Consumer 멱등성,
                        Stale Worker,
                        Fencing,
                        Retry와 DLQ,
                        Outbox Retention
                    </Strong>
                    까지 직접 구현하면서
                    비동기 작업이 실패하고 다시 실행될 때의
                    상태 변화를 학습 범위로 잡았습니다.
                </p>

                <p
                    className="
                        mt-5
                        max-w-[900px]
                        break-keep
                        text-sm leading-8
                        text-muted-foreground
                        sm:text-base
                    "
                >
                    현재 복구 정책과 자동 테스트 구현까지 완료했고,
                    다음 단계에서는
                    Worker Kill,
                    Debezium 중단,
                    Offset Replay 같은 실제 장애를 주입해
                    구현된 복구 경로와 Metric이 예상대로 동작하는지
                    확인합니다.
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                    {[
                        "Outbox",
                        "CDC",
                        "At-least-once",
                        "Claim",
                        "Lease",
                        "Fencing",
                        "Retry",
                        "DLQ",
                        "Retention",
                        "Observability",
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
                    <div className="min-w-0 max-w-[680px]">
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
            <div className="flex flex-wrap items-center gap-3">
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
                        max-w-[850px]
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
/* Schedule Example                                                           */

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
                max-w-[620px]
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
                flex max-w-[880px]
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

function MetricList({
                        items,
                    }: {
    items: readonly string[];
}) {
    return (
        <div
            className="
                grid max-w-[800px]
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
                        실험 측정
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

        planned:
            "border-[#E1D19F] bg-[#FAF6EA] text-[#9B7C29] dark:border-[#5F5636] dark:bg-[#292419] dark:text-[#D9BC72]",
    };

    const labels = {
        implemented: "구현 완료",
        planned: "실험 예정",
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