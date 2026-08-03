import type {ComponentProps} from "react";

export function Debezium(props: ComponentProps<"img">) {
    return (
        <img
            src="/debeziumio-icon.svg"
            alt="Debezium"
            {...props}
        />
    );
}