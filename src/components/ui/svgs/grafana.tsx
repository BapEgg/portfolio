import type {SVGProps} from "react";
import {siGrafana} from "simple-icons/icons";

export function Grafana(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            role="img"
            aria-label="Grafana"
            fill={`#${siGrafana.hex}`}
            {...props}
        >
            <path d={siGrafana.path}/>
        </svg>
    );
}