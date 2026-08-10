/* eslint-disable @next/next/no-img-element */

"use client";

import {useState} from "react";
import Link from "next/link";
import {ArrowUpRight} from "lucide-react";

import {DATA} from "@/data/resume";

function LogoImage({
                       src,
                       alt,
                   }: {
    src: string;
    alt: string;
}) {
    const [imageError, setImageError] = useState(false);

    if (!src || imageError) {
        return (
            <div
                className="
                    size-8
                    md:size-10
                    p-1
                    border
                    rounded-full
                    shadow
                    ring-2
                    ring-border
                    bg-muted
                    flex-none
                "
            />
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className="
                size-8
                md:size-10
                p-1
                border
                rounded-full
                shadow
                ring-2
                ring-border
                overflow-hidden
                object-contain
                flex-none
            "
            onError={() => setImageError(true)}
        />
    );
}

export default function WorkSection() {
    return (
        <div className="w-full grid gap-8">
            {DATA.work.map((work) => (
                <div
                    key={work.company}
                    className="w-full grid gap-3"
                >
                    <div className="flex items-start gap-x-3 justify-between">
                        <Link
                            href={work.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${work.company} 홈페이지`}
                            className="
                                group
                                flex
                                items-center
                                gap-x-3
                                flex-1
                                min-w-0
                            "
                        >
                            <LogoImage
                                src={work.logoUrl}
                                alt={work.company}
                            />

                            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                                <div className="font-semibold leading-none flex items-center gap-2">
                                    {work.company}

                                    <ArrowUpRight
                                        className="
                                            h-3.5
                                            w-3.5
                                            text-muted-foreground
                                            opacity-0
                                            -translate-x-1
                                            transition-all
                                            duration-200

                                            group-hover:opacity-100
                                            group-hover:translate-x-0
                                        "
                                        aria-hidden
                                    />
                                </div>

                                <div className="font-sans text-sm text-muted-foreground">
                                    {work.title}
                                </div>
                            </div>
                        </Link>

                        <div
                            className="
                                flex
                                items-center
                                gap-1
                                text-xs
                                tabular-nums
                                text-muted-foreground
                                text-right
                                flex-none
                            "
                        >
                            <span>
                                {work.start} - {work.end ?? "현재"}
                            </span>
                        </div>
                    </div>

                    <div className="ml-11 md:ml-[52px]">
                        <ul className="space-y-1.5">
                            {work.description.map((item) => (
                                <li
                                    key={item}
                                    className="
                                        flex
                                        gap-2
                                        text-xs
                                        sm:text-sm
                                        leading-relaxed
                                        text-muted-foreground
                                    "
                                >
                                    <span
                                        aria-hidden
                                        className="flex-none"
                                    >
                                        •
                                    </span>

                                    <span>
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
}