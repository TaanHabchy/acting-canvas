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

  <a 
    href="https://www.instagram.com/sharbel_habchy/" 
    target="_blank" 
    rel="noopener noreferrer"
    className="bg-gradient-to-tr from-[#FD5949] via-[#D6249F] to-[#285AEB] bg-clip-text text-transparent font-semibold hover:opacity-80 transition-opacity"
  >
    Instagram
  </a>

    );
}
