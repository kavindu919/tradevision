import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const SearchBar = () => {
  return (
    <div className="relative w-full ">
      <Search className=" absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search by name asset (e.g RSI BTC/USD)"
        className="pl-10 border bg-card border-border text-foreground"
      />
    </div>
  );
};
