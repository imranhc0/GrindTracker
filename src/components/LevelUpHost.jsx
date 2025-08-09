"use client";
import LevelUpOverlay from "@/components/LevelUpOverlay";
import { useApp } from "@/context/AppContext";

export default function LevelUpHost() {
  const { levelUpShow, setLevelUpShow, levelUpLevel } = useApp();
  
  return (
    <LevelUpOverlay 
      show={levelUpShow} 
      level={levelUpLevel} 
      onClose={() => setLevelUpShow(false)} 
    />
  );
}
