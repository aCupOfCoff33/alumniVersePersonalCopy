import React, { useEffect, useId, useRef, useState } from "react";
import { useOutsideClick } from "../hooks/use-outside-click"; 
import SearchBarWithFilter from "./SearchBarWithFilter";
import {DisplayGrid} from "./DisplayGrid";
import {cards} from "./cardsData"; 

export function ExpandableCardDemo() {
  const [active, setActive] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const filteredCards = cards.filter(
    (card) =>
      (card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedCompanies.length === 0 ||
        selectedCompanies.includes(card.description))
  );

  useOutsideClick(ref, () => setActive(null));

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(null);
      }
    };
    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div ref={ref}>
      <SearchBarWithFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCompanies={selectedCompanies}
        setSelectedCompanies={setSelectedCompanies}
      />
      <DisplayGrid
        filteredCards={filteredCards}
        active={active}
        setActive={setActive} 
        cardRef={React.createRef<HTMLDivElement>()} />
    </div>
  );
}
