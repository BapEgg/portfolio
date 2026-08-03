import type {SVGProps} from "react";
import {siRabbitmq} from "simple-icons/icons";

export function RabbitMq(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            role="img"
            aria-label="RabbitMQ"
            fill={`#${siRabbitmq.hex}`}
            {...props}
        >
            <path d={siRabbitmq.path}/>
        </svg>
    );
}