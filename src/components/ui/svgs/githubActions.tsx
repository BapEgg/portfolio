import type {SVGProps} from "react";
import {siGithubactions} from "simple-icons/icons";

export function GithubActions(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            role="img"
            aria-label="GitHub Actions"
            fill={`#${siGithubactions.hex}`}
            {...props}
        >
            <path d={siGithubactions.path}/>
        </svg>
    );
}