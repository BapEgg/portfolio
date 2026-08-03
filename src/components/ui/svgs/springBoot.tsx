import type {SVGProps} from "react";
import {siSpringboot} from "simple-icons/icons";

export function SpringBoot(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            role="img"
            aria-label="Spring Boot"
            fill={`#${siSpringboot.hex}`}
            {...props}
        >
            <path d={siSpringboot.path}/>
        </svg>
    );
}