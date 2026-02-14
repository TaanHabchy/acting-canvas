import { useToast } from "@/hooks/use-toast";

export default function ContactInfo() {
    const { toast } = useToast();

    const handleCopy = async (text: string, label: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast({
                title: `Copied to clipboard`,
                description: text,
                duration: 2000,
            });
        } catch (err) {
            toast({
                title: "Copy failed",
                description: "Unable to copy to clipboard",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="space-y-2 text-foreground/80">
            <p
                className="cursor-pointer"
                onClick={() => handleCopy("sharbelhabchy@gmail.com", "Email")}
            >
                Email: <span className={"hover:text-foreground transition-colors"}>sharbelhabchy@gmail.com</span>
            </p>
            <p
                className="cursor-pointer"
                onClick={() => handleCopy("(978) 407-9564", "Phone")}
            >
                Phone: <span className={"hover:text-foreground transition-colors"}>(978) 407-9564</span>
            </p>
            <p>Location: New York City</p>
        </div>
    );
}
