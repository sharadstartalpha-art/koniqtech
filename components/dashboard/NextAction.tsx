import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface Props {
    title: string;
    description: string;
    href: string;
    progress: number;
}

export default function NextAction({
    title,
    description,
    href,
    progress,
}: Props) {
    return (
        <div className="bg-white border rounded-3xl p-8">

            <div className="flex justify-between items-start">

                <div>

                    <div className="flex items-center gap-2">

                        <CheckCircle2
                            className="text-orange-500"
                            size={20}
                        />

                        <span className="text-orange-600 font-semibold">
                            Next Recommended Step
                        </span>

                    </div>

                    <h2 className="text-3xl font-semibold mt-4">
                        {title}
                    </h2>

                    <p className="text-slate-500 mt-2 max-w-xl">
                        {description}
                    </p>

                </div>

                <div className="text-right">

                    <div className="text-3xl font-bold">
                        {progress}%
                    </div>

                    <div className="text-sm text-slate-500">
                        Completed
                    </div>

                </div>

            </div>

            <div className="mt-6 h-3 bg-slate-100 rounded-full">

                <div
                    className="h-3 rounded-full bg-orange-500 transition-all"
                    style={{
                        width: `${progress}%`,
                    }}
                />

            </div>

            <Link
                href={href}
                className="inline-flex items-center gap-2 mt-8 bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-5 py-3 font-medium transition"
            >
                Continue
                <ArrowRight size={18} />
            </Link>

        </div>
    );
}