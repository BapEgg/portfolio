import type {SVGProps} from "react";
import {siSpring} from "simple-icons/icons";

export function SpringSecurity(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            role="img"
            aria-label="Spring Security"
            fill={`#${siSpring.hex}`}
            {...props}
        >
            <path d={siSpring.path}/>
        </svg>
    );
}