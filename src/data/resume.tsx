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
    description: "서버 백엔드 개발자",

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
        {
            href: "/",
            icon: HomeIcon,
            label: "Home",
        },
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
            href: "https://tomatosystem.co.kr/kr/index.php",
            badges: [],
            location: "대한민국",
            title: "웹 개발자",
            logoUrl: "/tmt.png",
            start: "2025.07",
            end: "2026.02",
            description: [
                "자사 UI 솔루션(eXBuilder6)을 활용한 업무 화면 개발과 Java 기반 서비스 로직 구현을 담당했습니다.",
                "기존 시스템의 업무 기능을 차세대 시스템으로 마이그레이션하며 화면과 서버 기능을 개발했습니다.",
            ],
        },
    ],

    education: [
        {
            school: "F-Lab",
            href: "https://f-lab.kr/mentoring-courses/java-backend",
            degree: "백엔드 개발자 멘토링",
            logoUrl: "/flab.png",
            start: "2026.02",
            end: "2026.08",
        },
        {
            school: "KOSTA 한국소프트웨어기술진흥협회",
            href: "https://kostaswedu.co.kr/faq/?q=YToxOntzOjEyOiJrZXl3b3JkX3R5cGUiO3M6MzoiYWxsIjt9&bmode=view&idx=121204706&t=board",
            degree: "클라우드 네이티브 애플리케이션 개발(CNA) 전문가 양성과정",
            logoUrl: "/kosta.png",
            start: "2024.11",
            end: "2025.05",
        },
        {
            school: "고용노동부",
            href: "https://www.work24.go.kr/cm/c/f/1100/selecSystInfo.do?currentPageNo=1&recordCountPerPage=10&systClId=SC00000197&systId=SI00000423&upprSystClId=SC00000031",
            degree: "프로젝트 기반 빅데이터 분석 인재 양성과정",
            logoUrl: "/goyong.png",
            start: "2023.06",
            end: "2023.12",
        },
    ],

    projects: [
        {
            category: "업무 프로젝트",
            title: "전북대학교 차세대 통합정보시스템",
            subtitle: "직원채용 및 학사 교류 업무 개발",
            href: "",
            dates: "2025.09 - 2026.02",
            active: false,
            organization: "토마토시스템",

            description:
                "기존 대학 행정 시스템의 화면·서버·DB 구조를 분석하고 차세대 시스템으로 전환한 프로젝트입니다.\n" +
                "\n" +
                "**기술 구현**\n" +
                "- Nexacro 화면을 eXBuilder6 구조로 전환\n" +
                "- 화면 요청값과 서버 파라미터 매핑 구현\n" +
                "- 직원채용·학사 교류 CRUD 구현\n" +
                "- Oracle 업무 쿼리 분석 및 MyBatis Mapper로 재구성\n" +
                "\n" +
                "**문제 해결**\n" +
                "\n" +
                "개발 과정에서 발견한 ERD 관계, PK/FK 설정, 공통코드 구조의 설계 이슈를\n" +
                "설계자와 협의하여 개선하고 데이터 정합성을 확보했습니다.",

            technologies: [
                "Java",
                "Spring",
                "Oracle",
                "MyBatis",
                "eXBuilder6",
            ],

            links: [],
            image: "/jbnu.png",
            video: "",
        },

        {
            category: "개인 프로젝트",
            title: "PlanMate",
            subtitle: "AI 기반 여행 일정 생성 서비스",
            href: "/projects/planmate",
            dates: "2026 - 진행 중",
            active: true,
            organization: "개인 프로젝트",

            description:
                "사용자 조건을 기반으로 실제 장소 후보를 수집하고 검증 가능한 AI 일정을 생성하는 서비스입니다.\n" +
                "\n" +
                "**기술 구현**\n" +
                "- Google Places 응답 정규화 및 후보 저장\n" +
                "- 관심사·거리·유형 기반 필터링과 점수화\n" +
                "- placeId 검증 후 일정 데이터 저장\n" +
                "- Outbox·Debezium·RabbitMQ 기반 비동기 처리\n" +
                "\n" +
                "**설계 포인트**\n" +
                "\n" +
                "DB 저장과 메시지 발행의 정합성을 Outbox로 보완하고, Worker 상태를 Prometheus·Grafana로 추적했습니다.",

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
    ],
} as const;