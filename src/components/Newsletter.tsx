import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for subscribing!");
    setEmail("");
  };

  return (
    <section className="py-20 bg-secondary/50">
      <div className="container px-6 mx-auto">
        <div className="max-w-2xl mx-auto text-center fade-in">
          <div className="inline-block glass-morphism px-4 py-1 rounded-full mb-6">
            <span className="text-sm font-medium">Stay Updated</span>
          </div>
          
          <h2 className="text-4xl font-bold mb-4">
            Join Our Newsletter
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8">
            Get the latest updates and news delivered directly to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="hover-lift">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;