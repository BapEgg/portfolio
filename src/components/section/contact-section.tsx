import Link from "next/link";
import {FlickeringGrid} from "@/components/magicui/flickering-grid";
import {DATA} from "@/data/resume";

export default function ContactSection() {
    return (
        <div className="relative rounded-xl border p-10">
            <div className="absolute -top-4 left-1/2 z-10 -translate-x-1/2 rounded-xl border bg-primary px-4 py-1">
                <span className="text-sm font-medium text-background">Contact</span>
            </div>

            <div className="absolute inset-x-0 top-0 h-1/2 overflow-hidden rounded-xl">
                <FlickeringGrid
                    className="h-full w-full"
                    squareSize={2}
                    gridGap={2}
                    style={{
                        maskImage: "linear-gradient(to bottom, black, transparent)",
                        WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
                    }}
                />
            </div>

            <div className="relative flex flex-col items-center gap-4 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Contact
                </h2>

                <p className="mx-auto max-w-lg text-balance text-muted-foreground">
                    포트폴리오와 프로젝트에 관한 문의는{" "}
                    <Link
                        href={`mailto:${DATA.contact.email}`}
                        className="rounded-sm text-blue-500 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        이메일
                    </Link>
                    로 보내주세요.
                </p>
            </div>
        </div>
    );
}