/* eslint-disable @next/next/no-img-element */
"use client";

import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import {ArrowUpRight} from "lucide-react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useState} from "react";
import Markdown from "react-markdown";

type ProjectCategory = "업무 프로젝트" | "개인 프로젝트";

const categoryBadgeStyles: Record<ProjectCategory, string> = {
    "업무 프로젝트":
        "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
    "개인 프로젝트":
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
};

function ProjectImage({
                          src,
                          alt,
                      }: {
    src: string;
    alt: string;
}) {
    const [imageError, setImageError] = useState(false);

    if (!src || imageError) {
        return <div className="w-full h-48 bg-muted"/>;
    }

    return (
        <img
            src={src}
            alt={alt}
            className="w-full h-48 object-cover"
            onError={() => setImageError(true)}
        />
    );
}

interface Props {
    category: ProjectCategory;
    title: string;
    href?: string;
    description: string;
    dates: string;
    tags: readonly string[];
    link?: string;
    image?: string;
    video?: string;
    links?: readonly {
        icon: React.ReactNode;
        type: string;
        href: string;
    }[];
    className?: string;
}

export function ProjectCard({
                                category,
                                title,
                                href,
                                description,
                                dates,
                                tags,
                                link,
                                image,
                                video,
                                links,
                                className,
                            }: Props) {
    const router = useRouter();

    const isExternalHref =
        href?.startsWith("http://") ||
        href?.startsWith("https://");

    const handleCardClick = () => {
        if (!href) {
            return;
        }

        if (isExternalHref) {
            window.open(href, "_blank", "noopener,noreferrer");
            return;
        }

        router.push(href);
    };

    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLDivElement>
    ) => {
        if (!href) {
            return;
        }

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleCardClick();
        }
    };

    return (
        <div
            role={href ? "link" : undefined}
            tabIndex={href ? 0 : undefined}
            onClick={handleCardClick}
            onKeyDown={handleKeyDown}
            className={cn(
                "flex flex-col h-full border border-border rounded-xl overflow-hidden transition-all duration-200",
                href &&
                "cursor-pointer hover:ring-2 hover:ring-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                className
            )}
        >
            <div className="relative shrink-0">
                {video ? (
                    <video
                        src={video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster={image}
                        className="w-full h-48 object-cover"
                    />
                ) : image ? (
                    <ProjectImage
                        src={image}
                        alt={title}
                    />
                ) : (
                    <div className="w-full h-48 bg-muted"/>
                )}

                {links && links.length > 0 && (
                    <div className="absolute top-2 right-2 flex flex-wrap gap-2">
                        {links.map((projectLink, idx) => (
                            <Link
                                href={projectLink.href}
                                key={`${projectLink.type}-${idx}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(event) =>
                                    event.stopPropagation()
                                }
                                onKeyDown={(event) =>
                                    event.stopPropagation()
                                }
                            >
                                <Badge
                                    className="flex items-center gap-1.5 text-xs bg-black text-white hover:bg-black/90"
                                    variant="default"
                                >
                                    {projectLink.icon}
                                    {projectLink.type}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-6 flex flex-col gap-3 flex-1">
                <div className="border-b border-border pb-3">
                    <Badge
                        className={cn(
                            "w-fit border-0 px-3 py-1 text-xs font-semibold",
                            categoryBadgeStyles[category]
                        )}
                    >
                        {category}
                    </Badge>
                </div>

                <div className="flex min-h-[50px] items-start justify-between gap-2">
                    <div className="flex flex-col gap-1">
                        <h3 className="font-semibold">
                            {title}
                        </h3>

                        <time className="text-xs text-muted-foreground">
                            {dates}
                        </time>
                    </div>

                    {href && (
                        <Link
                            href={href}
                            target={
                                isExternalHref
                                    ? "_blank"
                                    : undefined
                            }
                            rel={
                                isExternalHref
                                    ? "noopener noreferrer"
                                    : undefined
                            }
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                            onKeyDown={(event) =>
                                event.stopPropagation()
                            }
                            className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                            aria-label={`${title} 열기`}
                        >
                            <ArrowUpRight
                                className="h-4 w-4"
                                aria-hidden
                            />
                        </Link>
                    )}
                </div>

                <div
                    className="text-xs flex-1 prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
                    <Markdown>{description}</Markdown>
                </div>

                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-auto">
                        {tags.map((tag) => (
                            <Badge
                                key={tag}
                                className="text-[11px] font-medium border border-border h-6 w-fit px-2"
                                variant="outline"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 