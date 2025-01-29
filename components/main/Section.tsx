import { cn } from "@/lib/utils";

interface UniversalSectionProps {
    children: React.ReactNode;
    className?: string;
}

export const UniversalSection = ({ children ,className}: UniversalSectionProps) => {
    return (
        <section className={cn("w-full h-fit px-5 md:px-7 lg:px-14 xl:px-36 2xl:px-56 py-14 md:py-20 xl:py-24 2xl:py-28 items-start justify-start", className)}>
            {children}
        </section>
    );
};