import type {SVGProps} from "react";
import {siRedis} from "simple-icons/icons";

export function Redis(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            role="img"
            aria-label="Redis"
            fill={`#${siRedis.hex}`}
            {...props}
        >
            <path d={siRedis.path}/>
        </svg>
    );
}