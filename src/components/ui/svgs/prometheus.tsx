import type {SVGProps} from "react";
import {siPrometheus} from "simple-icons/icons";

export function Prometheus(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            role="img"
            aria-label="Prometheus"
            fill={`#${siPrometheus.hex}`}
            {...props}
        >
            <path d={siPrometheus.path}/>
        </svg>
    );
}