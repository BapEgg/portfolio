import {Icons} from "@/components/icons";
import {HomeIcon, NotebookIcon} from "lucide-react";
import {ReactLight} from "@/components/ui/svgs/reactLight";
import {Typescript} from "@/components/ui/svgs/typescript";
import {Postgresql} from "@/components/ui/svgs/postgresql";
import {Docker} from "@/components/ui/svgs/docker";
import {Java} from "@/components/ui/svgs/java";
import {SpringBoot} from "@/components/ui/svgs/springBoot";
import {SpringSecurity} from "@/components/ui/svgs/springSecurity";
import {Redis} from "@/components/ui/svgs/redis";
import {RabbitMq} from "@/components/ui/svgs/rabbitmq";
import {Nginx} from "@/components/ui/svgs/nginx";
import {Prometheus} from "@/components/ui/svgs/prometheus";
import {Grafana} from "@/components/ui/svgs/grafana";
import {Debezium} from "@/components/ui/svgs/debezium";
import {GithubActions} from "@/components/ui/svgs/githubActions";

export const DATA = {
    name: "이지수",
    initials: "LJS",
    url: "https://portfolio-bapegg.vercel.app",
    location: "대한민국, 서울",
    locationLink: "",
    description:
        "서버 백엔드 개발자",
    summary: [
        "복잡한 업무 요구사항을 이해하고, 이를 명확한 데이터 흐름과 백엔드 로직으로 정리하는 데 강점이 있습니다.",
        "실무에서는 기존 시스템을 분석하며 정확성과 안정성을 익혔고, 개인 프로젝트에서는 익숙하지 않은 비동기 처리와 메시징 구조를 직접 설계하며 기술 범위를 넓혀 왔습니다.",
        "모르는 기술을 단순히 적용하는 데 그치지 않고, 선택 이유와 한계를 끝까지 확인하고 기록하는 방식으로 개발합니다.",
    ],
    avatarUrl: "/me.png",
    skills: [
        {name: "Java", icon: Java},
        {name: "Spring Boot", icon: SpringBoot},
        {name: "Spring Security", icon: SpringSecurity},
        {name: "PostgreSQL", icon: Postgresql},
        {name: "Redis", icon: Redis},
        {name: "RabbitMQ", icon: RabbitMq},
        {name: "Debezium", icon: Debezium},
        {name: "Docker", icon: Docker},
        {name: "Nginx", icon: Nginx},
        {name: "Prometheus", icon: Prometheus},
        {name: "Grafana", icon: Grafana},
        {name: "GitHub Actions", icon: GithubActions},
        {name: "React", icon: ReactLight},
        {name: "TypeScript", icon: Typescript},
    ],
    navbar: [
        {href: "/", icon: HomeIcon, label: "Home"},
        {
            href: "https://velog.io/@bapegg/posts",
            icon: NotebookIcon,
            label: "Velog",
        },
    ],

    contact: {
        email: "lkhejj1@gmail.com",
        tel: "",
        social: {
            GitHub: {
                name: "GitHub",
                url: "https://github.com/BapEgg",
                icon: Icons.github,
                navbar: true,
            },

            email: {
                name: "Email",
                url: "mailto:lkhejj1@gmail.com",
                icon: Icons.email,
                navbar: true,
            },
        },
    },

    work: [
        {
            company: "토마토시스템",
            href: "https://www.tomatosystem.co.kr",
            badges: [],
            location: "대한민국",
            title: "웹 개발자",
            logoUrl: "/tmt.png",
            start: "2025.07",
            end: "2026.02",
            description: [
                "전북대학교 차세대 통합정보시스템 구축 프로젝트 참여",
                "기존 Nexacro 기반 화면을 자사 UI 솔루션인 eXBuilder6 기반으로 전환하는 마이그레이션 수행",
                "기존 업무 쿼리와 데이터 구조를 분석하고, 차세대 시스템 요구사항을 반영한 Oracle·MyBatis 쿼리로 재구성",
                "수기로 작성하던 직원채용 지원서와 제출 서류를 온라인에서 입력·저장·조회·제출할 수 있도록 화면과 업무 로직 구현",
                "마이그레이션 과정에서 발생한 데이터 정합성, 화면 연계 및 운영 이슈 대응",
            ],
        },
    ],
    education: [
        {
            school: "F-Lab",
            href: "",
            degree: "백엔드 개발자 멘토링",
            logoUrl: "/flab.png",
            start: "2026.02",
            end: "2026.08",
        },
        {
            school: "KOSTA 한국소프트웨어기술진흥협회",
            href: "",
            degree: "클라우드 네이티브 애플리케이션 개발(CNA) 전문가 양성과정",
            logoUrl: "/kosta.png",
            start: "2024.11",
            end: "2025.05",
        },
        {
            school: "고용노동부",
            href: "",
            degree: "프로젝트 기반 빅데이터 분석 인재 양성과정",
            logoUrl: "/goyong.png",
            start: "2023.06",
            end: "2023.12",
        },
    ],
    projects: [
        {
            title: "PlanMate",
            href: "https://github.com/f-lab-edu/plan-mate",
            dates: "2026",
            active: true,
            description:
                "사용자의 여행 조건과 선호를 바탕으로 후보 장소를 수집하고, AI가 여행 일정을 생성하는 여행 계획 서비스입니다.",
            technologies: [
                "Java 21",
                "Spring Boot",
                "Spring Security",
                "PostgreSQL",
                "Redis",
                "RabbitMQ",
                "Debezium",
                "Docker",
                "Nginx",
                "Prometheus",
                "Grafana",
                "React",
                "TypeScript",
            ],
            links: [
                {
                    type: "GitHub",
                    href: "https://github.com/f-lab-edu/plan-mate",
                    icon: <Icons.github className="size-3"/>,
                },
                {
                    type: "Velog",
                    href: "https://velog.io/@bapegg/posts",
                    icon: <Icons.globe className="size-3"/>,
                },
            ],
            image: "/planmate.png",
            video: "",
        },
    ]
} as const;
